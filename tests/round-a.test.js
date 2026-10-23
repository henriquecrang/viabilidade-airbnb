const fs = require('fs');
const path = require('path');

global.window = {};
const appPath = path.join(__dirname, '..', 'app.js');
eval(fs.readFileSync(appPath, 'utf8'));
const { calculateModel, defaultState, normalizeState } = window.SimulatorAirbnb;

const clone = (obj) => JSON.parse(JSON.stringify(obj));
const scenario = (calc, id) => calc.scenarios.find((item) => item.id === id);
function approx(actual, expected, tolerance = 1e-6, label = '') {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: esperado ${expected}, obtido ${actual}`);
  }
}

// Bloco 1: delegar uma atividade reduz horas, mas não altera o custo monetário.
let state = clone(defaultState);
state.globals.ownerHourlyValue = 100;
state.work.supervisionAdminHoursMonthly = 1;
state.stayCosts = [{
  id: 'checkin-test', name: 'Check-in', amount: 50,
  ownerHoursPerReservation: 2, adminManages: false,
  adminIncluded: false, deductibleIR: false
}];
state.monthlyCosts = [];
state.percentageCosts = [];
state.reserveFunds = [];
state.setupCosts = [];
state.airbnb.avgStayNights = 365;
let calc = calculateModel(state);
const adminBefore = scenario(calc, 'airbnb-admin');
const hoursBefore = calc.workHours.admin;
const cashBefore = adminBefore.operatingCash;
state.stayCosts[0].adminManages = true;
calc = calculateModel(state);
if (!(calc.workHours.admin < hoursBefore)) throw new Error('adminManages não reduziu horas');
approx(scenario(calc, 'airbnb-admin').operatingCash, cashBefore, 1e-6, 'adminManages alterou caixa');

// Marcar custo como incluído reduz dinheiro, mas não horas.
state.stayCosts[0].adminManages = false;
state.stayCosts[0].adminIncluded = true;
calc = calculateModel(state);
approx(calc.workHours.admin, hoursBefore, 1e-6, 'adminIncluded alterou horas');
if (!(scenario(calc, 'airbnb-admin').operatingCash > cashBefore)) throw new Error('adminIncluded não reduziu custo monetário');

// Bloco 2: caixa sustentável do investimento.
state = clone(defaultState);
state.globals.propertyValue = 1_000_000;
state.globals.inflationPct = 6;
state.investment.mode = 'nominal';
state.investment.nominalRatePct = 12;
state.investment.taxPct = 0;
state.investment.feesPct = 0;
calc = calculateModel(state);
let investment = scenario(calc, 'investment');
approx(investment.operatingCash, 120_000, 0.01, 'rendimento nominal líquido');
approx(investment.capitalPreservationAmount, 60_000, 0.01, 'preservação do capital');
approx(investment.freeCash, 60_000, 0.01, 'caixa sustentável');
approx(investment.realWealthCreation, 56_603.77358490566, 0.02, 'ganho real');

// Bloco 3: saldo inicial da reserva nunca desaparece quando a admin cobre aportes futuros.
state = clone(defaultState);
state.reserveFunds = [{ id: 'replacement', name: 'Reserva', pct: 5, openingBalance: 10_000, adminIncluded: true }];
calc = calculateModel(state);
approx(calc.adminReserveOpening, 10_000, 0.01, 'saldo inicial da reserva no cenário admin');
approx(calc.adminReserveContribution, 0, 0.01, 'novo aporte da reserva no cenário admin');
if (scenario(calc, 'airbnb-admin').linkedReserve < 9_999.99) throw new Error('saldo inicial da reserva desapareceu');

// Bloco 4: dedutibilidade afeta somente imposto/base tributável, não o OPEX.
state = clone(defaultState);
state.airbnb.taxPct = 20;
state.stayCosts = [{
  id: 'ded-test', name: 'Despesa teste', amount: 100,
  ownerHoursPerReservation: 0, adminManages: false,
  adminIncluded: false, deductibleIR: false
}];
state.monthlyCosts = [];
state.percentageCosts = [];
state.reserveFunds = [];
state.setupCosts = [];
calc = calculateModel(state);
const selfBefore = scenario(calc, 'airbnb-self');
const opCostsBefore = selfBefore.opCosts;
const taxBefore = selfBefore.tax;
state.stayCosts[0].deductibleIR = true;
calc = calculateModel(state);
const selfAfter = scenario(calc, 'airbnb-self');
approx(selfAfter.opCosts, opCostsBefore, 0.01, 'dedutibilidade alterou OPEX');
if (!(selfAfter.tax < taxBefore)) throw new Error('dedutibilidade não reduziu imposto');

// Sublocação: aluguel pago ao proprietário reduz a base tributável.
state = clone(defaultState);
state.airbnb.taxPct = 20;
state.rentedAirbnb.monthlyLeaseRent = 3000;
state.monthlyCosts = [];
state.stayCosts = [];
state.percentageCosts = [];
state.reserveFunds = [];
state.setupCosts = [];
calc = calculateModel(state);
const rented = scenario(calc, 'airbnb-rented');
const platformDeduction = state.airbnb.platformFeeDeductibleIR
  ? calc.airbnbRevenue * state.airbnb.platformFeePct / 100 : 0;
const expectedRentedTaxBase = Math.max(0, calc.airbnbRevenue - platformDeduction - 36_000);
approx(rented.details['Base tributável estimada'], expectedRentedTaxBase, 0.01, 'base tributável da sublocação');

// Compatibilidade: horas antigas do cenário administrado viram supervisão residual.
const legacy = clone(defaultState);
legacy.version = 5;
delete legacy.work.supervisionAdminHoursMonthly;
legacy.work.adminHoursMonthly = 7;
const migrated = normalizeState(legacy);
approx(migrated.work.supervisionAdminHoursMonthly, 7, 0.001, 'migração de horas antigas');
if ('adminHoursMonthly' in migrated.work) throw new Error('campo legado adminHoursMonthly não foi removido');

console.log('Rodada A: todos os testes passaram.');
