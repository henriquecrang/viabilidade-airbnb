const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {defaultState,normalizeState,buildAdminWizardPatch,applyWizardPatch,calculateModel}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=26,'estado deve preservar o wizard V26+');
assert(defaultState.guidedSetup.adminProposal.configured===false,'preset provisório não pode ser aplicado silenciosamente');

const legacy=clone(defaultState);
legacy.version=25;
delete legacy.airbnb.adminOccupancyImpactRelativePct;
delete legacy.airbnb.adminCommissionBaseIncludesCleaning;
delete legacy.airbnb.adminCleaningFeeRecipient;
delete legacy.airbnb.adminPlatformFeeAllocation;
delete legacy.guidedSetup.adminProposal;
const migrated=normalizeState(legacy);
assert(migrated.version===26,'migração V25→V26');
assert(migrated.airbnb.adminOccupancyImpactRelativePct===0,'migração não pode criar uplift');
assert(migrated.airbnb.adminCleaningFeeRecipient==='owner','migração preserva limpeza com proprietário');
assert(migrated.airbnb.adminPlatformFeeAllocation==='gross-owner','migração preserva regra legada da plataforma');

function controlled(){
  const s=clone(defaultState);
  s.seasons=[{id:'only',name:'Only',days:100,nightlyRate:100,occupancyPct:50,personalUseDays:0,habitualUseDays:0,operationalUnavailableDays:0,unavailableDays:0}];
  s.airbnb.avgStayNights=5;
  s.airbnb.cleaningFeeRevenue=100;
  s.airbnb.otherGuestFeeRevenue=0;
  s.airbnb.taxPct=0;
  s.airbnb.platformFeePct=16;
  s.monthlyCosts=s.monthlyCosts.map(x=>({...x,amount:0,ownerHoursMonthly:0}));
  s.stayCosts=s.stayCosts.map(x=>({...x,amount:0,ownerHoursPerReservation:0}));
  s.percentageCosts=s.percentageCosts.map(x=>({...x,pct:0}));
  s.reserveFunds=s.reserveFunds.map(x=>({...x,pct:0,openingBalance:0}));
  s.setupCosts=s.setupCosts.map(x=>({...x,amount:0}));
  s.work.supervisionAdminHoursMonthly=0;
  return s;
}

function commonDraft(){
  return {
    occupancyRelativePct:20,nightlyRateImpactPct:0,monthlyFee:0,onboardingFee:0,supervisionHoursMonthly:0,
    platformFeeAllocation:'split-shares',
    manage_limpeza:true,include_limpeza:false,
    manage_lavanderia:true,include_lavanderia:false,
    manage_amenidades:true,include_amenidades:false,
    manage_checkin:true,include_checkin:false,
    manage_marketing:true,include_marketing:false,
    manage_presales:true,include_presales:false,
    'manage_guest-support':true,'include_guest-support':false,
    'manage_local-support':true,'include_local-support':false,
    manage_software:true,include_software:false,
    manage_pricing:true,include_pricing:false
  };
}

let s=controlled();
let patch=buildAdminWizardPatch({
  ...commonDraft(),
  plan:'essential',
  commissionPct:15,
  cleaningFeeRecipient:'owner',
  cleaningInCommissionBase:true,
  maintenanceManaged:false,
  maintenanceIncluded:false,
  linenAdminPays:false,
  linenBelongsToOwner:true
},s);
assert(patch.valid,'Essencial deve ser válido');
s=applyWizardPatch(s,patch);
let c=calculateModel(s);
approx(c.adminWeightedOccupancy,0.60,1e-9,'20% relativo transforma 50% em 60%');
approx(c.adminAccommodationRevenue,6000,.01,'receita de diária Essencial');
approx(c.adminCleaningFeeRevenue,1200,.01,'taxa de limpeza Essencial');
approx(c.adminCommissionBase,7200,.01,'limpeza entra na base do Essencial');
approx(c.adminFee,1080,.01,'comissão Essencial 15%');
approx(c.adminCleaningPassThrough,0,.01,'limpeza não é repasse integral no Essencial');
approx(c.adminOwnerRevenueBeforePlatform,6120,.01,'parcela do proprietário antes Airbnb');
approx(c.adminPlatformFee,979.2,.01,'proprietário paga Airbnb só sobre sua parcela');
approx(c.scenarios.find(x=>x.id==='airbnb-admin').operatingCash,5140.8,.01,'caixa Essencial');

s=controlled();
patch=buildAdminWizardPatch({
  ...commonDraft(),
  plan:'premium',
  commissionPct:25,
  cleaningFeeRecipient:'admin',
  cleaningInCommissionBase:false,
  include_limpeza:true,
  maintenanceManaged:true,
  maintenanceIncluded:false,
  linenAdminPays:true,
  linenBelongsToOwner:false
},s);
assert(patch.valid,'Premium deve ser válido');
s=applyWizardPatch(s,patch);
c=calculateModel(s);
approx(c.adminWeightedOccupancy,0.60,1e-9,'uplift Premium');
approx(c.adminCommissionBase,6000,.01,'limpeza fora da base Premium');
approx(c.adminFee,1500,.01,'comissão Premium 25%');
approx(c.adminCleaningPassThrough,1200,.01,'limpeza 100% administradora');
approx(c.adminOwnerRevenueBeforePlatform,4500,.01,'parcela proprietário Premium');
approx(c.adminPlatformFee,720,.01,'Airbnb sobre parcela do proprietário Premium');
approx(c.scenarios.find(x=>x.id==='airbnb-admin').operatingCash,3780,.01,'caixa Premium');
assert(s.stayCosts.find(x=>x.id==='limpeza').adminIncluded===true,'limpeza Premium sem custo separado ao proprietário');
assert(s.setupCosts.find(x=>x.id==='enxoval').adminPays===true,'admin paga enxoval Premium');
assert(s.setupCosts.find(x=>x.id==='enxoval').adminAssetBelongsToOwner===false,'enxoval Premium não fica com proprietário');
assert(s.percentageCosts.find(x=>x.id==='maintenance').adminManages===true,'admin gerencia manutenção Premium');
assert(s.percentageCosts.find(x=>x.id==='maintenance').adminIncluded===false,'proprietário paga manutenção Premium');
assert(s.guidedSetup.adminProposal.provisionalAssumptions===true,'preset deve permanecer marcado provisório');
assert(s.guidedSetup.adminProposal.reviewIssue===44,'revisão futura deve apontar #44');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('id="openAdminWizard"'),'launcher da administradora ausente');
assert(html.includes('Administradora'),'texto do launcher ausente');

console.log('V26 wizard administradora: presets provisórios Essencial/Premium passaram.');
