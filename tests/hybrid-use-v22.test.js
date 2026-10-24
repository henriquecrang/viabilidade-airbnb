const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,calculateModel,normalizeState}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version===22,'uso parcial anual deve estar na V22');

let c=calculateModel(defaultState);
assert(c.hybridUse.active===false,'defaults híbridos devem ser neutros');
approx(c.availableDays,365,1e-9,'default deve manter 365 dias disponíveis');

// Compatibilidade: JSON/estado legado com unavailableDays continua funcionando.
let s=clone(defaultState);
s.seasons=[{id:'legacy',name:'Legado',days:100,unavailableDays:20,nightlyRate:200,occupancyPct:50}];
c=calculateModel(s);
approx(c.availableDays,80,1e-9,'dias disponíveis legados');
approx(c.operationalUnavailableDays,20,1e-9,'legado deve migrar conceitualmente para indisponibilidade operacional');

// Classificação anual por motivo.
s=clone(defaultState);
s.seasons=[{id:'x',name:'Teste',days:100,personalUseDays:10,habitualUseDays:20,operationalUnavailableDays:5,nightlyRate:200,occupancyPct:50}];
s.airbnb.platformFeePct=0;
s.airbnb.taxPct=0;
s.airbnb.cleaningFeeRevenue=0;
s.airbnb.otherGuestFeeRevenue=0;
s.stayCosts=[]; s.monthlyCosts=[]; s.percentageCosts=[]; s.reserveFunds=[]; s.setupCosts=[];
s.hybridUse={
  ...s.hybridUse,
  avoidedLodgingPerDay:300,
  personalUseIncrementalCostPerDay:50,
  habitualHousingBenefitAnnual:12000,
  habitualUseIncrementalCostAnnual:3000,
  preparationAnnualCost:1000,
  storageAnnualCost:500,
  otherIncrementalAnnualCost:500,
  incrementalAirbnbCapex:10000,
  incrementalAirbnbCapexResidualPct:40
};
c=calculateModel(s);
approx(c.personalUseDays,10,1e-9,'uso pessoal');
approx(c.habitualUseDays,20,1e-9,'moradia');
approx(c.operationalUnavailableDays,5,1e-9,'indisponibilidade operacional');
approx(c.availableDays,65,1e-9,'dias disponíveis');
approx(c.occupiedNights,32.5,1e-9,'noites ocupadas');
approx(c.hybridUse.airbnbRevenue,6500,.01,'receita Airbnb incremental');
approx(c.hybridUse.freeCash,4500,.01,'caixa incremental');
approx(c.hybridUse.consumptionBenefit,11500,.01,'benefício de consumo');
approx(c.hybridUse.incrementalCapexResidual,4000,.01,'residual do CAPEX');
approx(c.hybridUse.firstYearCashAfterCapex,-5500,.01,'caixa do primeiro ano após CAPEX');
approx(c.hybridUse.economicIncrement,10000,.01,'resultado econômico incremental');

// O motor não pode retirar mais dias do que o período contém.
s=clone(defaultState);
s.seasons=[{id:'overflow',name:'Overflow',days:10,personalUseDays:8,habitualUseDays:8,operationalUnavailableDays:8,nightlyRate:1,occupancyPct:0}];
c=calculateModel(s);
approx(c.blockedDays,10,1e-9,'bloqueio deve ser limitado');
approx(c.availableDays,0,1e-9,'disponibilidade não pode ser negativa');
approx(c.blockedOverflowDays,14,1e-9,'excesso deve ser diagnosticável');

// normalizeState deve converter unavailableDays legado em operacional.
const legacy=clone(defaultState);
legacy.version=21;
legacy.seasons=[{id:'legacy',name:'Legado',days:30,unavailableDays:7,nightlyRate:100,occupancyPct:50}];
delete legacy.hybridUse;
const migrated=normalizeState(legacy);
approx(migrated.seasons[0].operationalUnavailableDays,7,1e-9,'migração V21→V22');
assert(migrated.hybridUse.avoidedLodgingPerDay===0,'novos defaults devem nascer neutros');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('Uso parcial / híbrido'),'UI híbrida ausente');
assert(html.includes('Uso pessoal')&&html.includes('Moradia')&&html.includes('Indisp. operacional'),'classificação de dias ausente');

console.log('V22 uso parcial: todos os testes passaram.');
