const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {
  defaultState,normalizeState,calculateModel,finalProjection,
  buildMainWizardPatch,finalVisibleScenarioIds
}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version===44,'estado deve estar na V44');
assert(defaultState.analysis.finalScenarioIds.includes('idle-property'),'imóvel parado deve estar no filtro final default');

const calc=calculateModel(defaultState);
const idle=calc.scenarios.find(x=>x.id==='idle-property');
assert(idle,'cenário imóvel parado ausente');
approx(idle.grossRevenue,0,.01,'receita parada');
assert(idle.opCosts>0,'imóvel parado deve carregar custos');
approx(idle.operatingCash,-idle.opCosts,.01,'caixa operacional parado');
assert(idle.freeCash<0,'caixa livre deve ser negativo');
assert(idle.realWealthCreation<0,'resultado patrimonial real default deve ser negativo');
assert(idle.economicRealWealthCreation<idle.realWealthCreation,'tempo próprio deve piorar resultado econômico');
approx(idle.workHoursAnnual,6,.01,'0,5h/mês de supervisão');

const expectedAnnual=defaultState.monthlyCosts
  .filter(x=>x.idleProperty)
  .reduce((sum,x)=>sum+Math.max(0,Number(x.amount)||0)*12,0);
approx(idle.opCosts,expectedAnnual,.01,'custos de carregamento devem vir da flag idleProperty');

const p3=finalProjection(3,defaultState);
const idle3=p3.scenarios.find(x=>x.id==='idle-property');
assert(idle3,'imóvel parado ausente na projeção 3 anos');
assert(idle3.economicRealWealthCreation<0,'resultado 3 anos deve permanecer vermelho');
approx((idle3.cumulativeWorkHours||0)/36,.5,.01,'horas mensais equivalentes 3 anos');

const owned=buildMainWizardPatch({situation:'owned',compareFinancial:true},defaultState);
assert(owned.normalized.enabledScenarios.includes('idle-property'),'wizard owned deve habilitar imóvel parado');

const rented=buildMainWizardPatch({
  situation:'rent-third-party',
  compareFinancial:true,
  'scenario_idle-property':true,
  'scenario_airbnb-rented':true
},defaultState);
assert(!rented.normalized.enabledScenarios.includes('idle-property'),'caminho alugado não deve habilitar imóvel parado');
assert(!rented.normalized.selectedFinalScenarioIds.includes('idle-property'),'filtro final alugado deve remover imóvel parado');

assert(finalVisibleScenarioIds(defaultState).includes('idle-property'),'resumo final deve conhecer imóvel parado');

// Migração V43: flags novos vêm do default sem alterar valores antigos.
const old=clone(defaultState);
old.version=43;
delete old.work.idlePropertyHoursMonthly;
for(const item of old.monthlyCosts) delete item.idleProperty;
old.analysis.finalScenarioIds=old.analysis.finalScenarioIds.filter(id=>id!=='idle-property');
const migrated=normalizeState(old);
assert(migrated.monthlyCosts.find(x=>x.id==='condominio').idleProperty===true,'migração deve classificar condomínio');
assert(migrated.monthlyCosts.find(x=>x.id==='marketing').idleProperty===false,'migração não deve classificar marketing');
approx(migrated.work.idlePropertyHoursMonthly,.5,.01,'migração recebe supervisão default');

console.log('V44 imóvel parado: custos, patrimônio, wizard e horizonte passaram.');
