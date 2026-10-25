const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {
  defaultState,buildMainWizardPatch,applyWizardPatch,calculateModel,finalProjection
}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=41,'estado deve preservar o wizard V41+');

const draft={
  situation:'owned',
  horizonYears:5,
  ownerHourlyValue:180,
  occupancyInputBasis:'admin',
  managementOccupancyDeltaPp:15,
  avgStayNights:7,
  cleaningFeeRevenue:260,
  cost_limpeza:200,
  cost_lavanderia:75,
  cost_amenidades:80,
  cost_checkin:20,
  'scenario_airbnb-self':true,
  'scenario_airbnb-admin-essential':false,
  'scenario_airbnb-admin':false,
  'scenario_airbnb-rented':false,
  'scenario_airbnb-rented-admin-essential':false,
  'scenario_airbnb-rented-admin':false,
  scenario_traditional:true,
  scenario_investment:true
};
for(const season of defaultState.seasons){
  draft[`occupancy_${season.id}`]=80;
}

const patch=buildMainWizardPatch(draft,defaultState);
assert(patch.valid,'wizard integrado deve ser válido');
assert(JSON.stringify(patch.normalized.selectedFinalScenarioIds)===JSON.stringify(['airbnb-self','traditional','investment']),'seleção final incorreta');
assert(patch.normalized.horizonYears===5,'horizonte');
approx(patch.normalized.ownerHourlyValue,180,1e-9,'valor hora');
assert(patch.normalized.occupancyInputBasis==='admin','base ocupação');
approx(patch.normalized.managementOccupancyDeltaPp,15,1e-9,'delta');

const s=applyWizardPatch(clone(defaultState),patch);
assert(s.analysis.horizonYears===5,'horizonte aplicado');
approx(s.globals.ownerHourlyValue,180,1e-9,'hora aplicada');
assert(s.airbnb.occupancyInputBasis==='admin','base aplicada');
approx(s.airbnb.managementOccupancyDeltaPp,15,1e-9,'delta aplicado');
approx(s.airbnb.avgStayNights,7,1e-9,'estadia aplicada');
approx(s.airbnb.cleaningFeeRevenue,260,1e-9,'limpeza cobrada');
approx(s.stayCosts.find(x=>x.id==='limpeza').amount,200,1e-9,'custo limpeza');
approx(s.stayCosts.find(x=>x.id==='lavanderia').amount,75,1e-9,'lavanderia');
approx(s.seasons[0].occupancyPct,65,1e-9,'ocupação admin 80 deve armazenar self 65');
assert(JSON.stringify(s.analysis.finalScenarioIds)===JSON.stringify(['airbnb-self','traditional','investment']),'filtro final aplicado');

const calc=calculateModel(s);
approx(calc.weightedOccupancy,.65,1e-9,'self ponderada');
approx(calc.adminWeightedOccupancy,.80,1e-9,'admin ponderada');

const p=finalProjection(1,s);
assert(p.scenarios.find(x=>x.id==='airbnb-self').cumulativeWorkHours>p.scenarios.find(x=>x.id==='airbnb-admin').cumulativeWorkHours,'autogestão deve exigir mais horas que Premium');

// Compatibilidade: chamada antiga continua válida e não exige os novos campos.
const legacy=buildMainWizardPatch({situation:'owned',compareFinancial:true},defaultState);
assert(legacy.valid,'chamada histórica do wizard deve continuar válida');
assert(legacy.normalized.enabledScenarios.includes('investment'),'compareFinancial histórico preservado');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('Configurar simulação'),'launcher integrado ausente');

console.log('V41 wizard principal integrado: todos os testes passaram.');
