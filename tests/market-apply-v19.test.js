const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,calculateMarketSuggestion}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version===19,'integração mercado deve estar na V19');
const s=clone(defaultState);
s.market.subject.guests=4;
s.market.subject.beds=2;
s.market.comparables=[
 {id:'a',name:'A',source:'airdna',distanceKm:.3,roomType:'entire_home',bedrooms:1,guests:4,beds:2,bathrooms:1,acUnits:2,elevator:'unknown',parking:'unknown',qualityGrade:3,rating:4.8,reviewCount:20,activeRecently:true,minStayNights:0,nightlyRate:300,occupancyPct:60,occupancyEvidence:'estimated-source'},
 {id:'b',name:'B',source:'airdna',distanceKm:.5,roomType:'entire_home',bedrooms:1,guests:4,beds:2,bathrooms:1,acUnits:2,elevator:'unknown',parking:'unknown',qualityGrade:3,rating:4.9,reviewCount:30,activeRecently:true,minStayNights:0,nightlyRate:400,occupancyPct:70,occupancyEvidence:'estimated-source'},
 {id:'c',name:'C',source:'airdna',distanceKm:.8,roomType:'entire_home',bedrooms:1,guests:4,beds:2,bathrooms:1,acUnits:2,elevator:'unknown',parking:'unknown',qualityGrade:3,rating:4.7,reviewCount:15,activeRecently:true,minStayNights:0,nightlyRate:500,occupancyPct:80,occupancyEvidence:'estimated-source'}
];
const m=calculateMarketSuggestion(s);
approx(m.base.targetNightlyRate,400,.01,'mediana diária');
approx(m.base.targetOccupancyPct,70,.01,'mediana ocupação');
assert(m.base.hasPrice&&m.base.hasOccupancy,'base deve ter dois sinais');
assert(m.base.seasons.length===s.seasons.length,'deve preservar blocos sazonais');

const currentWeightedRate=s.seasons.reduce((sum,x)=>sum+x.days*x.occupancyPct/100*x.nightlyRate,0)/
 s.seasons.reduce((sum,x)=>sum+x.days*x.occupancyPct/100,0);
assert(m.base.rateScale>0,'fator diária válido');
approx(currentWeightedRate*m.base.rateScale,400,.01,'escala deve levar média ao alvo');

// Sem evidência de ocupação, não alterar ocupações sugeridas.
const noOcc=clone(s);noOcc.market.comparables.forEach(x=>{x.occupancyEvidence='none';x.occupancyPct=0;});
const m2=calculateMarketSuggestion(noOcc);
assert(m2.base.hasOccupancy===false,'ocupação sem evidência não pode ser sugerida');
for(let i=0;i<s.seasons.length;i++) approx(m2.base.seasons[i].occupancyPct,s.seasons[i].occupancyPct,.01,'ocupação preservada');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('marketSuggestionPanel'),'painel sugestão ausente');

console.log('V19 mercado aplicado: todos os testes passaram.');
