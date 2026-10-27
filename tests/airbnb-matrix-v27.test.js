const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {defaultState,calculateModel,calculateHorizonProjection,buildMainWizardPatch,enabledScenarioIds}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=27,'estado deve preservar a matriz V27+');
const calc=calculateModel(defaultState);
assert(calc.scenarios.length===7,'V27+ deve preservar a matriz e acrescentar imóvel parado');
for(const id of ['airbnb-self','airbnb-admin','airbnb-rented','airbnb-rented-admin']){
  assert(calc.scenarios.some(x=>x.id===id),`modo da matriz ausente: ${id}`);
}

const matrix=Object.fromEntries(calc.scenarios.filter(x=>x.id.startsWith('airbnb')).map(x=>[x.id,[x.possession,x.management]]));
assert(JSON.stringify(matrix['airbnb-self'])===JSON.stringify(['owned','self']),'próprio+autogestão');
assert(JSON.stringify(matrix['airbnb-admin'])===JSON.stringify(['owned','admin']),'próprio+admin');
assert(JSON.stringify(matrix['airbnb-rented'])===JSON.stringify(['rented','self']),'alugado+autogestão');
assert(JSON.stringify(matrix['airbnb-rented-admin'])===JSON.stringify(['rented','admin']),'alugado+admin');

const rentWizard=buildMainWizardPatch({situation:'rent-third-party',compareFinancial:true},defaultState);
assert(rentWizard.valid,'wizard de imóvel alugado deve ser válido');
assert(JSON.stringify(rentWizard.normalized.enabledScenarios)===JSON.stringify(['airbnb-rented','airbnb-rented-admin']),'wizard alugado deve exibir os dois modos de gestão');

let neutral=clone(defaultState);
neutral.airbnb.adminFeePct=0;
neutral.airbnb.adminMonthlyFee=0;
neutral.airbnb.adminOnboardingFee=0;
neutral.airbnb.adminNightlyRateImpactPct=0;
neutral.airbnb.adminOccupancyImpactPp=0;
neutral.airbnb.adminOccupancyImpactRelativePct=0;
neutral.airbnb.managementOccupancyDeltaPp=0;
neutral.airbnb.adminCleaningFeeRecipient='owner';
neutral.airbnb.adminCommissionBaseIncludesCleaning=true;
neutral.airbnb.adminPlatformFeeAllocation='gross-owner';
neutral.work.supervisionAdminHoursMonthly=0;
neutral.stayCosts=neutral.stayCosts.map(x=>({...x,adminManages:false,adminIncluded:false}));
neutral.monthlyCosts=neutral.monthlyCosts.map(x=>({...x,adminManages:false,adminIncluded:false}));
neutral.percentageCosts=neutral.percentageCosts.map(x=>({...x,adminManages:false,adminIncluded:false}));
neutral.reserveFunds=neutral.reserveFunds.map(x=>({...x,adminIncluded:false}));
neutral.setupCosts=neutral.setupCosts.map(x=>({...x,adminPays:false,adminAssetBelongsToOwner:true}));

const ncalc=calculateModel(neutral);
const selfRented=ncalc.scenarios.find(x=>x.id==='airbnb-rented');
const adminRented=ncalc.scenarios.find(x=>x.id==='airbnb-rented-admin');
for(const field of ['grossRevenue','opCosts','tax','operatingCash','freeCash','capex','setupResidual','initialCapital','endNetWorth','realWealthCreation','workHoursAnnual']){
  approx(adminRented[field],selfRented[field],.01,`gestão neutra deve coincidir / ${field}`);
}
assert(adminRented.initialCapital<ncalc.propertyValue,'modo alugado+admin não pode carregar valor do imóvel');
approx(adminRented.securityDeposit,selfRented.securityDeposit,.01,'mesma caução');
approx(adminRented.workingCapital,selfRented.workingCapital,.01,'mesmo capital de giro de posse');

let managed=clone(defaultState);
managed.airbnb.adminFeePct=20;
managed.airbnb.adminMonthlyFee=0;
managed.airbnb.adminOnboardingFee=0;
managed.airbnb.adminNightlyRateImpactPct=0;
managed.airbnb.adminOccupancyImpactRelativePct=0;
managed.airbnb.adminOccupancyImpactPp=0;
managed.airbnb.managementOccupancyDeltaPp=0;
managed.work.supervisionAdminHoursMonthly=1;
managed.stayCosts=managed.stayCosts.map(x=>({...x,adminManages:true,adminIncluded:false}));
managed.monthlyCosts=managed.monthlyCosts.map(x=>({...x,adminManages:x.rentedAirbnb?true:x.adminManages,adminIncluded:false}));
const mcalc=calculateModel(managed);
const mSelf=mcalc.scenarios.find(x=>x.id==='airbnb-rented');
const mAdmin=mcalc.scenarios.find(x=>x.id==='airbnb-rented-admin');
assert(mAdmin.workHoursAnnual<mSelf.workHoursAnnual,'administradora deve reduzir horas no imóvel alugado');
assert(mAdmin.opCosts>mSelf.opCosts,'comissão deve aparecer no modo alugado+admin');

for(const years of [1,3,5]){
  const h=calculateHorizonProjection(defaultState,years);
  const ra=h.scenarios.find(x=>x.id==='airbnb-rented-admin');
  assert(ra,'projeção alugado+admin ausente');
  approx(ra.propertyEndValue,0,.001,`sem patrimônio imobiliário / ${years}a`);
  assert(Number.isFinite(ra.realWealthCreation),`ganho real finito / ${years}a`);
}

const enabled=enabledScenarioIds(defaultState);
assert(enabled.includes('airbnb-rented-admin'),'novo modo deve ser conhecido pelo filtro');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('Admin gerencia'),'tabela detalhada deve manter gestão separada de custo incluído');

console.log('V27 matriz posse × gestão: quatro modos Airbnb passaram.');
