const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,buildHybridWizardPatch,applyWizardPatch,calculateModel}=window.SimulatorAirbnb;
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

const draft={
  avoidedLodgingPerDay:300,
  personalUseIncrementalCostPerDay:50,
  habitualHousingBenefitAnnual:12000,
  habitualUseIncrementalCostAnnual:3000,
  preparationAnnualCost:1000,
  storageAnnualCost:500,
  otherIncrementalAnnualCost:500,
  incrementalAirbnbCostsDeductibleIR:false,
  incrementalAirbnbCapex:10000,
  incrementalAirbnbCapexResidualPct:40
};
for(const season of defaultState.seasons){
  draft[`personal_${season.id}`]=0;
  draft[`habitual_${season.id}`]=0;
  draft[`operational_${season.id}`]=0;
}
draft[`personal_${defaultState.seasons[1].id}`]=10;
draft[`habitual_${defaultState.seasons[3].id}`]=20;
draft[`operational_${defaultState.seasons[4].id}`]=5;

let patch=buildHybridWizardPatch(draft,defaultState);
assert(patch.valid,'wizard híbrido deve aceitar classificação válida');
approx(patch.normalized.personalUseDays,10,1e-9,'uso pessoal');
approx(patch.normalized.habitualUseDays,20,1e-9,'moradia');
approx(patch.normalized.operationalUnavailableDays,5,1e-9,'indisponibilidade');
approx(patch.values.hybridUse.avoidedLodgingPerDay,300,1e-9,'hospedagem evitada');
assert(patch.values['guidedSetup.hybrid'].granularity==='annual-periods','granularidade deve permanecer anual');

const configured=applyWizardPatch(defaultState,patch);
const calc=calculateModel(configured);
approx(calc.personalUseDays,10,1e-9,'motor uso pessoal');
approx(calc.habitualUseDays,20,1e-9,'motor moradia');
approx(calc.operationalUnavailableDays,5,1e-9,'motor indisponibilidade');
assert(calc.hybridUse.active===true,'lente híbrida deve ativar');
approx(calc.hybridUse.personalUseBenefitGross,3000,.01,'benefício pessoal');
approx(calc.hybridUse.habitualHousingBenefitGross,12000,.01,'benefício moradia');

// Não aceitar calendário anual impossível.
const invalid={...draft};
const first=defaultState.seasons[0];
invalid[`personal_${first.id}`]=first.days;
invalid[`habitual_${first.id}`]=1;
patch=buildHybridWizardPatch(invalid,defaultState);
assert(!patch.valid,'soma acima do período deve bloquear aplicação');
assert(patch.errors.length===1,'erro deve identificar período excedido');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('id="openHybridWizard"'),'launcher híbrido ausente');

console.log('V24 wizard híbrido: testes passaram.');
