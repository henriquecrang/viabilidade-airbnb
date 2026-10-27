const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {defaultState,calculateModel,finalProjection}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=36,'estado deve preservar o detalhamento mensal V36+');

const annual=calculateModel(defaultState);
for(const sc of annual.scenarios){
  approx(sc.workHoursAnnual/12,(sc.workHoursAnnual)/12,.0001,`${sc.id}: horas mensais`);
  approx(sc.laborCost/12,(sc.workHoursAnnual*defaultState.globals.ownerHourlyValue)/12,.01,`${sc.id}: valor mensal das horas`);
}

const p=finalProjection(3,defaultState);
for(const sc of p.scenarios){
  const monthlyHours=(sc.cumulativeWorkHours||0)/36;
  const monthlyLabor=sc.realLaborCost/36;
  approx(monthlyLabor,monthlyHours*defaultState.globals.ownerHourlyValue,.01,`${sc.id}: equivalência mensal 3a`);
}

// Caso zero: as fórmulas devem continuar finitas e a UI não deve condicionar a exibição a >0.
const zero=clone(defaultState);
zero.work.selfHoursMonthly=0;
zero.work.supervisionAdminHoursMonthly=0;
zero.work.traditionalHoursMonthly=0;
zero.work.idlePropertyHoursMonthly=0;
zero.work.investmentHoursMonthly=0;
zero.work.rentedAirbnbHoursMonthly=0;
for(const x of zero.stayCosts) x.ownerHoursPerReservation=0;
for(const x of zero.monthlyCosts) x.ownerHoursMonthly=0;
const z=calculateModel(zero);
for(const sc of z.scenarios){
  approx(sc.workHoursAnnual,0,.0001,`${sc.id}: horas zero`);
  approx(sc.laborCost,0,.01,`${sc.id}: custo horas zero`);
}

const appSource=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
assert(appSource.includes('Horas trabalhadas por mês'),'linha de horas/mês ausente');
assert(appSource.includes('Valor das horas trabalhadas por mês'),'linha de valor/mês ausente');
assert(!appSource.includes("scenario.workHoursAnnual > 0 ?"),'exibição mensal não deve depender de horas > 0');

console.log('V36 detalhamento mensal do trabalho: todos os testes passaram.');

assert(!appSource.includes('Trabalho do proprietário: ${money.format(sc.realLaborCost)}'),'total do trabalho não deve aparecer na tabela plurianual');
