const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,buildMainWizardPatch,buildPropertyWizardPatch,applyWizardPatch,calculateModel,enabledScenarioIds,scenarioView}=window.SimulatorAirbnb;
function assert(c,m){if(!c)throw new Error(m);}

let p=buildMainWizardPatch({situation:'owned',compareFinancial:true},defaultState);
assert(p.valid,'imóvel próprio deve ser válido');
assert(JSON.stringify(p.normalized.enabledScenarios)===JSON.stringify(['airbnb-self','airbnb-admin','traditional','investment']),'cenários de imóvel próprio');

p=buildMainWizardPatch({situation:'owned',compareFinancial:false},defaultState);
assert(JSON.stringify(p.normalized.enabledScenarios)===JSON.stringify(['airbnb-self','airbnb-admin','traditional']),'imóvel próprio sem investimento');

p=buildMainWizardPatch({situation:'primary-home',compareFinancial:true},defaultState);
assert(JSON.stringify(p.normalized.enabledScenarios)===JSON.stringify(['airbnb-self','airbnb-admin','investment']),'moradia principal');

p=buildMainWizardPatch({situation:'second-home',compareFinancial:true},defaultState);
assert(JSON.stringify(p.normalized.enabledScenarios)===JSON.stringify(['airbnb-self','airbnb-admin','traditional','investment']),'segunda residência');

p=buildMainWizardPatch({situation:'rent-third-party',compareFinancial:true},defaultState);
assert(p.valid,'imóvel alugado deve ser válido');
assert(JSON.stringify(p.normalized.enabledScenarios)===JSON.stringify(['airbnb-rented','airbnb-rented-admin']),'imóvel alugado deve oferecer autogestão e administradora sem investimento standalone');
assert(p.normalized.rentedBenchmarkEmbedded===true,'benchmark deve permanecer embutido no cenário alugado');

p=buildMainWizardPatch({situation:'capital-buy',compareFinancial:true},defaultState);
assert(!p.valid,'capital→compra exige primeiro configurar aquisição');

let acquisition=buildPropertyWizardPatch({
  position:'buy',availableCapital:800000,purchasePrice:650000,purchaseCosts:30000,
  workingCapitalTarget:'airbnbSelf',workingCapitalAmount:20000,
  setup_reforma:10000,setup_mobilia:5000,setup_eletro:15000
},defaultState);
assert(acquisition.valid,'aquisição de teste');
let capitalState=applyWizardPatch(defaultState,acquisition);
p=buildMainWizardPatch({situation:'capital-buy',compareFinancial:true},capitalState);
assert(p.valid,'capital→compra deve ser válido após aquisição à vista configurada');
assert(JSON.stringify(p.normalized.enabledScenarios)===JSON.stringify(['airbnb-self','airbnb-admin','traditional','investment']),'cenários capital→compra');
assert(p.values['analysis.startingPosition']==='capital','posição inicial deve ser capital');

capitalState=applyWizardPatch(capitalState,p);
assert(JSON.stringify(enabledScenarioIds(capitalState))===JSON.stringify(['airbnb-self','airbnb-admin','traditional','investment']),'filtro capital→compra salvo');

const configured=applyWizardPatch(defaultState,buildMainWizardPatch({situation:'primary-home',compareFinancial:false},defaultState));
assert(JSON.stringify(enabledScenarioIds(configured))===JSON.stringify(['airbnb-self','airbnb-admin']),'filtro salvo');
const full=calculateModel(configured);
const view=scenarioView(full,configured);
assert(view.scenarios.length===2,'view deve filtrar cenários');
assert(view.scenarios.every(x=>['airbnb-self','airbnb-admin'].includes(x.id)),'view deve conter só cenários pertinentes');
assert(view.bestCash && view.bestRealWealth && view.bestEconomic,'melhores resultados devem ser recalculados dentro da view');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('id="openMainWizard"'),'launcher principal ausente');

console.log('V25 wizard principal: capital→compra habilitado com compra à vista válida.');
