const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,buildAirbnbOpsWizardPatch,applyWizardPatch,calculateModel}=window.SimulatorAirbnb;
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

const patch=buildAirbnbOpsWizardPatch({
  avgStayNights:4,
  cleaningFeeRevenue:250,
  checkinCost:25,
  cleaningCost:200,
  laundryCost:75,
  guestSupportMonthly:300,
  localSupportMonthly:150,
  marketingMonthly:120,
  pmsMonthly:90,
  pricingMonthly:110,
  waterMonthly:210,
  electricityMonthly:420,
  gasMonthly:95,
  internetMonthly:130
},defaultState);
assert(patch.valid,'wizard operacional válido');
approx(patch.values['airbnb.avgStayNights'],4,1e-9,'estadia média');
approx(patch.values['airbnb.cleaningFeeRevenue'],250,1e-9,'taxa limpeza');
approx(patch.arrayValues.stayCosts.limpeza.amount,200,1e-9,'limpeza');
approx(patch.arrayValues.monthlyCosts.software.amount,90,1e-9,'PMS');
approx(patch.arrayValues.monthlyCosts.pricing.amount,110,1e-9,'pricing');
approx(patch.arrayValues.monthlyCosts.luz.amount,420,1e-9,'energia');

const configured=applyWizardPatch(defaultState,patch);
approx(configured.stayCosts.find(x=>x.id==='checkin').amount,25,1e-9,'check-in aplicado');
approx(configured.monthlyCosts.find(x=>x.id==='guest-support').amount,300,1e-9,'suporte aplicado');
approx(configured.monthlyCosts.find(x=>x.id==='agua').amount,210,1e-9,'água aplicada');
assert(configured.guidedSetup.airbnbOps.configured===true,'metadados do wizard');
assert(configured.monthlyCosts.find(x=>x.id==='software').deductibleIR===defaultState.monthlyCosts.find(x=>x.id==='software').deductibleIR,'dedutibilidade não deve mudar');
assert(configured.stayCosts.find(x=>x.id==='limpeza').ownerHoursPerStay===defaultState.stayCosts.find(x=>x.id==='limpeza').ownerHoursPerStay,'horas próprias não devem mudar');

// O wizard altera o motor somente pelos itens já existentes.
const base=calculateModel(defaultState).scenarios.find(x=>x.id==='airbnb-self');
const changed=calculateModel(configured).scenarios.find(x=>x.id==='airbnb-self');
assert(changed.opCosts!==base.opCosts || changed.grossRevenue!==base.grossRevenue,'premissas operacionais devem chegar ao motor');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('id="openAirbnbOpsWizard"'),'launcher operacional ausente');
assert(html.includes('Operação Airbnb'),'texto do wizard ausente');

console.log('V24 wizard operação Airbnb: testes passaram.');
