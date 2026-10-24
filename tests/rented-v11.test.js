const fs = require('fs');
const path = require('path');

global.window = {};
const root = path.join(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
eval(appSource);
const { calculateModel, defaultState, normalizeState } = window.SimulatorAirbnb;
const clone = (x) => JSON.parse(JSON.stringify(x));
const scenario = (calc,id) => calc.scenarios.find(x=>x.id===id);
function assert(c,m){ if(!c) throw new Error(m); }
function approx(a,b,t=1e-6,m=''){ if(Math.abs(a-b)>t) throw new Error(`${m}: esperado ${b}, obtido ${a}`); }

assert(defaultState.version >= 11,'estado deve preservar a modelagem V11 do Airbnb alugado');
assert(defaultState.rentedAirbnb.furnished === false,'default deve assumir imóvel não mobiliado');
assert(defaultState.rentedAirbnb.subleaseAuthorized === false,'autorização não deve ser presumida');

const condo=defaultState.monthlyCosts.find(x=>x.id==='condominio');
const iptu=defaultState.monthlyCosts.find(x=>x.id==='iptu');
const fire=defaultState.monthlyCosts.find(x=>x.id==='seguro');
const guarantee=defaultState.monthlyCosts.find(x=>x.id==='seguro-garantia');
assert(condo?.rentedAirbnb===true,'condomínio ordinário deveria entrar no alugado');
assert(iptu?.rentedAirbnb===false,'IPTU não deveria ser transferido por default');
assert(fire?.rentedAirbnb===false,'seguro do imóvel/incêndio não deveria ser do locatário por default');
assert(guarantee?.rentedAirbnb===true,'seguro-fiança deve existir no cenário alugado');

let s=clone(defaultState);
s.setupCosts=[{
  id:'furniture',name:'Móveis',amount:10000,residualPct:40,
  airbnb:false,rentedAirbnb:true,rentedOnlyIfUnfurnished:true,traditional:false,
  adminPays:false,adminAssetBelongsToOwner:true
}];
let c=calculateModel(s);
let rented=scenario(c,'airbnb-rented');
approx(rented.capex,10000,0.01,'não mobiliado deve incluir CAPEX condicional');
approx(rented.setupResidual,4000,0.01,'residual do CAPEX alugado');

s.rentedAirbnb.furnished=true;
c=calculateModel(s); rented=scenario(c,'airbnb-rented');
approx(rented.capex,0,0.01,'mobiliado deve excluir CAPEX condicional');
approx(rented.setupResidual,0,0.01,'mobiliado deve excluir residual');

s=clone(defaultState);
s.monthlyCosts=[{id:'x',name:'Encargo',amount:500,ownerHoursMonthly:0,airbnb:false,rentedAirbnb:false,traditional:false,adminManages:false,adminIncluded:false,deductibleIR:false}];
s.percentageCosts=[]; s.setupCosts=[]; s.reserveFunds=[];
let c0=calculateModel(s);
const base=scenario(c0,'airbnb-rented');
s.monthlyCosts[0].rentedAirbnb=true;
let c1=calculateModel(s);
const withCharge=scenario(c1,'airbnb-rented');
approx(withCharge.opCosts-base.opCosts,6000,0.01,'encargo locatário anual');

s=clone(defaultState);
s.percentageCosts=[{id:'m',name:'Manutenção',pct:5,rentedAirbnb:false,adminIncluded:false,deductibleIR:false}];
let ca=calculateModel(s);
const rentedNoPct=scenario(ca,'airbnb-rented');
const selfWithPct=scenario(ca,'airbnb-self');
s.percentageCosts[0].rentedAirbnb=true;
let cb=calculateModel(s);
const rentedWithPct=scenario(cb,'airbnb-rented');
const selfWithPct2=scenario(cb,'airbnb-self');
assert(rentedWithPct.opCosts>rentedNoPct.opCosts,'percentual alugado deveria aumentar OPEX');
approx(selfWithPct.opCosts,selfWithPct2.opCosts,0.01,'toggle alugado não deve alterar Airbnb próprio');

s=clone(defaultState);
s.rentedAirbnb.subleaseAuthorized=false;
let noAuth=scenario(calculateModel(s),'airbnb-rented');
s.rentedAirbnb.subleaseAuthorized=true;
let auth=scenario(calculateModel(s),'airbnb-rented');
approx(auth.freeCash,noAuth.freeCash,0.01,'autorização não deve alterar cálculo financeiro');

// Simula o antigo cenário-base V10.
const legacy=clone(defaultState);
legacy.version=10;
delete legacy.rentedAirbnb.furnished;
delete legacy.rentedAirbnb.subleaseAuthorized;
legacy.monthlyCosts=legacy.monthlyCosts.filter(x=>x.id!=='seguro-garantia');
const legacyCondo=legacy.monthlyCosts.find(x=>x.id==='condominio');
legacyCondo.name='Condomínio'; legacyCondo.rentedAirbnb=false;
const legacyFire=legacy.monthlyCosts.find(x=>x.id==='seguro');
legacyFire.name='Seguro'; legacyFire.rentedAirbnb=true;
const migrated=normalizeState(legacy);
assert(migrated.rentedAirbnb.furnished===false,'migração furnished');
assert(migrated.monthlyCosts.find(x=>x.id==='condominio')?.rentedAirbnb===true,'migração condomínio');
assert(migrated.monthlyCosts.find(x=>x.id==='seguro')?.rentedAirbnb===false,'migração seguro incêndio');
assert(migrated.monthlyCosts.some(x=>x.id==='seguro-garantia'),'migração seguro garantia');

const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('Imóvel já vem mobiliado'),'seletor mobiliado ausente');
assert(html.includes('Contrato autoriza sublocação / locação por temporada'),'autorização ausente');
assert(html.includes('Só se não mobiliado'),'coluna CAPEX condicional ausente');
assert(appSource.includes('autorização contratual para sublocação/locação por temporada ainda não foi confirmada'),'alerta autorização ausente');

console.log('V11 Airbnb alugado: todos os testes passaram.');
