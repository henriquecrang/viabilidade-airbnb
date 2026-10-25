const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {
  defaultState,normalizeState,adminWizardPresetDraft,
  buildAdminWizardPatch,applyWizardPatch,calculateModel,finalProjection
}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=39,'estado deve preservar a modelagem V39+');

const essential=adminWizardPresetDraft('essential',defaultState);
assert(essential.manage_limpeza===false,'Essencial: limpeza deve ficar com proprietário');
assert(essential.manage_lavanderia===false,'Essencial: lavanderia deve ficar com proprietário');
assert(essential.manage_amenidades===false,'Essencial: consumíveis devem ficar com proprietário');
assert(essential.manage_checkin===true,'Essencial: check-in continua com admin');
for(const id of ['marketing','presales','guest-support','local-support','software','pricing']){
  assert(essential[`manage_${id}`]===true,`Essencial: ${id} continua com admin`);
}

const premium=adminWizardPresetDraft('premium',defaultState);
for(const id of ['limpeza','lavanderia','amenidades','checkin']){
  assert(premium[`manage_${id}`]===true,`Premium: ${id} deve ficar com admin`);
}

let es=applyWizardPatch(clone(defaultState),buildAdminWizardPatch(essential,defaultState));
let ps=applyWizardPatch(clone(defaultState),buildAdminWizardPatch(premium,defaultState));
const ec=calculateModel(es).scenarios.find(x=>x.id==='airbnb-admin-essential');
const pc=calculateModel(ps).scenarios.find(x=>x.id==='airbnb-admin');
assert(ec.workHoursAnnual>pc.workHoursAnnual,'Essencial deve exigir mais horas que Premium');
approx(pc.workHoursAnnual/12,1,1e-9,'Premium próprio default');
approx(ec.workHoursAnnual/12,13.863839285714285,1e-9,'Essencial próprio default');

const final=finalProjection(3,defaultState);
const fe=final.scenarios.find(x=>x.id==='airbnb-admin-essential');
const fp=final.scenarios.find(x=>x.id==='airbnb-admin');
assert(fe.cumulativeWorkHours>fp.cumulativeWorkHours,'projeção final deve preservar maior trabalho Essencial');
approx(fe.cumulativeWorkHours/36,13.863839285714285,1e-9,'Essencial 3a h/mês eq.');
approx(fp.cumulativeWorkHours/36,1,1e-9,'Premium 3a h/mês eq.');

// Migra somente o preset legado Essencial indiferenciado.
const legacy=clone(defaultState);
legacy.version=38;
legacy.guidedSetup.adminProfiles.essential={
  configured:true,plan:'essential',commissionPct:15,supervisionHoursMonthly:1,
  manage_limpeza:true,manage_lavanderia:true,manage_amenidades:true,manage_checkin:true,
  manage_marketing:true,manage_presales:true,'manage_guest-support':true,'manage_local-support':true,
  manage_software:true,manage_pricing:true
};
const migrated=normalizeState(legacy);
assert(migrated.guidedSetup.adminProfiles.essential.manage_limpeza===false,'migra limpeza Essencial legado');
assert(migrated.guidedSetup.adminProfiles.essential.manage_lavanderia===false,'migra lavanderia Essencial legado');
assert(migrated.guidedSetup.adminProfiles.essential.manage_amenidades===false,'migra amenidades Essencial legado');
assert(migrated.guidedSetup.adminProfiles.essential.manage_checkin===true,'preserva check-in delegado');

// Customização explícita não deve ser reescrita.
const custom=clone(legacy);
custom.guidedSetup.adminProfiles.essential.manage_checkin=false;
const customMigrated=normalizeState(custom);
assert(customMigrated.guidedSetup.adminProfiles.essential.manage_limpeza===true,'perfil customizado não deve ser reinterpretado');
assert(customMigrated.guidedSetup.adminProfiles.essential.manage_checkin===false,'customização check-in preservada');

console.log('V39 workload Essencial/Premium: todos os testes passaram.');
