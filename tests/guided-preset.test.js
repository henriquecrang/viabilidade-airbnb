const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
global.window = {};
eval(fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, '..', 'guided-preset.js'), 'utf8'));
const flow = window.GuidedPreset, sim = window.SimulatorAirbnb;
const before = JSON.stringify(sim.defaultState);
function complete(overrides = {}) {
  const answers = { situation: 'owned', modality: 'both', management: 'both', plan: 'both', personalUse: 'none', compareInvestment: 'yes', idle: 'yes', preparation: 'none', seasonMode: 'reference', traditionalCharges: 'tenant', detailOps: 'reference', horizon: '3', financing: 'no', additionalEquity: 'no', ...overrides };
  // Fill only active questions, just as a person pressing Continue on each reference.
  for (let i = 0; i < flow.questions(answers).length; i++) {
    const q = flow.questions(answers)[i];
    if (!(q.id in answers) && q.type !== 'summary') answers[q.id] = q.type === 'choice' ? q.options[0][0] : q.defaultValue;
  }
  return answers;
}
const cases = [];
for (const situation of ['owned', 'capital-buy', 'rent-third-party']) {
  for (const management of ['self', 'admin', 'both']) {
    for (const plan of ['essential', 'premium', 'both']) {
      const a = complete({ situation, management, plan });
      if (situation === 'capital-buy') a.availableCapital = 1000000;
      const result = flow.buildPreset(a, Object.keys(a));
      assert.deepEqual(result.errors, [], `${situation}/${management}/${plan}`);
      assert.deepEqual(sim.finalVisibleScenarioIds(result.state), result.selected);
      assert.deepEqual(sim.enabledScenarioIds(result.state), result.selected, 'No extra management plan in details');
      for (const years of [1, 3, 5]) {
        const calc = sim.finalProjection(years, result.state);
        for (const id of result.selected) {
          const s = calc.scenarios.find(x => x.id === id);
          assert(s, `Missing ${id}`);
          assert(Number.isFinite(s.economicRealWealthCreation), `${id} must calculate`);
        }
      }
      assert.equal(result.state.market.comparables.length, 0);
      assert.equal(result.state.market.subject.address, '');
      assert.equal(sim.normalizeState(result.state).market.comparables.length, 0);
      cases.push(result);
    }
  }
}
const traditional = complete({ modality: 'traditional', compareInvestment: 'no', idle: 'no' });
const tradQs = flow.questions(traditional).map(q => q.id);
for (const id of ['management', 'plan', 'seasonMode', 'avgStay', 'stay_limpeza', 'preparation', 'platformFee']) assert(!tradQs.includes(id), `Skip ${id}`);
assert.deepEqual(flow.scenarioIds(traditional), ['traditional']);
const stale = { ...traditional, management: 'both', plan: 'both', preparation: 'detail', setup_mobilia: 98765, stay_limpeza: 9999, financingPrincipal: 99999 };
const staleResult = flow.buildPreset(stale);
assert.deepEqual(staleResult.selected, ['traditional']);
assert.equal(staleResult.state.setupCosts.find(x => x.id === 'mobilia').amount, 0);
assert.equal(staleResult.state.stayCosts.find(x => x.id === 'limpeza').amount, sim.defaultState.stayCosts.find(x => x.id === 'limpeza').amount);
const renter = flow.buildPreset(complete({ situation: 'rent-third-party', furnished: 'yes', preparation: 'reference', rentedCharges: 'utilities' }));
assert(!renter.selected.some(x => ['idle-property','traditional','investment'].includes(x)));
assert.equal(renter.state.rentedAirbnb.furnished, true);
assert.equal(renter.state.monthlyCosts.find(x => x.id === 'condominio').rentedAirbnb, false);
const annual = flow.buildPreset(complete({ monthly_seguro: 300, monthly_iptu: 1200, monthly_tcl: 600 }));
for (const [id, value] of [['seguro',25],['iptu',100],['tcl',50]]) assert.equal(annual.state.monthlyCosts.find(x => x.id === id).amount, value);
const commission = flow.buildPreset(complete({ commissionEssential: 17, commissionPremium: 23, supervision: 2 }));
assert.equal(commission.state.guidedSetup.adminProfiles.essential.commissionPct, 17);
assert.equal(commission.state.guidedSetup.adminProfiles.premium.commissionPct, 23);
assert.equal(commission.state.guidedSetup.adminProfiles.essential.supervisionHoursMonthly, 2);
assert.equal(commission.state.guidedSetup.adminProfiles.premium.supervisionHoursMonthly, 2);
const hybrid = flow.buildPreset(complete({ personalUse: 'home', use_verao: 20, hybridBenefits: 'yes', housingBenefit: 12000 }));
assert.equal(hybrid.state.seasons.find(x => x.id === 'verao').habitualUseDays, 20);
assert.equal(hybrid.state.hybridUse.habitualHousingBenefitAnnual, 12000);
const seasonal = flow.buildPreset(complete({ seasonMode: 'detail', occupancyBasis: 'admin', managementDelta: 15, occupancy_verao: 80, rate_verao: 555 }));
assert.equal(seasonal.state.seasons.find(x => x.id === 'verao').occupancyPct, 65);
assert.equal(seasonal.state.seasons.find(x => x.id === 'verao').nightlyRate, 555);
const debt = flow.buildPreset(complete({ situation: 'capital-buy', financing: 'yes', availableCapital: 300000, financingPrincipal: 400000, financingRate: 10, financingTerm: 20, purchasePrice: 636000, purchaseCosts: 10000, additionalEquity: 'no' }));
assert.deepEqual(debt.errors, []);
assert.equal(debt.state.guidedSetup.acquisitionSale.financingPrincipal, 400000);
assert(sim.acquisitionFinancingSchedule(debt.state, 3).endingBalance < 400000);
const gap = flow.buildPreset(complete({ situation: 'capital-buy', availableCapital: 1000, financing: 'no', additionalEquity: 'no' }));
assert(gap.errors.some(x => x.message.includes('insuficientes')));
for (const [id, value] of [['monthly_seguro',-1], ['occupancy_verao',101], ['use_verao',82], ['availableCapital','']]) {
  const a = complete({ seasonMode:'detail', personalUse:'home', situation:'capital-buy', availableCapital:1000000, [id]:value });
  assert(flow.buildPreset(a).errors.some(x => x.questionId === id), `Reject invalid ${id}`);
}
assert.equal(JSON.stringify(sim.defaultState), before, 'Building a new preset must never mutate defaults or active state');
const noPersonalDays = flow.buildPreset(complete({ personalUse: 'occasional' }));
assert(noPersonalDays.errors.some(x => x.questionId.startsWith('use_')));
const tooSmallOccupancy = flow.buildPreset(complete({ seasonMode: 'detail', occupancyBasis: 'admin', managementDelta: 30, occupancy_verao: 20 }));
assert(tooSmallOccupancy.errors.some(x => x.questionId === 'occupancy_verao'));
const independentWorking = flow.buildPreset(complete({ situation: 'capital-buy', availableCapital: 1000000, detailOps: 'detail', working_airbnbSelf: 1000, working_airbnbAdmin: 5000 }));
assert.deepEqual(independentWorking.errors, []);
assert.equal(independentWorking.state.workingCapital.airbnbSelf, 1000);
assert.equal(independentWorking.state.workingCapital.airbnbAdmin, 5000);
console.log(`Guided preset: ${cases.length} scenario combinations, horizons, branches, references, financing and validation passed.`);
