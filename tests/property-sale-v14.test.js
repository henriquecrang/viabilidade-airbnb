const fs = require('fs');
const path = require('path');

global.window = {};
const appSource = fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
eval(appSource);
const { defaultState, normalizeState, calculateModel } = window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
const scenario=(c,id)=>c.scenarios.find(x=>x.id===id);
function assert(c,m){ if(!c) throw new Error(m); }
function approx(a,b,t=1e-6,m=''){ if(Math.abs(a-b)>t) throw new Error(`${m}: esperado ${b}, obtido ${a}`); }

assert(defaultState.version===14,'venda líquida deve estar na V14');
assert(defaultState.analysis.startingPosition==='property','default parte de imóvel já possuído');
approx(defaultState.propertySale.brokeragePct,5,1e-12,'corretagem default');

let c=calculateModel(defaultState);
approx(c.salePrice,636000,0.01,'valor esperado de venda');
approx(c.saleBrokerage,31800,0.01,'corretagem');
approx(c.saleTransactionCosts,31800,0.01,'custos transação');
approx(c.netSaleProceeds,604200,0.01,'capital líquido');
const inv=scenario(c,'investment');
approx(inv.opportunityCapital,604200,0.01,'capital investido líquido');
approx(inv.baseInitialCapital,636000,0.01,'patrimônio inicial antes da venda');
assert(inv.realWealthCreation < scenario(c,'investment').grossRevenue,'custos de venda precisam afetar riqueza');

// Benchmark de cenário que mantém o imóvel vende no contrafactual e investe líquido.
const self=scenario(c,'airbnb-self');
assert(self.benchmarkUsesPropertySale===true,'Airbnb próprio deve usar benchmark via venda');
approx(self.benchmarkInvestableCapital,c.netSaleProceeds + Math.max(0,self.opportunityCapital-c.propertyValue),0.01,'capital líquido benchmark');

// Zerando corretagem, o cenário financeiro melhora e volta a usar o valor integral.
let zero=clone(defaultState);
zero.propertySale.brokeragePct=0;
let c0=calculateModel(zero);
approx(c0.netSaleProceeds,636000,0.01,'venda sem custo');
assert(scenario(c0,'investment').realWealthCreation > inv.realWealthCreation,'corretagem deve reduzir ganho real do investimento');

// Outros custos e imposto reduzem capital líquido uma vez.
let x=clone(defaultState);
x.propertySale.fixedCosts=2000;
x.propertySale.capitalGainsTax=5000;
x.propertySale.otherCosts=1000;
let cx=calculateModel(x);
approx(cx.netSaleProceeds,636000-31800-2000-5000-1000,0.01,'deduções venda');

// Saldo de financiamento reduz caixa de venda, mas não entra em custos de transação.
x=clone(defaultState);
x.propertySale.mortgageBalance=100000;
cx=calculateModel(x);
approx(cx.saleTransactionCosts,31800,0.01,'financiamento não é custo de transação');
approx(cx.netSaleProceeds,504200,0.01,'quitação financiamento');
approx(cx.startingPropertyEquity,536000,0.01,'equity inicial');

// Migração do cenário-base V13 recebe 5%.
const legacy=clone(defaultState);
legacy.version=13;
delete legacy.propertySale;
const migrated=normalizeState(legacy);
approx(migrated.propertySale.brokeragePct,5,1e-12,'migração base V13');

// V13 customizado preserva semântica antiga: venda sem custos até configuração explícita.
const custom=clone(legacy);
custom.globals.propertyValue=700000;
const customMigrated=normalizeState(custom);
approx(customMigrated.propertySale.brokeragePct,0,1e-12,'custom legado preservado');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('Capital líquido investível'),'preview capital líquido ausente');
assert(html.includes('Saldo de financiamento a quitar'),'input financiamento ausente');

console.log('V14 venda líquida: todos os testes passaram.');
