const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,normalizeState,calculateModel,calculateMarketComparables}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=23,'snapshot de evidência introduzido na V23 deve permanecer ativo');
assert(defaultState.market.subject.elevator==='yes','elevador do Residencial Peixoto deve estar registrado');
assert(defaultState.market.evidenceSnapshot.insideAirbnbSnapshotDate==='2026-09-22','data do snapshot Inside Airbnb');
assert(defaultState.market.comparables.length===19,'snapshot deve conter 19 comparáveis públicos');

const market=calculateMarketComparables(defaultState.market);
assert(market.eligibleCount===19,'todos os comparáveis locais do snapshot devem passar os filtros duros atuais');
assert(market.priceCount===14,'somente 14 linhas têm diária pública verificável');
assert(market.priceSampleStatus==='insufficient','amostra de preço deve permanecer abaixo do mínimo operacional de 15');
approx(market.priceP25,278.375,.001,'P25 de diária');
approx(market.priceMedian,348.5,.001,'mediana de diária');
approx(market.priceP75,519.25,.001,'P75 de diária');
assert(market.occupancyCount===0,'não inferir ocupação a partir de calendário/preço público');

const sameBuilding=defaultState.market.comparables.find(x=>x.id==='maestro76-juano');
assert(sameBuilding && sameBuilding.nightlyRate===380,'comparável de mesmo prédio deve preservar diária textual de R$ 380');
assert(sameBuilding.sourceRef.includes('maestro-francisco-braga-76'),'comparável deve preservar URL auditável');

const legacy=clone(defaultState);
legacy.version=22;
legacy.market.comparables=[];
legacy.market.subject.elevator='unknown';
delete legacy.market.evidenceSnapshot;
const migrated=normalizeState(legacy);
assert(migrated.version>=23,'migração V22→V23 deve permanecer compatível em versões posteriores');
assert(migrated.market.comparables.length===19,'cenário-base V22 vazio deve receber snapshot V23');
assert(migrated.market.subject.elevator==='yes','migração deve registrar elevador do prédio-base');

// Mercado não pode alterar resultados econômicos sem ação explícita "Aplicar".
const noMarket=clone(defaultState);
noMarket.market.comparables=[];
const a=calculateModel(defaultState);
const b=calculateModel(noMarket);
for(const id of ['airbnb-self','airbnb-admin','airbnb-rented','traditional','investment']){
  const x=a.scenarios.find(s=>s.id===id), y=b.scenarios.find(s=>s.id===id);
  approx(x.freeCash,y.freeCash,.001,`mercado não pode mudar caixa de ${id}`);
  approx(x.realWealthCreation,y.realWealthCreation,.001,`mercado não pode mudar riqueza de ${id}`);
}

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('<th>Evidência</th>'),'tabela deve expor fonte auditável');
assert(html.includes('preços referem-se a datas distintas'),'UI deve explicitar heterogeneidade temporal');

console.log('V23 evidência de mercado: todos os testes passaram.');
