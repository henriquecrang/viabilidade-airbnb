const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,buildMainWizardPatch,applyWizardPatch,calculateModel,enabledScenarioIds,scenarioView}=window.SimulatorAirbnb;
function assert(c,m){if(!c)throw new Error(m);}

let p=buildMainWizardPatch({situation:'owned',compareFinancial:true});
assert(p.valid,'imóvel próprio deve ser válido');
assert(JSON.stringify(p.normalized.enabledScenarios)===JSON.stringify(['airbnb-self','airbnb-admin','traditional','investment']),'cenários de imóvel próprio');

p=buildMainWizardPatch({situation:'owned',compareFinancial:false});
assert(JSON.stringify(p.normalized.enabledScenarios)===JSON.stringify(['airbnb-self','airbnb-admin','traditional']),'imóvel próprio sem investimento');

p=buildMainWizardPatch({situation:'primary-home',compareFinancial:true});
assert(JSON.stringify(p.normalized.enabledScenarios)===JSON.stringify(['airbnb-self','airbnb-admin','investment']),'moradia principal');

p=buildMainWizardPatch({situation:'second-home',compareFinancial:true});
assert(JSON.stringify(p.normalized.enabledScenarios)===JSON.stringify(['airbnb-self','airbnb-admin','traditional','investment']),'segunda residência');

p=buildMainWizardPatch({situation:'rent-third-party',compareFinancial:true});
assert(p.valid,'imóvel alugado deve ser válido');
assert(JSON.stringify(p.normalized.enabledScenarios)===JSON.stringify(['airbnb-rented']),'standalone investment não deve usar venda do imóvel');
assert(p.normalized.rentedBenchmarkEmbedded===true,'benchmark deve permanecer embutido no cenário alugado');

p=buildMainWizardPatch({situation:'capital-buy',compareFinancial:true});
assert(!p.valid,'capital→compra deve bloquear até #42');
assert(p.errors.some(x=>x.includes('#42')),'bloqueio deve explicar Issue #42');

const configured=applyWizardPatch(defaultState,buildMainWizardPatch({situation:'primary-home',compareFinancial:false}));
assert(JSON.stringify(enabledScenarioIds(configured))===JSON.stringify(['airbnb-self','airbnb-admin']),'filtro salvo');
const full=calculateModel(configured);
const view=scenarioView(full,configured);
assert(view.scenarios.length===2,'view deve filtrar cenários');
assert(view.scenarios.every(x=>['airbnb-self','airbnb-admin'].includes(x.id)),'view deve conter só cenários pertinentes');
assert(view.bestCash && view.bestRealWealth && view.bestEconomic,'melhores resultados devem ser recalculados dentro da view');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('id="openMainWizard"'),'launcher principal ausente');

console.log('V24 wizard principal: parte segura testada; capital→compra bloqueado pela #42.');
