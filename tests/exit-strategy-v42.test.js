const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {defaultState,normalizeState,calculateHorizonProjection}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=42,'estado deve preservar a estratégia de saída V42+');
for(const key of ['ownedAirbnb','rentedAirbnb','traditional','investment']) {
  assert(defaultState.exitStrategy[key]==='continue',`${key}: default deve continuar`);
}

// Airbnb próprio: vender no fim usa valor apreciado e custos de venda explícitos.
const owned=clone(defaultState);
owned.exitStrategy.ownedAirbnb='liquidate';
owned.propertySale.salePriceAdjustmentPct=0;
owned.propertySale.brokeragePct=5;
owned.propertySale.fixedCosts=1000;
owned.propertySale.capitalGainsTax=2000;
owned.propertySale.otherCosts=500;
owned.propertySale.mortgageBalance=3000;
const ownedContinue=calculateHorizonProjection(defaultState,3).scenarios.find(x=>x.id==='airbnb-self');
const ownedExit=calculateHorizonProjection(owned,3).scenarios.find(x=>x.id==='airbnb-self');
const expectedOwnedExitCosts=ownedExit.grossPropertyEndValue*.05+1000+2000+500+3000;
approx(ownedExit.exitCosts,expectedOwnedExitCosts,.01,'custos de saída imóvel próprio');
assert(ownedExit.exitStrategy==='liquidate','estratégia própria');
assert(ownedExit.endNetWorth<ownedContinue.endNetWorth,'venda com custos deve reduzir patrimônio terminal');

// Aluguel: realizar residual/caução com percentuais e custo explícito.
const rented=clone(defaultState);
rented.rentedAirbnb.securityDeposit=10000;
rented.exitStrategy.rentedAirbnb='liquidate';
rented.exitStrategy.rentedAssetRecoveryPct=50;
rented.exitStrategy.rentedDepositRecoveryPct=80;
rented.exitStrategy.rentedExitCosts=2500;
const rentExit=calculateHorizonProjection(rented,3).scenarios.find(x=>x.id==='airbnb-rented');
approx(rentExit.securityDeposit,8000,.01,'caução recuperada');
approx(rentExit.exitCosts,2500,.01,'custos de saída alugado');
assert(rentExit.setupResidual>=0,'residual realizado');
assert(rentExit.exitStrategy==='liquidate','estratégia alugado');

// Tradicional pode vender separadamente do Airbnb próprio.
const trad=clone(defaultState);
trad.exitStrategy.traditional='liquidate';
const tradExit=calculateHorizonProjection(trad,3).scenarios.find(x=>x.id==='traditional');
assert(tradExit.exitStrategy==='liquidate','tradicional deve liquidar');

// Investimento: custo de liquidação incide apenas quando escolhido.
const inv=clone(defaultState);
inv.exitStrategy.investment='liquidate';
inv.exitStrategy.investmentLiquidationCostPct=2;
const invContinue=calculateHorizonProjection(defaultState,3).scenarios.find(x=>x.id==='investment');
const invExit=calculateHorizonProjection(inv,3).scenarios.find(x=>x.id==='investment');
assert(invExit.exitCosts>0,'liquidação do investimento deve ter custo');
assert(invExit.endNetWorth<invContinue.endNetWorth,'custo de liquidação deve reduzir patrimônio');
assert(invExit.exitStrategy==='liquidate','investimento liquidado');

// Migração do campo legado terminate.
const legacy=clone(defaultState);
legacy.version=41;
delete legacy.exitStrategy;
legacy.rentedAirbnb.contractEndStrategy='terminate';
const migrated=normalizeState(legacy);
assert(migrated.exitStrategy.rentedAirbnb==='liquidate','terminate legado deve migrar para liquidate');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('Estratégia ao fim do horizonte'),'bloco de saída ausente');
assert(html.includes('exitStrategy.ownedAirbnb'),'saída imóvel próprio ausente');
assert(html.includes('exitStrategy.investment'),'saída investimento ausente');

console.log('V42 estratégia de saída: todos os testes passaram.');
