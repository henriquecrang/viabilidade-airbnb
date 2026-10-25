const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,buildPropertyWizardPatch,applyWizardPatch,calculateModel}=window.SimulatorAirbnb;
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

let patch=buildPropertyWizardPatch({
  position:'owned',
  currentMarketValue:700000,
  salePriceAdjustmentPct:-2,
  brokeragePct:4.5,
  fixedCosts:3000,
  mortgageBalance:100000,
  capitalGainsTax:5000,
  otherCosts:1000,
  workingCapitalTarget:'airbnbAdmin',
  workingCapitalAmount:15000,
  setup_reforma:20000,
  setup_mobilia:10000
},defaultState);
assert(patch.valid,'wizard de imóvel próprio deve ser válido');
approx(patch.values['globals.propertyValue'],700000,1e-9,'valor de mercado');
approx(patch.values['propertySale.brokeragePct'],4.5,1e-9,'corretagem');
approx(patch.values['workingCapital.airbnbAdmin'],15000,1e-9,'capital de giro');
approx(patch.arrayValues.setupCosts.reforma.amount,20000,1e-9,'reforma');
approx(patch.arrayValues.setupCosts.mobilia.amount,10000,1e-9,'mobiliário');

let configured=applyWizardPatch(defaultState,patch);
approx(configured.setupCosts.find(x=>x.id==='reforma').amount,20000,1e-9,'patch de array');
approx(configured.setupCosts.find(x=>x.id==='mobilia').amount,10000,1e-9,'patch de mobiliário');
assert(configured.guidedSetup.acquisitionSale.position==='owned','metadado posição');

patch=buildPropertyWizardPatch({
  position:'buy',
  availableCapital:800000,
  purchasePrice:650000,
  purchaseCosts:30000,
  workingCapitalTarget:'airbnbSelf',
  workingCapitalAmount:20000,
  setup_reforma:10000,
  setup_mobilia:5000,
  setup_eletro:15000,
  salePriceAdjustmentPct:0,
  brokeragePct:5,
  fixedCosts:0,mortgageBalance:0,capitalGainsTax:0,otherCosts:0
},defaultState);
assert(patch.valid,'compra à vista que cabe no capital deve ser válida');
assert(patch.normalized.position==='buy','posição compra');
approx(patch.normalized.purchaseCapitalNeedKnown,730000,1e-9,'necessidade de capital');
approx(patch.normalized.purchaseFundingGap,0,1e-9,'sem gap de capital');
approx(patch.normalized.leftoverCapital,70000,1e-9,'sobra de capital');
assert(patch.normalized.purchaseCostsModeled===true,'custos de compra devem entrar no motor');
assert(patch.values['guidedSetup.acquisitionSale'].purchaseEconomicsComplete===true,'compra deve ser marcada como modelada');
assert(patch.values['guidedSetup.acquisitionSale'].cashOnlyPurchase===true,'regra atual é compra à vista');
assert(patch.values['analysis.startingPosition']==='capital','posição econômica deve ser capital');

const buy=applyWizardPatch(defaultState,patch);
const calc=calculateModel(buy);
const self=calc.scenarios.find(x=>x.id==='airbnb-self');
const inv=calc.scenarios.find(x=>x.id==='investment');
assert(calc.purchaseMode===true,'motor deve reconhecer aquisição a partir de capital');
approx(self.baseInitialCapital,800000,.01,'patrimônio inicial do cenário de compra');
approx(self.leftoverInvestmentInitial,70000,.01,'sobra deve permanecer aplicada');
approx(self.benchmarkInvestableCapital,800000,.01,'benchmark usa o mesmo capital');
assert(self.benchmarkUsesPropertySale===false,'benchmark de capital não vende imóvel');
approx(inv.initialCapital,800000,.01,'investimento standalone usa o mesmo capital');
approx(inv.transactionCosts,0,.01,'benchmark de capital não paga venda');

const bad=buildPropertyWizardPatch({
  position:'buy',
  availableCapital:700000,
  purchasePrice:650000,
  purchaseCosts:30000,
  workingCapitalTarget:'airbnbSelf',
  workingCapitalAmount:20000,
  setup_reforma:10000,
  setup_mobilia:5000,
  setup_eletro:15000
},defaultState);
assert(!bad.valid,'compra que excede capital deve ser bloqueada');
approx(bad.normalized.purchaseFundingGap,30000,.01,'gap bloqueado');
assert(bad.errors.some(x=>x.includes('não cria financiamento')),'erro deve explicitar ausência de financiamento');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('id="openPropertyWizard"'),'launcher de aquisição/venda ausente');

console.log('V25 wizard aquisição/venda: compra à vista e venda líquida passaram.');
