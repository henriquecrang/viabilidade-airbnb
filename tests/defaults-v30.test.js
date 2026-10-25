const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {defaultState,normalizeState,calculateModel,adminWizardPresetDraft,buildAdminWizardPatch,applyWizardPatch}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version===30,'estado deve estar na V30');
const occ=Object.fromEntries(defaultState.seasons.map(x=>[x.id,x.occupancyPct]));
assert(JSON.stringify(occ)===JSON.stringify({reveillon:100,verao:75,carnaval:100,outono:55,inverno:50,primavera:55}),'sazonalidade V30');

const hours=Object.fromEntries(defaultState.stayCosts.map(x=>[x.id,x.ownerHoursPerReservation]));
approx(hours.lavanderia,2,1e-9,'lavanderia manual');
approx(hours.limpeza,.5,1e-9,'limpeza');
approx(hours.amenidades,.5,1e-9,'amenidades');
approx(hours.checkin,1,1e-9,'check-in/out');

const calc=calculateModel(defaultState);
approx(calc.weightedOccupancy,217.35/365,1e-12,'ocupação autogerida ponderada');
approx(calc.occupiedNights,217.35,1e-9,'noites autogeridas');
const self=calc.scenarios.find(x=>x.id==='airbnb-self');
approx(self.workHoursAnnual,263.25,1e-9,'trabalho manual anual');
approx(self.workHoursAnnual/12,21.9375,1e-9,'trabalho manual mensal equivalente');

const preset=adminWizardPresetDraft('premium',defaultState);
assert(preset.occupancyMode==='delta','admin deve usar delta');
approx(preset.occupancyImpactPp,20,1e-9,'admin +20 p.p.');
approx(preset.occupancyTargetPct,0,1e-9,'sem piso fixo');

let adminState=applyWizardPatch(clone(defaultState),buildAdminWizardPatch(preset,defaultState));
let adminCalc=calculateModel(adminState);
approx(adminCalc.adminWeightedOccupancy,288.15/365,1e-12,'ocupação administrada com teto sazonal');
const admin=adminCalc.scenarios.find(x=>x.id==='airbnb-admin');
approx(admin.workHoursAnnual,12,1e-9,'admin mantém supervisão residual de 1 h/mês');

// Migra apenas o cenário-base V29 intacto.
const old=clone(defaultState);
old.version=29;
const oldOcc={reveillon:100,verao:90,carnaval:100,outono:70,inverno:60,primavera:70};
for(const s of old.seasons) s.occupancyPct=oldOcc[s.id];
const oldHours={lavanderia:.1,limpeza:.25,amenidades:.15,checkin:.25};
for(const x of old.stayCosts) x.ownerHoursPerReservation=oldHours[x.id];
const migrated=normalizeState(old);
approx(migrated.seasons.find(x=>x.id==='verao').occupancyPct,75,1e-9,'V29 base deve migrar ocupação');
approx(migrated.stayCosts.find(x=>x.id==='lavanderia').ownerHoursPerReservation,2,1e-9,'V29 base deve migrar horas');

// Se houver customização, preservar.
const custom=clone(old);
custom.seasons.find(x=>x.id==='verao').occupancyPct=82;
const customMigrated=normalizeState(custom);
approx(customMigrated.seasons.find(x=>x.id==='verao').occupancyPct,82,1e-9,'ocupação customizada deve ser preservada');

console.log('V30 defaults: ocupação, autogestão manual, +20 p.p. e migração passaram.');
