const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,normalizeState,calculateModel}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
const scenario=(c,id)=>c.scenarios.find(x=>x.id===id);
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version===15,'CAPEX alugado deve estar na V15');
const setup=new Map(defaultState.setupCosts.map(x=>[x.id,x]));
approx([...setup.values()].reduce((s,x)=>s+(x.rentedAirbnb?x.rentedAmount:0),0),27100,0.01,'total bruto alugado');
approx(setup.get('mobilia').rentedAmount,6000,.01,'mobiliário');
approx(setup.get('eletro').rentedAmount,12500,.01,'eletro');
assert(setup.get('mobilia').rentedOnlyIfUnfurnished===true,'mobiliário condicional');
assert(setup.get('eletro').rentedOnlyIfUnfurnished===true,'eletro condicional');
assert(setup.get('utensilios').rentedOnlyIfUnfurnished===false,'utensílios devem permanecer como complementação');

let c=calculateModel(defaultState);
let rented=scenario(c,'airbnb-rented');
approx(c.rentedSetupAssets,27100,.01,'CAPEX não mobiliado');
assert(rented.capex>=27100,'CAPEX cenário alugado');

let furnished=clone(defaultState);
furnished.rentedAirbnb.furnished=true;
let cf=calculateModel(furnished);
approx(cf.rentedSetupAssets,7100,.01,'CAPEX mobiliado');
assert(cf.rentedSetupAssets<c.rentedSetupAssets,'mobiliado deve reduzir CAPEX');

// CAPEX do imóvel próprio continua independente.
const self=scenario(c,'airbnb-self');
approx(self.capex,0,.01,'CAPEX próprio não deve herdar montagem do alugado');

// Residual usa o valor específico do alugado.
const expectedResidual=defaultState.setupCosts
  .filter(x=>x.rentedAirbnb)
  .reduce((s,x)=>s+x.rentedAmount*x.residualPct/100,0);
approx(c.rentedSetupResidual,expectedResidual,.01,'residual alugado');

// Legacy custom preserva amount como fallback de rentedAmount.
const legacy=clone(defaultState);
legacy.version=14;
legacy.name='Simulação customizada';
legacy.setupCosts=[{id:'x',name:'X',amount:4321,residualPct:50,airbnb:true,rentedAirbnb:true,rentedOnlyIfUnfurnished:false,traditional:false,adminPays:false,adminAssetBelongsToOwner:true}];
const migrated=normalizeState(legacy);
approx(migrated.setupCosts[0].rentedAmount,4321,.01,'fallback legado');

// Antigo cenário-base V14 recebe pacote V15.
const baseLegacy=clone(defaultState);
baseLegacy.version=14;
delete baseLegacy.setupCosts[0].rentedAmount;
baseLegacy.setupCosts=baseLegacy.setupCosts.map(x=>{const y={...x};delete y.rentedAmount; y.amount=0; return y;});
const baseMigrated=normalizeState(baseLegacy);
approx(baseMigrated.setupCosts.reduce((s,x)=>s+n(x.rentedAmount),0),27100,.01,'migração cenário-base');
function n(v){return Number(v)||0;}

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('Valor · alugado'),'coluna de valor alugado ausente');

console.log('V15 CAPEX alugado: todos os testes passaram.');
