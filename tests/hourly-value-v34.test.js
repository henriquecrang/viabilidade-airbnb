const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {defaultState,finalProjection}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=34,'estado deve preservar a sensibilidade V34+');

const low=clone(defaultState);
low.globals.ownerHourlyValue=0;
const lowP=finalProjection(3,low);
const lowSelf=lowP.scenarios.find(x=>x.id==='airbnb-self');

const high=clone(defaultState);
high.globals.ownerHourlyValue=200;
const highP=finalProjection(3,high);
const highSelf=highP.scenarios.find(x=>x.id==='airbnb-self');

approx(lowSelf.nominalExcessOverPreservation,highSelf.nominalExcessOverPreservation,.01,'métrica financeira não deve mudar com valor da hora');
assert(highSelf.realLaborCost>lowSelf.realLaborCost,'custo do trabalho deve subir');
assert(highSelf.economicRealWealthCreation<lowSelf.economicRealWealthCreation,'resultado econômico deve cair quando hora sobe');

const expectedDifference=highSelf.realLaborCost-lowSelf.realLaborCost;
approx(lowSelf.economicRealWealthCreation-highSelf.economicRealWealthCreation,expectedDifference,.01,'resultado econômico deve responder integralmente ao custo das horas');

const appSource=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
assert(appSource.includes('b.economicRealWealthCreation - a.economicRealWealthCreation'),'ranking final deve usar resultado econômico');
assert(appSource.includes('resultado econômico real · média mensal equivalente'),'card principal deve rotular resultado econômico');
assert(appSource.includes('Excedente financeiro nominal'),'métrica financeira deve continuar visível');

console.log('V34 sensibilidade ao valor da hora: todos os testes passaram.');
