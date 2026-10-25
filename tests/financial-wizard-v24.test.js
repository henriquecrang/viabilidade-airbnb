const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,buildFinancialWizardPatch,applyWizardPatch,calculateModel}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=24,'wizard financeiro deve preservar compatibilidade V24+');
assert(defaultState.guidedSetup.financial.configured===false,'wizard não deve fingir configuração prévia');

let patch=buildFinancialWizardPatch({
  applicationType:'cdb',rateKind:'nominal-gross',ratePct:12,taxPct:15,feesPct:1,
  termMonths:24,liquidity:'term',role:'benchmark'
},defaultState);
assert(patch.valid,'taxa bruta válida');
approx(patch.values['investment.nominalRatePct'],12,1e-9,'taxa nominal bruta');
assert(patch.values['investment.mode']==='nominal','modo nominal');
assert(patch.values['guidedSetup.financial'].configured===true,'metadados configurados');

patch=buildFinancialWizardPatch({
  applicationType:'treasury',rateKind:'nominal-net',ratePct:8.5,taxPct:15,feesPct:1,
  termMonths:36,liquidity:'market',role:'actual'
},defaultState);
assert(patch.valid,'taxa líquida válida');
approx(patch.values['investment.nominalRatePct'],11,1e-9,'conversão líquido→bruto');
assert(patch.normalized.convertedGrossNominalPct===11,'conversão deve ficar auditável');

const before=clone(defaultState);
let configured=applyWizardPatch(before,patch);
assert(before.investment.nominalRatePct===13.65,'aplicação do patch não deve mutar origem');
assert(configured.guidedSetup.financial.role==='actual','papel deve ser preservado');
assert(configured.guidedSetup.financial.liquidity==='market','liquidez deve ser preservada');

// Prova econômica da conversão: 11% bruto - 1% custos = 10% base; IR 15% => 8,5% líquido.
configured.globals.propertyValue=100000;
configured.globals.inflationPct=0;
configured.propertySale.salePriceAdjustmentPct=0;
configured.propertySale.brokeragePct=0;
configured.propertySale.fixedCosts=0;
configured.propertySale.mortgageBalance=0;
configured.propertySale.capitalGainsTax=0;
configured.propertySale.otherCosts=0;
let calc=calculateModel(configured);
let inv=calc.scenarios.find(x=>x.id==='investment');
approx(inv.operatingCash,8500,.01,'taxa líquida informada deve ser reproduzida');

patch=buildFinancialWizardPatch({
  applicationType:'fund',rateKind:'real-gross',ratePct:6,taxPct:17.5,feesPct:.5,
  termMonths:12,liquidity:'daily',role:'both'
},defaultState);
assert(patch.valid,'taxa real válida');
assert(patch.values['investment.mode']==='ipcaPlus','modo real');
approx(patch.values['investment.realRatePct'],6,1e-9,'taxa real');

patch=buildFinancialWizardPatch({rateKind:'nominal-net',ratePct:5,taxPct:100,feesPct:0},defaultState);
assert(!patch.valid,'IR 100% com taxa líquida positiva deve ser rejeitado');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('id="openFinancialWizard"'),'launcher do wizard ausente');
assert(html.includes('id="wizardDialog"'),'dialog do wizard ausente');
assert(html.includes('Revisar alterações'),'etapa explícita de revisão ausente');

console.log('V24 wizard financeiro: todos os testes passaram.');
