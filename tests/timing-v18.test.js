const fs=require('fs');
const path=require('path');
global.window={};
const appSource=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
eval(appSource);
const {defaultState,calculateHorizonProjection}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}

assert(defaultState.version>=21,'V18 mensal deve estar aposentada na V21');
assert(!appSource.includes('buildMonthlyFundingSchedule'),'motor mensal aproximado não deve permanecer ativo');
assert(!appSource.includes('projectTimedContribution'),'contribuição mensal temporizada não deve permanecer ativa');

const s=clone(defaultState);
s.rentedAirbnb.monthlyLeaseRent=10000;
s.setupCosts=[];
s.reserveFunds=[];
const p=calculateHorizonProjection(s,3);
const rented=p.scenarios.find(x=>x.id==='airbnb-rented');
assert(rented.externalFundingRequired>0,'déficit anual deve gerar aporte');
assert(rented.fundingSchedule.every(x=>Number.isInteger(x.year)&&x.year>=1&&x.year<=3),'aportes devem ser anuais');
assert(!rented.fundingSchedule.some(x=>'month' in x),'não deve existir mês de aporte no motor anual');

console.log('V18 aposentada: motor ativo é anual.');
