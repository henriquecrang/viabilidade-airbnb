const fs = require('fs');
const path = require('path');

global.window = {};
const appSource = fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
eval(appSource);
const { defaultState, normalizeState, calculateModel } = window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){ if(!c) throw new Error(m); }
function approx(a,b,t=1e-6,m=''){ if(Math.abs(a-b)>t) throw new Error(`${m}: esperado ${b}, obtido ${a}`); }

assert(defaultState.version>=12,'estado deve preservar a calibração V12 de utilities');
const byId=new Map(defaultState.monthlyCosts.map(x=>[x.id,x]));
approx(byId.get('agua').amount,200,1e-9,'água + esgoto');
approx(byId.get('gas').amount,100,1e-9,'gás');
approx(byId.get('luz').amount,400,1e-9,'energia elétrica');
assert(byId.get('agua').name==='Água + esgoto','nome água deve explicitar esgoto');
assert(byId.get('luz').name==='Energia elétrica','nome energia');

const calc=calculateModel(defaultState);
const self=calc.scenarios.find(x=>x.id==='airbnb-self');
const rented=calc.scenarios.find(x=>x.id==='airbnb-rented');
assert(self.opCosts>0 && rented.opCosts>0,'utilities devem entrar no OPEX');

// Migra apenas o cenário-base V11 com os antigos valores intactos.
const legacy=clone(defaultState);
legacy.version=11;
const legacyById=new Map(legacy.monthlyCosts.map(x=>[x.id,x]));
legacyById.get('agua').amount=30; legacyById.get('agua').name='Água';
legacyById.get('luz').amount=250; legacyById.get('luz').name='Luz';
legacyById.get('gas').amount=40;
const migrated=normalizeState(legacy);
const migratedById=new Map(migrated.monthlyCosts.map(x=>[x.id,x]));
approx(migratedById.get('agua').amount,200,1e-9,'migração água');
approx(migratedById.get('luz').amount,400,1e-9,'migração luz');
approx(migratedById.get('gas').amount,100,1e-9,'migração gás');

// Customização de utilities deve ser preservada.
const custom=clone(legacy);
custom.monthlyCosts.find(x=>x.id==='luz').amount=333;
const customMigrated=normalizeState(custom);
approx(customMigrated.monthlyCosts.find(x=>x.id==='luz').amount,333,1e-9,'custom luz preservada');

console.log('V12 utilities: todos os testes passaram.');
