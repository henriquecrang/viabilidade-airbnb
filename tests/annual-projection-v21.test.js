const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,calculateHorizonProjection}=window.SimulatorAirbnb;
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=21,'motor anual introduzido na V21 deve permanecer ativo');

for(const years of [1,3,5]){
  const p=calculateHorizonProjection(defaultState,years);
  for(const s of p.scenarios){
    approx(s.monthlyEquivalentFreeCash,s.cumulativeFreeCashBeforeFunding/(years*12),.01,`${s.id} média mensal ${years}a`);
    assert(s.fundingSchedule.every(x=>Number.isInteger(x.year)),'funding deve usar ano');
    assert(s.fundingSchedule.every(x=>!('month' in x)),'funding não deve usar mês');
  }
}

const one=calculateHorizonProjection(defaultState,1).scenarios.find(x=>x.id==='airbnb-self');
approx(one.monthlyEquivalentFreeCash,one.cumulativeFreeCashBeforeFunding/12,.01,'1 ano / 12');

const five=calculateHorizonProjection(defaultState,5).scenarios.find(x=>x.id==='airbnb-self');
approx(five.monthlyEquivalentFreeCash,five.cumulativeFreeCashBeforeFunding/60,.01,'5 anos / 60');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('Médias equivalentes') && html.includes('média mensal'),'explicação de média mensal ausente');

console.log('V21 anual: todos os testes passaram.');
