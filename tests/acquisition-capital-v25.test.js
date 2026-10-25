const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,buildPropertyWizardPatch,buildMainWizardPatch,applyWizardPatch,calculateModel,calculateHorizonProjection}=window.SimulatorAirbnb;
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

function purchaseState(purchaseCosts){
  const property=buildPropertyWizardPatch({
    position:'buy',
    availableCapital:800000,
    purchasePrice:650000,
    purchaseCosts,
    workingCapitalTarget:'airbnbSelf',
    workingCapitalAmount:20000,
    setup_reforma:10000,
    setup_mobilia:5000,
    setup_eletro:15000,
    salePriceAdjustmentPct:0,brokeragePct:5,fixedCosts:0,mortgageBalance:0,capitalGainsTax:0,otherCosts:0
  },defaultState);
  assert(property.valid,'aquisição deve caber no capital');
  let s=applyWizardPatch(defaultState,property);
  const main=buildMainWizardPatch({situation:'capital-buy',compareFinancial:true},s);
  assert(main.valid,'wizard principal deve aceitar a aquisição');
  return applyWizardPatch(s,main);
}

const state=purchaseState(30000);
const calc=calculateModel(state);
const self=calc.scenarios.find(x=>x.id==='airbnb-self');
const investment=calc.scenarios.find(x=>x.id==='investment');
approx(self.baseInitialCapital,800000,.01,'mesma base de riqueza');
approx(self.purchaseCapitalRequired,730000,.01,'capital consumido/vinculado na entrada');
approx(self.leftoverInvestmentInitial,70000,.01,'sobra aplicada');
approx(self.benchmarkInvestableCapital,800000,.01,'benchmark com capital integral');
approx(investment.initialCapital,800000,.01,'standalone com capital integral');
approx(investment.transactionCosts,0,.01,'sem custo de venda no benchmark');

const cheap=purchaseState(10000);
const expensive=purchaseState(90000);
const cCheap=calculateModel(cheap), cExpensive=calculateModel(expensive);
approx(
  cCheap.scenarios.find(x=>x.id==='investment').realWealthCreation,
  cExpensive.scenarios.find(x=>x.id==='investment').realWealthCreation,
  .001,
  'custos de compra não podem alterar benchmark de mesmo capital'
);
assert(
  cExpensive.scenarios.find(x=>x.id==='airbnb-self').realWealthCreation <
  cCheap.scenarios.find(x=>x.id==='airbnb-self').realWealthCreation,
  'custos de aquisição maiores devem piorar o cenário comprado'
);

for(const years of [1,3,5]){
  const h=calculateHorizonProjection(state,years);
  const p=h.scenarios.find(x=>x.id==='airbnb-self');
  const i=h.scenarios.find(x=>x.id==='investment');
  approx(p.initialCapital,800000,.01,`capital inicial compra / ${years}a`);
  approx(i.initialCapital,800000,.01,`capital inicial investimento / ${years}a`);
  assert(Number.isFinite(p.realWealthCreation),`riqueza compra finita / ${years}a`);
  assert(Number.isFinite(i.realWealthCreation),`riqueza investimento finita / ${years}a`);
}

console.log('V25 aquisição a partir de capital: testes 1/3/5 anos passaram.');
