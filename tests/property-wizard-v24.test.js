const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,buildPropertyWizardPatch,applyWizardPatch,calculateModel}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
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
assert(patch.normalized.position==='buy','posição compra');
approx(patch.normalized.purchaseCapitalNeedKnown,730000,1e-9,'necessidade conhecida');
approx(patch.normalized.purchaseFundingGap,0,1e-9,'sem gap de capital');
assert(patch.values['guidedSetup.acquisitionSale'].purchaseEconomicsComplete===false,'compra não pode ser marcada como modelada');
assert(patch.values['guidedSetup.acquisitionSale'].modelGapIssue===42,'lacuna deve apontar #42');

// purchaseCosts é deliberadamente metadata-only até #42: variar esse valor não pode alterar economia escondida.
const a=applyWizardPatch(defaultState,buildPropertyWizardPatch({
  position:'buy',availableCapital:800000,purchasePrice:650000,purchaseCosts:10000,
  workingCapitalTarget:'airbnbSelf',workingCapitalAmount:0,
  salePriceAdjustmentPct:0,brokeragePct:5,fixedCosts:0,mortgageBalance:0,capitalGainsTax:0,otherCosts:0
},defaultState));
const b=applyWizardPatch(defaultState,buildPropertyWizardPatch({
  position:'buy',availableCapital:800000,purchasePrice:650000,purchaseCosts:90000,
  workingCapitalTarget:'airbnbSelf',workingCapitalAmount:0,
  salePriceAdjustmentPct:0,brokeragePct:5,fixedCosts:0,mortgageBalance:0,capitalGainsTax:0,otherCosts:0
},defaultState));
const ca=calculateModel(a), cb=calculateModel(b);
for(const id of ['airbnb-self','airbnb-admin','traditional','investment']){
  const xa=ca.scenarios.find(x=>x.id===id), xb=cb.scenarios.find(x=>x.id===id);
  approx(xa.realWealthCreation,xb.realWealthCreation,.001,`custos de compra não podem entrar silenciosamente em ${id}`);
}

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('id="openPropertyWizard"'),'launcher de aquisição/venda ausente');

console.log('V24 wizard aquisição/venda: testes passaram.');
