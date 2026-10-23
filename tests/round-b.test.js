const fs = require('fs');
const path = require('path');

global.window = {};
eval(fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8'));
const { calculateModel, defaultState, normalizeState } = window.SimulatorAirbnb;
const clone = (x) => JSON.parse(JSON.stringify(x));
const scenario = (calc,id) => calc.scenarios.find(x=>x.id===id);
function assert(c,m){ if(!c) throw new Error(m); }
function approx(a,b,t=1e-6,m=''){ if(Math.abs(a-b)>t) throw new Error(`${m}: esperado ${b}, obtido ${a}`); }

// #2 — performance da administradora
let s=clone(defaultState);
s.airbnb.adminNightlyRateImpactPct=0;
s.airbnb.adminOccupancyImpactPp=0;
let c=calculateModel(s);
approx(scenario(c,'airbnb-admin').grossRevenue,scenario(c,'airbnb-self').grossRevenue,0.01,'impactos zero');
const baseAdminReservations=c.adminReservations;
const baseAdminNights=c.adminOccupiedNights;
s.airbnb.adminNightlyRateImpactPct=10;
c=calculateModel(s);
assert(scenario(c,'airbnb-admin').grossRevenue>scenario(c,'airbnb-self').grossRevenue,'diária maior não aumentou receita admin');
approx(c.adminReservations,baseAdminReservations,1e-6,'diária alterou reservas');
approx(c.adminOccupiedNights,baseAdminNights,1e-6,'diária alterou noites');
s.airbnb.adminNightlyRateImpactPct=0;
s.airbnb.adminOccupancyImpactPp=10;
c=calculateModel(s);
assert(c.adminReservations>baseAdminReservations,'ocupação maior não aumentou reservas');
assert(scenario(c,'airbnb-admin').details['Custos por reservas não incluídos']>0,'custos por reserva admin ausentes');

// #3 — pagador e titularidade independentes
function capexCase(adminPays, ownerKeeps){
  const x=clone(defaultState);
  x.airbnb.adminOnboardingFee=0;
  x.setupCosts=[{id:'asset',name:'Ativo',amount:10000,residualPct:40,airbnb:true,rentedAirbnb:false,traditional:false,adminPays,adminAssetBelongsToOwner:ownerKeeps}];
  const calc=calculateModel(x);
  return scenario(calc,'airbnb-admin');
}
let a=capexCase(false,true); approx(a.capex,10000,0.01,'owner paga/owner fica capex'); approx(a.setupResidual,4000,0.01,'owner paga/owner fica residual');
a=capexCase(true,true); approx(a.capex,0,0.01,'admin paga/owner fica capex'); approx(a.setupResidual,4000,0.01,'admin paga/owner fica residual');
a=capexCase(false,false); approx(a.capex,10000,0.01,'owner paga/terceiro fica capex'); approx(a.setupResidual,0,0.01,'owner paga/terceiro fica residual');
a=capexCase(true,false); approx(a.capex,0,0.01,'admin paga/admin fica capex'); approx(a.setupResidual,0,0.01,'admin paga/admin fica residual');

const legacy=clone(defaultState);
legacy.version=7;
legacy.setupCosts=[{id:'legacy',name:'Legado',amount:10000,residualPct:40,airbnb:true,rentedAirbnb:false,traditional:false,adminIncluded:true}];
const migrated=normalizeState(legacy);
assert(migrated.setupCosts[0].adminPays===true,'migração adminPays');
assert(migrated.setupCosts[0].adminAssetBelongsToOwner===false,'migração titularidade');
assert(!('adminIncluded' in migrated.setupCosts[0]),'campo legado CAPEX não removido');

// #4 — gap financeiro x econômico
s=clone(defaultState);
s.globals.ownerHourlyValue=100;
s.work.selfHoursMonthly=20;
s.work.investmentHoursMonthly=0;
c=calculateModel(s);
const self=scenario(c,'airbnb-self');
approx(self.economicGapVsBenchmark,self.financialGapVsBenchmark-self.laborCost,0.01,'gap econômico não desconta trabalho');
s.work.investmentHoursMonthly=5;
c=calculateModel(s);
const self2=scenario(c,'airbnb-self');
approx(self2.economicGapVsBenchmark,self2.financialGapVsBenchmark-self2.laborCost+scenario(c,'investment').laborCost,0.01,'gap econômico não considera tempo do benchmark');

console.log('Rodada B: todos os testes passaram.');
