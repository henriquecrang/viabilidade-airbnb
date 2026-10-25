const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {defaultState,finalProjection}=window.SimulatorAirbnb;
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version===40,'estado deve estar na V40');

const p=finalProjection(3,defaultState);
for(const sc of p.scenarios){
  const months=36;
  const economicMonthly=sc.economicRealWealthCreation/months;
  const laborMonthly=sc.realLaborCost/months;
  const totalRealMonthly=economicMonthly+laborMonthly;
  const workHoursMonthly=(sc.cumulativeWorkHours||0)/months;
  approx(totalRealMonthly,sc.realWealthCreation/months,.01,`${sc.id}: valor real mensal total`);
  approx(laborMonthly,workHoursMonthly*defaultState.globals.ownerHourlyValue,.01,`${sc.id}: valor do trabalho mensal`);
}

const self=p.scenarios.find(x=>x.id==='airbnb-self');
assert((self.cumulativeWorkHours||0)/36 > 20,'autogestão deve evidenciar carga mensal alta');
const premium=p.scenarios.find(x=>x.id==='airbnb-admin');
assert((premium.cumulativeWorkHours||0)/36 <= 1.01,'Premium deve evidenciar baixa carga mensal');

const appSource=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
assert(appSource.includes('Valor real mensal total'),'primeira caixa secundária ausente');
assert(appSource.includes('ganho real + valor do trabalho'),'composição do valor total mensal ausente');
assert(appSource.includes('Horas de trabalho/mês'),'segunda caixa secundária ausente');
assert(!appSource.includes('<div><span>Total · ${years} ano'),'total do horizonte não deve continuar nas caixas secundárias');
assert(!appSource.includes('<div><span>Média anual</span><strong>${money.format(annual)}</strong></div>'),'média anual não deve continuar nas caixas secundárias');

console.log('V40 indicadores secundários: todos os testes passaram.');
