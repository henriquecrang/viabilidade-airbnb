const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {defaultState,adminWizardPresetDraft,buildAdminWizardPatch,applyWizardPatch,calculateModel}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=28,'estado deve preservar a calibração V28+');
assert(defaultState.guidedSetup.adminProposal.provisionalAssumptions===false,'default não deve permanecer provisório');
assert(defaultState.guidedSetup.adminProposal.calibrationStatus==='official-response','calibração oficial ausente');
assert(defaultState.airbnb.adminOccupancyMode==='delta','default econômico deve permanecer neutro sem aplicar wizard');
assert(defaultState.airbnb.adminOccupancyTargetPct===0,'default não pode aplicar meta de ocupação silenciosamente');

const essential=adminWizardPresetDraft('essential',defaultState);
assert(essential.commissionPct===15,'Essencial 15%');
assert(essential.cleaningFeeRecipient==='owner','limpeza Essencial entra na divisão');
assert(essential.cleaningInCommissionBase===true,'limpeza Essencial na base');
assert(essential.occupancyMode==='target-floor'&&essential.occupancyTargetPct===80,'piso-alvo oficial');
assert(essential.occupancyRelativePct===0&&essential.occupancyImpactPp===0,'não usar +20% provisório');
assert(essential.nightlyRateImpactPct===0,'ADR sem uplift');
assert(essential.include_limpeza===false,'taxa de limpeza não implica custo de limpeza incluído');

const premium=adminWizardPresetDraft('premium',defaultState);
assert(premium.commissionPct===25,'Premium 25%');
assert(premium.cleaningFeeRecipient==='owner','limpeza Premium entra na divisão');
assert(premium.cleaningInCommissionBase===true,'limpeza Premium na base');
assert(premium.include_limpeza===false,'custo operacional de limpeza continua separado');
assert(premium.linenAdminPays===true,'administradora compra enxoval Premium');
assert(premium.linenBelongsToOwner===false,'enxoval Premium pertence a quem compra');
assert(premium.maintenanceIncluded===false,'manutenção de imóvel/equipamentos é do proprietário');
assert(premium.maintenanceManaged===false,'gestão de reparos não deve ser presumida');

function controlled(occupancyPct){
  const s=clone(defaultState);
  s.seasons=[{id:'only',name:'Only',days:100,nightlyRate:100,occupancyPct,personalUseDays:0,habitualUseDays:0,operationalUnavailableDays:0,unavailableDays:0}];
  s.airbnb.avgStayNights=5;
  s.airbnb.cleaningFeeRevenue=100;
  s.airbnb.otherGuestFeeRevenue=0;
  s.airbnb.taxPct=0;
  s.airbnb.platformFeePct=16;
  s.monthlyCosts=s.monthlyCosts.map(x=>({...x,amount:0,ownerHoursMonthly:0}));
  s.stayCosts=s.stayCosts.map(x=>({...x,amount:0,ownerHoursPerReservation:0}));
  s.percentageCosts=s.percentageCosts.map(x=>({...x,pct:0}));
  s.reserveFunds=s.reserveFunds.map(x=>({...x,pct:0,openingBalance:0}));
  s.setupCosts=s.setupCosts.map(x=>({...x,amount:0,rentedAmount:0}));
  s.work.supervisionAdminHoursMonthly=0;
  return s;
}

let s=controlled(50);
let patch=buildAdminWizardPatch(essential,s);
s=applyWizardPatch(s,patch);
let c=calculateModel(s);
approx(c.adminWeightedOccupancy,0.80,1e-9,'piso-alvo eleva 50% para 80%');
approx(c.adminAccommodationRevenue,8000,.01,'diárias Essencial');
approx(c.adminCleaningFeeRevenue,1600,.01,'limpeza Essencial');
approx(c.adminCommissionBase,9600,.01,'limpeza entra na base Essencial');
approx(c.adminCommissionGrossShare,1440,.01,'parcela bruta 15%');
approx(c.adminFee,1209.6,.01,'comissão líquida após taxa Airbnb');
approx(c.adminCleaningPassThrough,0,.01,'limpeza não vai integralmente à admin');
approx(c.adminPlatformFee,1536,.01,'Airbnb descontado primeiro do total');
approx(c.adminPlatformFeeAttributedToAdmin,230.4,.01,'parte da taxa Airbnb atribuída à admin');
approx(c.adminOwnerRevenueAfterPlatformAndSplit,6854.4,.01,'parcela líquida proprietário após Airbnb e divisão');
approx(c.scenarios.find(x=>x.id==='airbnb-admin-essential').operatingCash,6854.4,.01,'caixa Essencial oficial');
assert(s.guidedSetup.adminProposal.calibrationStatus==='official-response','metadado oficial');
assert(s.guidedSetup.adminProposal.source==='respostas-oficiais-administradora-2026-10-24','fonte oficial');

s=controlled(50);
patch=buildAdminWizardPatch(premium,s);
s=applyWizardPatch(s,patch);
c=calculateModel(s);
approx(c.adminWeightedOccupancy,0.80,1e-9,'piso Premium');
approx(c.adminCommissionBase,9600,.01,'limpeza entra na base Premium');
approx(c.adminCommissionGrossShare,2400,.01,'parcela bruta Premium 25%');
approx(c.adminFee,2016,.01,'comissão Premium líquida após Airbnb');
approx(c.adminCleaningPassThrough,0,.01,'limpeza Premium não é repasse integral');
approx(c.adminPlatformFee,1536,.01,'Airbnb descontado primeiro do total Premium');
approx(c.adminPlatformFeeAttributedToAdmin,384,.01,'parte da taxa Airbnb atribuída à admin Premium');
approx(c.adminOwnerRevenueAfterPlatformAndSplit,6048,.01,'parcela líquida proprietário Premium');
approx(c.scenarios.find(x=>x.id==='airbnb-admin').operatingCash,6048,.01,'caixa Premium oficial');
assert(s.setupCosts.find(x=>x.id==='enxoval').adminPays===true,'admin paga enxoval Premium');
assert(s.setupCosts.find(x=>x.id==='enxoval').adminAssetBelongsToOwner===false,'enxoval não é patrimônio do proprietário');
assert(s.percentageCosts.find(x=>x.id==='maintenance').adminIncluded===false,'manutenção continua do proprietário');

s=controlled(90);
patch=buildAdminWizardPatch(essential,s);
s=applyWizardPatch(s,patch);
c=calculateModel(s);
approx(c.adminWeightedOccupancy,0.90,1e-9,'piso-alvo não pode reduzir ocupação já acima de 80%');
approx(c.adminOccupancyTargetExtraPp,0,1e-9,'sem ajuste quando já acima do piso');

console.log('V28 calibração oficial da administradora: respostas incorporadas e testadas.');
