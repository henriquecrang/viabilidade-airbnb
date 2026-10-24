const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,calculateHorizonProjection}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version===18,'timing mensal deve estar na V18');

// Cenário artificial com déficit anual: aporte deve ocorrer ao longo dos meses,
// não ser considerado capital do mês zero.
const s=clone(defaultState);
s.rentedAirbnb.monthlyLeaseRent=10000;
s.setupCosts=[];
s.reserveFunds=[];
const p=calculateHorizonProjection(s,1);
const rented=p.scenarios.find(x=>x.id==='airbnb-rented');
assert(rented.externalFundingRequired>0,'deve haver aporte');
assert(rented.fundingSchedule.length>1,'aporte deveria ser parcelado no tempo');
assert(rented.fundingSchedule[0].month===1,'primeiro aporte no primeiro mês de déficit');
assert(rented.realInitialCapitalAtT0<rented.initialCapital,'aportes futuros devem valer menos em R$ do mês zero');
assert(rented.autoWorkingCapitalRequired>0,'capital de giro automático');
assert(rented.benchmarkRealWealthCreation<0 || Number.isFinite(rented.benchmarkRealWealthCreation),'benchmark timed válido');

// Se o cenário não tem déficit, não deve inventar aporte.
const self=calculateHorizonProjection(defaultState,5).scenarios.find(x=>x.id==='airbnb-self');
assert(self.fundingSchedule.length===0,'Airbnb próprio default não deveria exigir aporte');
approx(self.autoWorkingCapitalRequired,0,.01,'giro automático self');

// No alugado default, o CAPEX é inicial mas déficit operacional futuro é temporizado.
const rentedDefault=calculateHorizonProjection(defaultState,5).scenarios.find(x=>x.id==='airbnb-rented');
assert(rentedDefault.externalFundingRequired>=0,'funding válido');
if(rentedDefault.externalFundingRequired>0){
  assert(rentedDefault.fundingSchedule.every(x=>x.month>=1&&x.month<=60),'meses válidos');
}

console.log('V18 timing mensal: todos os testes passaram.');
