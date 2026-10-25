const fs = require('fs');
const path = require('path');

global.window = {};
const root = path.join(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
eval(appSource);
const { defaultState, calculateModel } = window.SimulatorAirbnb;

function assert(condition, message) { if (!condition) throw new Error(message); }
function approx(actual, expected, tolerance = 1e-6, label = '') {
  if (Math.abs(actual - expected) > tolerance) throw new Error(`${label}: esperado ${expected}, obtido ${actual}`);
}

assert(defaultState.version >= 7, 'versão do estado deveria preservar ou superar a calibração B0');
assert(defaultState.name.includes('out/2026'), 'cenário-base deveria indicar out/2026');
approx(defaultState.globals.inflationPct, 4.3, 1e-9, 'inflação default');
approx(defaultState.airbnb.platformFeePct, 16, 1e-9, 'taxa Airbnb Brasil');
approx(defaultState.airbnb.avgStayNights, 5.6, 1e-9, 'estadia média');
approx(defaultState.airbnb.adminFeePct, 25, 1e-9, 'administração completa');
assert(defaultState.investment.mode === 'nominal', 'benchmark deveria abrir em taxa nominal');
approx(defaultState.investment.nominalRatePct, 13.65, 1e-9, 'CDI de referência');
approx(defaultState.traditional.monthlyRent, 3500, 1e-9, 'aluguel tradicional');
approx(defaultState.traditional.managementFeePct, 10, 1e-9, 'administração imobiliária');
approx(defaultState.seasons.reduce((s,x)=>s+x.days,0),365,1e-9,'dias sazonais');
assert(defaultState.seasons.length === 6, 'sazonalidade calibrada deveria ter seis faixas');

for (const id of ['lavanderia','limpeza','amenidades','checkin']) {
  const item = defaultState.stayCosts.find(x=>x.id===id);
  assert(item && item.adminManages === true, `${id} deveria ser gerenciado pela admin`);
  assert(item.adminIncluded === false, `${id} não deveria ser presumido incluído`);
}

const calc = calculateModel(defaultState);
assert(calc.scenarios.length === 6, 'V27 deve preservar B0 e acrescentar o quarto modo Airbnb');
for (const s of calc.scenarios) assert(Number.isFinite(s.nominalExcessOverPreservation), `${s.id}: excedente ausente`);
const inv = calc.scenarios.find(s=>s.id==='investment');
approx(inv.nominalExcessOverPreservation, inv.freeCash, 1e-6, 'investimento: excedente vs caixa sustentável');

assert(appSource.includes('b.nominalExcessOverPreservation - a.nominalExcessOverPreservation'), 'resumo final não ordena pelo excedente');
assert(appSource.includes('Maior excedente nominal sobre preservação'), 'rótulo principal não atualizado');

const css = fs.readFileSync(path.join(root,'styles.css'),'utf8');
assert(css.includes('max-width: 1560px'), 'página não ampliada');
assert(css.includes('repeat(6, minmax(0, 1fr))'), 'grid não prevê seis colunas');

const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('O ranking usa o excedente nominal sobre preservação do poder de compra'), 'explicação do ranking não atualizada');

console.log('Rodada B0: todos os testes passaram.');
