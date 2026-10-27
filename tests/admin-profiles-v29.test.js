const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {
  defaultState,calculateModel,calculateHorizonProjection,
  adminWizardPresetDraft,buildAdminWizardPatch,applyWizardPatch,enabledScenarioIds
}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}

assert(defaultState.version>=29,'estado deve preservar a arquitetura V29+');
assert(defaultState.guidedSetup.adminComparisonEnabled===false,'comparação não pode ligar silenciosamente');
assert(calculateModel(defaultState).scenarios.length===7,'cenário-base deve acrescentar imóvel parado sem alterar a arquitetura V29');

let s=clone(defaultState);
const essential={...adminWizardPresetDraft('essential',s),commissionPct:12};
s=applyWizardPatch(s,buildAdminWizardPatch(essential,s));
assert(s.guidedSetup.adminProfiles.essential.configured,'perfil Essencial deve ser persistido');

const premium={...adminWizardPresetDraft('premium',s),commissionPct:30};
s=applyWizardPatch(s,buildAdminWizardPatch(premium,s));
assert(s.guidedSetup.adminProfiles.premium.configured,'perfil Premium deve ser persistido');
assert(s.guidedSetup.adminProfiles.essential.commissionPct===12,'editar Premium não pode apagar Essencial');
assert(s.guidedSetup.adminProfiles.premium.commissionPct===30,'Premium deve manter configuração independente');

const calc=calculateModel(s);
assert(calc.scenarios.length===9,'comparação ativa deve expor nove estratégias com imóvel parado');
for(const id of ['airbnb-admin-essential','airbnb-admin','airbnb-rented-admin-essential','airbnb-rented-admin']){
  assert(calc.scenarios.some(x=>x.id===id),`variante administrada ausente: ${id}`);
}
assert(calc.scenarios.some(x=>x.id==='idle-property'),'imóvel parado deve permanecer na comparação ativa');
const essentialOwned=calc.scenarios.find(x=>x.id==='airbnb-admin-essential');
const premiumOwned=calc.scenarios.find(x=>x.id==='airbnb-admin');
assert(essentialOwned.adminPlan==='essential','tag Essencial ausente');
assert(premiumOwned.adminPlan==='premium','tag Premium ausente');
assert(essentialOwned.opCosts<premiumOwned.opCosts,'comissão de 12% deve custar menos que 30%');

const enabled=enabledScenarioIds(s);
assert(enabled.includes('airbnb-admin-essential')&&enabled.includes('airbnb-admin'),'grupo próprio deve expandir para os dois planos');
assert(enabled.includes('airbnb-rented-admin-essential')&&enabled.includes('airbnb-rented-admin'),'grupo alugado deve expandir para os dois planos');

for(const years of [1,3,5]){
  const h=calculateHorizonProjection(s,years);
  for(const id of ['airbnb-admin-essential','airbnb-admin','airbnb-rented-admin-essential','airbnb-rented-admin']){
    const sc=h.scenarios.find(x=>x.id===id);
    assert(sc,`projeção ausente: ${id} / ${years}a`);
    assert(Number.isFinite(sc.realWealthCreation),`ganho real inválido: ${id} / ${years}a`);
  }
}

console.log('V29 perfis Essencial/Premium: comparação simultânea e persistência independente passaram.');
