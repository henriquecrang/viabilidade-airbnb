const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {
  defaultState,finalComparisonState,finalVisibleScenarioIds,finalProjection
}=window.SimulatorAirbnb;
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=32,'estado deve preservar a arquitetura V32+');
assert(defaultState.analysis.horizonYears===3,'resumo final deve abrir em 3 anos');

const forced=finalComparisonState(defaultState);
assert(forced.guidedSetup.adminComparisonEnabled===true,'comparação final deve forçar variantes admin sem alterar o estado original');
assert(defaultState.guidedSetup.adminComparisonEnabled===false,'estado-base não deve ser mutado');

const projection=finalProjection(null,defaultState);
assert(projection.years===3,'projeção final default deve usar 3 anos');
assert(projection.scenarios.length===9,'final deve disponibilizar nove cenários');
for(const id of [
  'airbnb-self','airbnb-admin-essential','airbnb-admin',
  'airbnb-rented','airbnb-rented-admin-essential','airbnb-rented-admin',
  'idle-property','traditional','investment'
]){
  assert(projection.scenarios.some(x=>x.id===id),`cenário final ausente: ${id}`);
}

assert(finalVisibleScenarioIds(defaultState).length===9,'todos os cenários devem iniciar visíveis');
const filtered=JSON.parse(JSON.stringify(defaultState));
filtered.analysis.finalScenarioIds=['airbnb-self','investment'];
assert(JSON.stringify(finalVisibleScenarioIds(filtered))===JSON.stringify(['airbnb-self','investment']),'filtro final deve ser independente');

const self=projection.scenarios.find(x=>x.id==='airbnb-self');
approx(self.nominalExcessOverPreservation/3,self.nominalExcessOverPreservation/projection.years,1e-9,'média anual');
approx(self.nominalExcessOverPreservation/36,self.nominalExcessOverPreservation/(projection.years*12),1e-9,'média mensal');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('id="finalScenarioSelector"'),'seletor de cenários final ausente');
assert(html.includes('id="finalHorizonYears"'),'seletor de horizonte final ausente');
assert(html.includes('id="restoreDefaultsButton"'),'botão de restaurar defaults ausente');
assert(html.includes('Restaurar defaults'),'rótulo de reset ausente');

console.log('V32+ resumo final: filtros, 3 anos, reset e cenário parado passaram.');


const appSource=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
assert(appSource.includes('resultado econômico real · média mensal equivalente'),'mensal econômico deve ser o destaque principal dos cards');
assert(appSource.includes('Valor real mensal total'),'V40 deve substituir total do horizonte na caixa secundária');
assert(appSource.includes('Horas de trabalho/mês'),'V40 deve exibir horas/mês na segunda caixa secundária');
