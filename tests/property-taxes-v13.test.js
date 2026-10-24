const fs = require('fs');
const path = require('path');

global.window = {};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const { defaultState, normalizeState, calculateModel } = window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){ if(!c) throw new Error(m); }
function approx(a,b,t=1e-6,m=''){ if(Math.abs(a-b)>t) throw new Error(`${m}: esperado ${b}, obtido ${a}`); }

assert(defaultState.version>=13,'estado deve preservar a calibração V13 de IPTU/TCL');
const byId=new Map(defaultState.monthlyCosts.map(x=>[x.id,x]));
approx(byId.get('iptu').amount,0,1e-12,'IPTU isento');
assert(byId.has('tcl'),'TCL deve existir');
approx(byId.get('tcl').amount*12,625,1e-9,'TCL anual');
assert(byId.get('tcl').rentedAirbnb===false,'TCL não deve ser atribuída ao locatário por default');
assert(byId.get('tcl').deductibleIR===true,'TCL deve preservar flag fiscal configurável');

const calc=calculateModel(defaultState);
const self=calc.scenarios.find(x=>x.id==='airbnb-self');
assert(self.opCosts>0,'TCL deve integrar OPEX do imóvel próprio');

// Migração do antigo default V12.
const legacy=clone(defaultState);
legacy.version=12;
legacy.monthlyCosts=legacy.monthlyCosts.filter(x=>x.id!=='tcl');
legacy.monthlyCosts.find(x=>x.id==='iptu').amount=50;
const migrated=normalizeState(legacy);
const m=new Map(migrated.monthlyCosts.map(x=>[x.id,x]));
approx(m.get('iptu').amount,0,1e-12,'migração IPTU');
approx(m.get('tcl').amount*12,625,1e-9,'migração TCL');

// Customização de IPTU não deve ser sobrescrita.
const custom=clone(legacy);
custom.monthlyCosts.find(x=>x.id==='iptu').amount=123;
const customMigrated=normalizeState(custom);
approx(customMigrated.monthlyCosts.find(x=>x.id==='iptu').amount,123,1e-9,'IPTU custom preservado');
assert(!customMigrated.monthlyCosts.some(x=>x.id==='tcl'),'custom V12 não deve receber TCL automaticamente');

console.log('V13 IPTU/TCL: todos os testes passaram.');
