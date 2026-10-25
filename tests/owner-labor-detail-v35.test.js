const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {defaultState,calculateModel,finalProjection}=window.SimulatorAirbnb;
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version===35,'estado deve estar na V35');

const annual=calculateModel(defaultState);
const selfAnnual=annual.scenarios.find(x=>x.id==='airbnb-self');
approx(selfAnnual.laborCost,selfAnnual.workHoursAnnual*defaultState.globals.ownerHourlyValue,.01,'fórmula anual self');

for(const years of [1,3,5]){
  const p=finalProjection(years,defaultState);
  for(const id of ['airbnb-self','airbnb-admin-essential','airbnb-admin','airbnb-rented','airbnb-rented-admin-essential','airbnb-rented-admin','traditional','investment']){
    const sc=p.scenarios.find(x=>x.id===id);
    assert(sc, `cenário ausente: ${id}`);
    assert(Number.isFinite(sc.cumulativeWorkHours), `${id}: horas acumuladas ausentes`);
    approx(sc.realLaborCost,sc.cumulativeWorkHours*defaultState.globals.ownerHourlyValue,.01,`${id}: custo real do trabalho ${years}a`);
  }
}

const appSource=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
assert(appSource.includes('Trabalho do proprietário <small>custo econômico; não sai do caixa</small>'),'detalhamento anual não explica trabalho');
assert(appSource.includes('h × ${money.format(hourly)}/h ='),'detalhamento anual não mostra fórmula');
assert(appSource.includes('Trabalho do proprietário: ${number1.format(sc.cumulativeWorkHours || 0)} h'),'comparação plurianual não mostra horas acumuladas');

console.log('V35 trabalho do proprietário: fórmula anual e plurianual passaram.');
