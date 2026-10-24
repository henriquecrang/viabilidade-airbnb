const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,calculateModel}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function approx(a,b,t=1e-5,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}
function assert(c,m){if(!c)throw new Error(m);}

function auditState(state,label){
  const calc=calculateModel(state);
  const inflation=state.globals.inflationPct/100;
  for(const s of calc.scenarios){
    approx(s.operatingCash,s.grossRevenue-s.opCosts-s.tax,.01,`${label}/${s.id} caixa operacional`);
    if(s.id==='investment'){
      approx(s.financialGapVsBenchmark,0,.01,`${label}/investment gap financeiro`);
      approx(s.economicGapVsBenchmark,0,.01,`${label}/investment gap econômico`);
      continue;
    }
    approx(s.freeCash,s.operatingCash-s.reserveContribution,.01,`${label}/${s.id} caixa livre`);
    approx(s.externalFundingRequired,Math.max(0,-s.freeCash),.01,`${label}/${s.id} aporte externo`);
    approx(s.distributableCash,Math.max(0,s.freeCash),.01,`${label}/${s.id} caixa distribuível`);
    approx(s.firstYearCash,s.freeCash-s.capex,.01,`${label}/${s.id} caixa 1º ano`);
    approx(s.economicResult,s.freeCash-s.laborCost,.01,`${label}/${s.id} resultado econômico`);
    approx(s.firstYearEconomic,s.freeCash-s.capex-s.laborCost,.01,`${label}/${s.id} econômico 1º ano`);
    approx(s.wealthCreation,s.endNetWorth-s.initialCapital,.01,`${label}/${s.id} riqueza`);
    approx(s.realEndNetWorth,s.endNetWorth/(1+inflation),.01,`${label}/${s.id} patrimônio real`);
    approx(s.realWealthCreation,s.realEndNetWorth-s.initialCapital,.01,`${label}/${s.id} riqueza real`);
    approx(s.nominalExcessOverPreservation,s.endNetWorth-s.initialCapital*(1+inflation),.01,`${label}/${s.id} excedente preservação`);
    approx(s.financialGapVsBenchmark,s.realWealthCreation-s.benchmarkRealGain,.01,`${label}/${s.id} gap benchmark`);
    approx(s.economicGapVsBenchmark,s.economicRealWealthCreation-s.benchmarkEconomicRealGain,.01,`${label}/${s.id} gap econômico`);

    if(['airbnb-self','airbnb-admin','traditional'].includes(s.id)){
      approx(s.initialCapital,calc.propertyValue+s.capex+s.reserveOpening+s.workingCapital+s.externalFundingRequired,.01,`${label}/${s.id} capital inicial imóvel`);
      approx(s.endNetWorth,calc.propertyEndValue+s.setupResidual+s.distributableCash+s.linkedReserve+s.workingCapital,.01,`${label}/${s.id} patrimônio final imóvel`);
    }
    if(s.id==='airbnb-rented'){
      approx(s.initialCapital,s.capex+s.reserveOpening+calc.rentedSecurityDeposit+s.workingCapital+s.externalFundingRequired,.01,`${label}/rented capital inicial`);
      approx(s.endNetWorth,s.setupResidual+s.distributableCash+s.linkedReserve+calc.rentedSecurityDeposit+s.workingCapital,.01,`${label}/rented patrimônio final`);
    }
  }
  return calc;
}

auditState(clone(defaultState),'default');

let s=clone(defaultState);
s.setupCosts.find(x=>x.id==='reforma').amount=30000;
s.setupCosts.find(x=>x.id==='mobilia').amount=20000;
s.setupCosts.find(x=>x.id==='mobilia').rentedAmount=12000;
s.reserveFunds[0].openingBalance=10000;
s.reserveFunds[0].pct=4;
s.workingCapital.airbnbSelf=15000;
s.workingCapital.airbnbAdmin=12000;
s.workingCapital.rentedAirbnb=10000;
s.workingCapital.traditional=8000;
auditState(s,'capex-reserva-giro');

s=clone(defaultState);
s.seasons=s.seasons.map(x=>({...x,nightlyRate:0,occupancyPct:0}));
s.monthlyCosts=s.monthlyCosts.map(x=>({...x,amount:x.airbnb?2500:x.amount}));
const deficit=auditState(s,'deficit');
assert(deficit.scenarios.some(x=>x.externalFundingRequired>0),'caso de déficit deve exigir aporte');
for(const x of deficit.scenarios.filter(x=>x.externalFundingRequired>0 && x.id!=='investment')){
  assert(x.opportunityCapital>=x.externalFundingRequired,'aporte de déficit deve entrar no capital de oportunidade');
}

s=clone(defaultState);
s.propertySale.brokeragePct=7;
s.propertySale.fixedCosts=8000;
s.propertySale.mortgageBalance=150000;
s.propertySale.capitalGainsTax=12000;
s.propertySale.otherCosts=3000;
const sale=auditState(s,'venda');
approx(sale.saleTransactionCosts,sale.saleBrokerage+sale.saleFixedCosts+sale.saleCapitalGainsTax+sale.saleOtherCosts,.01,'custos de venda');
approx(sale.netSaleProceeds,Math.max(0,sale.salePrice-sale.saleTransactionCosts-sale.saleMortgageBalance),.01,'capital líquido venda');

console.log('Auditoria econômica V24: identidades e dupla contagem passaram.');
