const fs = require('fs');
const path = require('path');

global.window = {};
eval(fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8'));
const { calculateModel, defaultState, normalizeState } = window.SimulatorAirbnb;
const clone = (x) => JSON.parse(JSON.stringify(x));
const scenario = (calc,id) => calc.scenarios.find(x=>x.id===id);
function assert(c,m){ if(!c) throw new Error(m); }
function approx(a,b,t=1e-6,m=''){ if(Math.abs(a-b)>t) throw new Error(`${m}: esperado ${b}, obtido ${a}`); }

assert(defaultState.version >= 9, 'estado deve preservar as entregas da Rodada C');

// #31 — defaults e separação OPEX x dedutibilidade
assert(defaultState.airbnb.platformFeeDeductibleIR === true, 'plataforma deveria ser dedutível por default');
assert(defaultState.airbnb.adminFeeDeductibleIR === true, 'comissão admin deveria ser dedutível por default');
assert(defaultState.traditional.managementFeeDeductibleIR === true, 'administração tradicional deveria ser dedutível por default');

let s=clone(defaultState);
s.airbnb.taxPct=20;
s.airbnb.platformFeePct=16;
s.airbnb.adminFeePct=25;
s.airbnb.adminMonthlyFee=0;
s.monthlyCosts=[]; s.stayCosts=[]; s.percentageCosts=[]; s.reserveFunds=[]; s.setupCosts=[];
let c=calculateModel(s);
let self=scenario(c,'airbnb-self');
let admin=scenario(c,'airbnb-admin');
approx(self.details['Base tributável estimada'], self.grossRevenue - self.details['Taxa da plataforma'], .01, 'base Airbnb com plataforma dedutível');
const adminOpex=admin.opCosts;
const adminTax=admin.tax;
s.airbnb.adminFeeDeductibleIR=false;
c=calculateModel(s);
admin=scenario(c,'airbnb-admin');
approx(admin.opCosts,adminOpex,.01,'dedutibilidade admin não pode alterar OPEX');
assert(admin.tax>adminTax,'retirar dedutibilidade admin deveria aumentar imposto');

s=clone(defaultState);
s.traditional.taxPct=20;
s.monthlyCosts=[]; s.setupCosts=[];
c=calculateModel(s);
let trad=scenario(c,'traditional');
const tradOpex=trad.opCosts, tradTax=trad.tax;
const annualManagement=trad.details['Imobiliária / administração'];
approx(trad.details['Base tributável estimada'],trad.grossRevenue-annualManagement,.01,'base tradicional deveria excluir administração');
s.traditional.managementFeeDeductibleIR=false;
c=calculateModel(s); trad=scenario(c,'traditional');
approx(trad.opCosts,tradOpex,.01,'flag fiscal tradicional alterou OPEX');
assert(trad.tax>tradTax,'retirar dedutibilidade tradicional deveria aumentar imposto');

// #7 — diária média, ADR total e RevPAR
s=clone(defaultState);
s.seasons=[{id:'x',name:'Teste',days:100,unavailableDays:20,nightlyRate:200,occupancyPct:50}];
s.airbnb.avgStayNights=4;
s.airbnb.cleaningFeeRevenue=80;
s.airbnb.otherGuestFeeRevenue=0;
c=calculateModel(s);
approx(c.availableDays,80,1e-9,'dias disponíveis');
approx(c.occupiedNights,40,1e-9,'noites ocupadas');
approx(c.reservations,10,1e-9,'reservas');
approx(c.averageNightlyRate,200,.01,'diária média');
approx(c.totalAdr,220,.01,'ADR total');
approx(c.revPar,100,.01,'RevPAR diárias');
approx(c.totalRevPar,110,.01,'RevPAR total');
assert(c.totalAdr>c.averageNightlyRate,'taxa de limpeza deveria afetar ADR total, não diária média');

// #8 — capital de giro vinculado
s=clone(defaultState);
s.workingCapital.airbnbSelf=12000;
c=calculateModel(s);
self=scenario(c,'airbnb-self');
approx(self.workingCapital,12000,.01,'capital giro do cenário');
assert(self.tiedCapital>=12000,'capital de giro deveria ser capital vinculado');
const noWc=clone(defaultState);
const c0=calculateModel(noWc);
const self0=scenario(c0,'airbnb-self');
approx(self.opCosts,self0.opCosts,.01,'capital de giro não deve ser OPEX');
approx(self.opportunityCapital-self0.opportunityCapital,12000,.01,'capital de giro deve aumentar capital de oportunidade');

// #9 — equivalente mensal
for(const sc of c.scenarios){
  approx(sc.monthlyEquivalentExcess,sc.nominalExcessOverPreservation/12,.01,`${sc.id} equivalente mensal excedente`);
  approx(sc.monthlyEquivalentFreeCash,sc.freeCash/12,.01,`${sc.id} equivalente mensal caixa`);
}

// #10 — regressões conceituais estabilizadas
s=clone(defaultState);
s.seasons=[{id:'x',name:'Teste',days:365,unavailableDays:65,nightlyRate:300,occupancyPct:50}];
s.airbnb.avgStayNights=5;
c=calculateModel(s);
approx(c.availableDays,300,1e-9,'bloqueios');
approx(c.occupiedNights,150,1e-9,'ocupação');
approx(c.reservations,30,1e-9,'reservas derivadas');

s=clone(defaultState);
s.percentageCosts=[{id:'maint',name:'Manutenção',pct:2,adminIncluded:false,deductibleIR:false}];
s.reserveFunds=[{id:'reserve',name:'Fundo',pct:3,openingBalance:5000,adminIncluded:false}];
c=calculateModel(s);
self=scenario(c,'airbnb-self');
assert(self.opCosts>0,'manutenção deveria estar em OPEX');
assert(self.reserveContribution>0,'fundo deveria gerar aporte');
assert(self.linkedReserve>=5000,'saldo inicial da reserva deveria permanecer patrimônio');

s=clone(defaultState);
s.setupCosts=[{id:'asset',name:'Ativo',amount:10000,residualPct:40,airbnb:true,rentedAirbnb:true,traditional:false,adminPays:false,adminAssetBelongsToOwner:true}];
c=calculateModel(s);
self=scenario(c,'airbnb-self');
approx(self.capex,10000,.01,'CAPEX');
approx(self.setupResidual,4000,.01,'residual');
approx(self.setupDepreciation,6000,.01,'depreciação');

s=clone(defaultState);
s.rentedAirbnb.securityDeposit=9000;
s.setupCosts=[]; s.reserveFunds=[];
c=calculateModel(s);
const rented=scenario(c,'airbnb-rented');
assert(rented.tiedCapital>=9000,'caução deveria ser patrimônio vinculado');

s=clone(defaultState);
s.globals.inflationPct=5;
s.globals.propertyRealAppreciationPct=3;
c=calculateModel(s);
approx(c.nominalPropertyAppreciation,(1.05*1.03)-1,1e-12,'composição nominal x real');
for(const sc of c.scenarios){
  assert(Number.isFinite(sc.opportunityCapital),`${sc.id}: capital de oportunidade inválido`);
  assert(Number.isFinite(sc.benchmarkRealGain),`${sc.id}: benchmark inválido`);
}

const legacy=clone(defaultState);
legacy.version=8;
delete legacy.workingCapital;
const migrated=normalizeState(legacy);
assert(migrated.workingCapital.airbnbSelf===0,'migração capital de giro');
assert(migrated.airbnb.adminFeeDeductibleIR===true,'novo default deveria existir quando campo não está ausente no source base');

console.log('Rodada C: todos os testes passaram.');
