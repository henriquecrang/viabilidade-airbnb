const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,normalizeState,calculateHorizonProjection}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=17,'estado deve preservar horizontes da V17');
assert(defaultState.analysis.horizonYears===3,'default V32 deve destacar 3 anos');

const p1=calculateHorizonProjection(defaultState,1);
const p3=calculateHorizonProjection(defaultState,3);
const p5=calculateHorizonProjection(defaultState,5);
assert(p1.years===1&&p3.years===3&&p5.years===5,'horizontes');
for(const p of [p1,p3,p5]){
  assert(p.scenarios.length===6,'seis cenários após matriz V27');
  for(const s of p.scenarios){
    assert(Number.isFinite(s.realWealthCreation),`${s.id} ganho real inválido`);
    assert(Number.isFinite(s.endNetWorth),`${s.id} patrimônio inválido`);
  }
}

const rented1=p1.scenarios.find(x=>x.id==='airbnb-rented');
const rented5=p5.scenarios.find(x=>x.id==='airbnb-rented');
approx(rented1.initialCapex,27100,.01,'CAPEX inicial alugado');
assert(rented5.yearsDetail.slice(1).every(x=>Number.isFinite(x.freeCash)),'anos recorrentes alugado');
assert(rented5.setupResidual<rented1.setupResidual,'residual deve depreciar ao longo do tempo');

// CAPEX não pode se repetir como novo desembolso anual.
const totalRentedYearFreeCash=p5.scenarios.find(x=>x.id==='airbnb-rented').yearsDetail.reduce((s,x)=>s+x.freeCash,0);
approx(totalRentedYearFreeCash,rented5.cumulativeFreeCashBeforeFunding,.01,'cashflow recorrente sem duplicar CAPEX');

// Venda do imóvel ocorre uma vez: investimento melhora relativamente em horizontes maiores.
const inv1=p1.scenarios.find(x=>x.id==='investment');
const inv5=p5.scenarios.find(x=>x.id==='investment');
assert(inv5.realWealthCreation>inv1.realWealthCreation,'custo de venda deve se diluir ao longo do horizonte');
assert(inv5.cumulativeCash>inv1.cumulativeCash,'caixa financeiro deve acumular');

// Inflação composta nas receitas.
const self5=p5.scenarios.find(x=>x.id==='airbnb-self');
assert(self5.yearsDetail[4].grossRevenue>self5.yearsDetail[0].grossRevenue,'receita nominal deve crescer com inflação');

// Valorização composta do imóvel.
const expectedProperty=defaultState.globals.propertyValue*Math.pow(
  (1+defaultState.globals.inflationPct/100)*(1+defaultState.globals.propertyRealAppreciationPct/100),5
);
approx(self5.propertyEndValue,expectedProperty,.01,'valor imóvel 5 anos');

// Migração histórica do cenário-base V16 continua preservando a regra V17 de 5 anos.
const legacy=clone(defaultState);
legacy.version=16;legacy.analysis.horizonYears=1;
const migrated=normalizeState(legacy);
assert(migrated.analysis.horizonYears===5,'migração horizonte base');

// Custom preserva horizonte.
const custom=clone(legacy);custom.name='Outra simulação';
const customMigrated=normalizeState(custom);
assert(customMigrated.analysis.horizonYears===1,'custom deve preservar horizonte');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('Como a decisão muda em 1, 3 e 5 anos'),'resumo plurianual ausente');

console.log('V17 horizontes: todos os testes passaram.');
