const fs = require('fs');
const path = require('path');

global.window = {};
const root = path.join(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
eval(appSource);
const { calculateModel, defaultState, normalizeState } = window.SimulatorAirbnb;
const clone = (x) => JSON.parse(JSON.stringify(x));
const scenario = (calc,id) => calc.scenarios.find(x=>x.id===id);
function assert(c,m){ if(!c) throw new Error(m); }
function approx(a,b,t=1e-6,m=''){ if(Math.abs(a-b)>t) throw new Error(`${m}: esperado ${b}, obtido ${a}`); }

assert(defaultState.version === 10, 'defaults recalibrados devem estar na V10');
approx(defaultState.globals.ownerHourlyValue,100,1e-9,'valor da hora');

const expectedSeasons = [
  ['reveillon',4,750,100],
  ['verao',81,400,90],
  ['carnaval',7,750,100],
  ['outono',91,250,70],
  ['inverno',91,250,60],
  ['primavera',91,250,70]
];
assert(defaultState.seasons.length===6,'seis períodos sazonais');
for(let i=0;i<expectedSeasons.length;i++){
  const [id,days,rate,occ]=expectedSeasons[i];
  const s=defaultState.seasons[i];
  assert(s.id===id,`período ${i}`);
  approx(s.days,days,1e-9,`${id} dias`);
  approx(s.nightlyRate,rate,1e-9,`${id} diária`);
  approx(s.occupancyPct,occ,1e-9,`${id} ocupação`);
}
approx(defaultState.seasons.reduce((sum,x)=>sum+x.days,0),365,1e-9,'dias no ano');

const calc=calculateModel(defaultState);
approx(calc.occupiedNights,265.9,1e-9,'noites ocupadas originais');
approx(calc.weightedOccupancy,265.9/365,1e-12,'ocupação média ponderada');
approx(calc.accommodationRevenue,82910,0.01,'receita de diárias recalibrada');

const self=scenario(calc,'airbnb-self');
const admin=scenario(calc,'airbnb-admin');
const rented=scenario(calc,'airbnb-rented');
const trad=scenario(calc,'traditional');
const inv=scenario(calc,'investment');

assert(self.workHoursAnnual>0,'autogestão precisa ter horas');
assert(admin.workHoursAnnual>0,'admin precisa ter supervisão');
assert(trad.workHoursAnnual>0,'tradicional precisa ter horas');
assert(inv.workHoursAnnual>0,'investimento precisa ter horas');
approx(self.laborCost,self.workHoursAnnual*100,0.01,'custo horas self');
approx(admin.laborCost,admin.workHoursAnnual*100,0.01,'custo horas admin');
approx(self.economicResult,self.freeCash-self.laborCost,0.01,'resultado econômico self');
approx(rented.economicResult,rented.freeCash-rented.laborCost,0.01,'resultado econômico rented');

// Trabalho por reserva escala com número de reservas
const fewer=clone(defaultState);
fewer.seasons=fewer.seasons.map(x=>({...x,occupancyPct:x.occupancyPct/2}));
const calcFewer=calculateModel(fewer);
assert(scenario(calcFewer,'airbnb-self').workHoursAnnual < self.workHoursAnnual,'menos reservas deveriam reduzir horas próprias');

// Custo das horas não altera caixa/OPEX
const zeroHourValue=clone(defaultState);
zeroHourValue.globals.ownerHourlyValue=0;
const calcZero=calculateModel(zeroHourValue);
approx(scenario(calcZero,'airbnb-self').freeCash,self.freeCash,0.01,'valor da hora não altera caixa');
approx(scenario(calcZero,'airbnb-self').opCosts,self.opCosts,0.01,'valor da hora não altera OPEX');

// Migra apenas o antigo default V9 intacto
const legacy=clone(defaultState);
legacy.version=9;
legacy.globals.ownerHourlyValue=0;
legacy.work={selfHoursMonthly:0,supervisionAdminHoursMonthly:0,traditionalHoursMonthly:0,investmentHoursMonthly:0,rentedAirbnbHoursMonthly:0};
legacy.seasons=[
  {id:'alta',name:'Alta — dez a mar',days:121,unavailableDays:0,nightlyRate:649,occupancyPct:51},
  {id:'ombro',name:'Intermediária — jul e ago',days:62,unavailableDays:0,nightlyRate:602,occupancyPct:46},
  {id:'baixa',name:'Baixa — abr a jun + set a nov',days:182,unavailableDays:0,nightlyRate:582,occupancyPct:46}
];
legacy.stayCosts=legacy.stayCosts.map(x=>({...x,ownerHoursPerReservation:0}));
legacy.monthlyCosts=legacy.monthlyCosts.map(x=>({...x,ownerHoursMonthly:0}));
const migrated=normalizeState(legacy);
assert(migrated.version===10,'migração V10');
approx(migrated.globals.ownerHourlyValue,100,1e-9,'migração valor hora');
assert(migrated.seasons.length===6 && migrated.seasons[0].id==='reveillon','migração sazonalidade');
assert(migrated.stayCosts.some(x=>x.ownerHoursPerReservation>0),'migração horas por reserva');

// Um V9 customizado não deve ter sua sazonalidade sobrescrita.
const custom=clone(legacy);
custom.seasons[0].nightlyRate=700;
const customMigrated=normalizeState(custom);
assert(customMigrated.seasons.length===3,'custom V9 deve preservar períodos');
approx(customMigrated.seasons[0].nightlyRate,700,1e-9,'custom V9 deve preservar diária');

const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('Custo econômico das horas'),'tabela deveria explicitar custo das horas');
assert(html.includes('Resultado econômico (caixa − horas)'),'tabela deveria mostrar resultado econômico');

console.log('V10 defaults: todos os testes passaram.');
