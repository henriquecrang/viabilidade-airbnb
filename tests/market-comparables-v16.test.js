const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,normalizeState,calculateMarketComparables}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=16,'estado deve preservar comparáveis da V16');
assert(defaultState.market.subject.bedrooms===1,'imóvel-base deve ter 1 quarto');
assert(defaultState.market.subject.areaM2===33,'área cadastral do imóvel-base');
assert(Array.isArray(defaultState.market.comparables),'comparáveis devem ser array');

const market=clone(defaultState.market);
market.subject.guests=4;
market.subject.beds=2;
market.subject.elevator='yes';
market.subject.parking='no';
market.comparables=[
 {id:'a',name:'A',source:'inside-airbnb',distanceKm:.3,roomType:'entire_home',bedrooms:1,guests:4,beds:2,bathrooms:1,acUnits:2,elevator:'yes',parking:'no',qualityGrade:3,rating:4.9,reviewCount:50,activeRecently:true,minStayNights:2,nightlyRate:300,occupancyPct:70,occupancyEvidence:'estimated-source'},
 {id:'b',name:'B',source:'airbnb-manual',distanceKm:.8,roomType:'entire_home',bedrooms:1,guests:3,beds:2,bathrooms:1,acUnits:1,elevator:'yes',parking:'no',qualityGrade:4,rating:4.7,reviewCount:10,activeRecently:true,minStayNights:2,nightlyRate:400,occupancyPct:0,occupancyEvidence:'none'},
 {id:'c',name:'C',source:'inside-airbnb',distanceKm:.2,roomType:'private_room',bedrooms:1,guests:2,beds:1,bathrooms:1,acUnits:1,elevator:'unknown',parking:'unknown',qualityGrade:3,rating:4.8,reviewCount:20,activeRecently:true,minStayNights:1,nightlyRate:100,occupancyPct:90,occupancyEvidence:'none'},
 {id:'d',name:'D',source:'airdna',distanceKm:1.5,roomType:'entire_home',bedrooms:1,guests:4,beds:2,bathrooms:1,acUnits:2,elevator:'yes',parking:'no',qualityGrade:3,rating:4.8,reviewCount:30,activeRecently:true,minStayNights:2,nightlyRate:500,occupancyPct:60,occupancyEvidence:'observed'}
];
const r=calculateMarketComparables(market);
assert(r.eligibleCount===3,'três comparáveis elegíveis');
assert(r.scored.find(x=>x.id==='c').eligible===false,'quarto privado deve ser excluído');
approx(r.priceP25,350,.01,'P25 diária');
approx(r.priceMedian,400,.01,'mediana diária');
approx(r.priceP75,450,.01,'P75 diária');
assert(r.occupancyCount===2,'ocupação sem evidência não pode entrar');
approx(r.occupancyMedian,65,.01,'mediana ocupação');
assert(r.scored[0].id==='a','comparável mais semelhante deve liderar');

const legacy=clone(defaultState);
legacy.version=15; delete legacy.market;
const migrated=normalizeState(legacy);
assert(migrated.market.subject.bedrooms===1,'migração deve adicionar perfil default');
assert(migrated.market.comparables.length===0,'migração não inventa comparáveis');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('Imóvel-alvo e comparáveis'),'seção comparáveis ausente');
assert(html.includes('Evidência ocup.'),'campo de evidência ausente');

console.log('V16 comparáveis: todos os testes passaram.');
