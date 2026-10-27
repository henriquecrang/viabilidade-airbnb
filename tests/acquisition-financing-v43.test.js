const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {
  defaultState,buildPropertyWizardPatch,applyWizardPatch,calculateModel,
  calculateHorizonProjection,acquisitionFinancingSchedule
}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=43,'estado deve preservar financiamento V43+');

// Caminho histórico à vista permanece igual.
const cash=buildPropertyWizardPatch({
  position:'buy',availableCapital:800000,purchasePrice:650000,purchaseCosts:30000,
  workingCapitalTarget:'airbnbSelf',workingCapitalAmount:20000,
  setup_reforma:10000,setup_mobilia:5000,setup_eletro:15000
},defaultState);
assert(cash.valid,'compra à vista histórica deve continuar válida');
assert(cash.normalized.fundingMode==='cash','sem novas fontes = cash');
assert(cash.values['guidedSetup.acquisitionSale'].cashOnlyPurchase===true,'flag cash-only');
approx(cash.normalized.purchaseCapitalNeedKnown,730000,.01,'necessidade histórica');
approx(cash.normalized.leftoverCapital,70000,.01,'sobra histórica');

// Compra com capital insuficiente coberta explicitamente por aporte + financiamento.
const financed=buildPropertyWizardPatch({
  position:'buy',
  availableCapital:200000,
  additionalEquity:50000,
  purchasePrice:650000,
  purchaseCosts:30000,
  financingPrincipal:500000,
  financingAnnualRatePct:0,
  financingTermYears:40,
  financingOriginationCosts:5000,
  workingCapitalTarget:'airbnbSelf',
  workingCapitalAmount:0
},defaultState);
assert(financed.valid,'fontes explícitas devem fechar a compra');
assert(financed.normalized.fundingMode==='mixed','aporte + dívida = mixed');
approx(financed.normalized.purchaseCapitalNeedKnown,685000,.01,'necessidade inclui custo de crédito');
approx(financed.normalized.ownCapitalPool,250000,.01,'capital próprio total');
approx(financed.normalized.ownCapitalRequired,185000,.01,'capital próprio requerido após dívida');
approx(financed.normalized.leftoverCapital,65000,.01,'sobra própria investida');

const state=applyWizardPatch(clone(defaultState),financed);
const schedule=acquisitionFinancingSchedule(state,3);
approx(schedule.annualPayment,12500,.01,'parcela anual equivalente sem juros');
approx(schedule.rows[0].endingBalance,487500,.01,'saldo ano 1');
approx(schedule.rows[2].endingBalance,462500,.01,'saldo ano 3');

const calc=calculateModel(state);
assert(calc.purchaseMode===true,'motor deve reconhecer compra financiada');
approx(calc.acquisitionEquityCapital,250000,.01,'capital próprio do motor');
approx(calc.acquisitionFinancingPrincipal,500000,.01,'dívida do motor');
const self=calc.scenarios.find(x=>x.id==='airbnb-self');
approx(self.financingPayment,12500,.01,'parcela reduz caixa do cenário');
approx(self.financingPrincipalPaid,12500,.01,'amortização ano 1');
approx(self.financingBalance,487500,.01,'dívida reduz patrimônio');
approx(self.baseInitialCapital,250000,.01,'capital inicial é próprio, não dívida');
approx(self.leftoverInvestmentInitial,65000,.01,'sobra aplicada');
approx(self.benchmarkInvestableCapital,250000+self.externalFundingRequired,.01,'benchmark usa capital próprio + aportes operacionais, nunca principal financiado');
const inv=calc.scenarios.find(x=>x.id==='investment');
approx(inv.initialCapital,250000,.01,'investimento standalone usa o mesmo capital próprio');

const h3=calculateHorizonProjection(state,3);
const hSelf=h3.scenarios.find(x=>x.id==='airbnb-self');
approx(hSelf.financingBalance,462500,.01,'saldo devedor no horizonte');
approx(hSelf.financingSchedule[0].payment,12500,.01,'parcela ano 1 horizonte');
approx(hSelf.financingSchedule[2].payment,12500,.01,'parcela ano 3 horizonte');
approx(hSelf.yearsDetail[2].financingBalance,462500,.01,'audit trail da dívida');

// Venda ao fim do horizonte quita o saldo calculado, ignorando mortgageBalance manual do imóvel já possuído.
const exit=clone(state);
exit.exitStrategy.ownedAirbnb='liquidate';
exit.propertySale.brokeragePct=0;
exit.propertySale.fixedCosts=0;
exit.propertySale.capitalGainsTax=0;
exit.propertySale.otherCosts=0;
exit.propertySale.mortgageBalance=999999;
const exitSelf=calculateHorizonProjection(exit,3).scenarios.find(x=>x.id==='airbnb-self');
approx(exitSelf.exitCosts,462500,.01,'saída da compra financiada quita saldo projetado');
assert(exitSelf.propertySaleAtExit>exitSelf.propertyEndValue,'valor bruto de venda deve exceder líquido após dívida');

// Aporte adicional sem dívida também é espelhado pelo benchmark.
const equityOnly=buildPropertyWizardPatch({
  position:'buy',availableCapital:600000,additionalEquity:100000,
  purchasePrice:650000,purchaseCosts:30000,
  financingPrincipal:0,workingCapitalTarget:'airbnbSelf',workingCapitalAmount:0
},defaultState);
assert(equityOnly.valid,'aporte adicional deve completar compra');
assert(equityOnly.normalized.fundingMode==='additional-equity','modo aporte adicional');
const equityState=applyWizardPatch(clone(defaultState),equityOnly);
const equityCalc=calculateModel(equityState);
approx(equityCalc.scenarios.find(x=>x.id==='investment').initialCapital,700000,.01,'benchmark recebe capital próprio adicional');

// Fontes ainda insuficientes continuam bloqueadas.
const insufficient=buildPropertyWizardPatch({
  position:'buy',availableCapital:100000,additionalEquity:0,
  purchasePrice:650000,purchaseCosts:30000,financingPrincipal:400000,
  workingCapitalTarget:'airbnbSelf',workingCapitalAmount:0
},defaultState);
assert(!insufficient.valid,'fontes insuficientes devem ser rejeitadas');
assert(insufficient.normalized.purchaseFundingGap>0,'gap deve permanecer explícito');

console.log('V43 financiamento e aporte adicional: todos os testes passaram.');
