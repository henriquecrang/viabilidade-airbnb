const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));

const {
  defaultState,normalizeState,calculateModel,
  occupancyInputBasis,managementOccupancyDeltaPp,
  selfOccupancyPctFromInput,adminReferenceOccupancyPctFromInput,
  occupancyDisplayPct,convertOccupancyInputBasis
}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}
function approx(a,b,t=1e-6,m=''){if(Math.abs(a-b)>t)throw new Error(`${m}: esperado ${b}, obtido ${a}`);}

assert(defaultState.version>=31,'estado deve preservar a arquitetura V31+');
assert(occupancyInputBasis(defaultState)==='self','base default autogestão');
approx(managementOccupancyDeltaPp(defaultState),20,1e-9,'delta global default');
approx(defaultState.airbnb.adminOccupancyImpactPp,0,1e-9,'ajuste adicional do perfil deve começar zerado');

let c=calculateModel(defaultState);
approx(c.weightedOccupancy,217.35/365,1e-12,'ocupação autogestão V30 preservada');
approx(c.adminWeightedOccupancy,288.15/365,1e-12,'admin = autogestão + 20 p.p. com teto');

const summer=defaultState.seasons.find(x=>x.id==='verao');
approx(occupancyDisplayPct(summer.occupancyPct,defaultState),75,1e-9,'entrada default mostra autogestão');
approx(adminReferenceOccupancyPctFromInput(summer.occupancyPct,defaultState),95,1e-9,'verão admin derivado');

const switched=convertOccupancyInputBasis(defaultState,'admin');
assert(occupancyInputBasis(switched)==='admin','troca para base admin');
approx(switched.seasons.find(x=>x.id==='verao').occupancyPct,75,1e-9,'armazenamento canônico continua autogestão');
approx(occupancyDisplayPct(switched.seasons.find(x=>x.id==='verao').occupancyPct,switched),95,1e-9,'entrada passa a exibir admin');
approx(selfOccupancyPctFromInput(95,switched),75,1e-9,'entrada admin volta para autogestão canônica');
c=calculateModel(switched);
approx(c.weightedOccupancy,217.35/365,1e-12,'trocar base não muda autogestão');
approx(c.adminWeightedOccupancy,288.15/365,1e-12,'trocar base não muda admin');

const saturated=convertOccupancyInputBasis(defaultState,'admin');
const reveillon=saturated.seasons.find(x=>x.id==='reveillon');
approx(occupancyDisplayPct(reveillon.occupancyPct,saturated),100,1e-9,'teto admin 100');
const back=convertOccupancyInputBasis(saturated,'self');
approx(back.seasons.find(x=>x.id==='reveillon').occupancyPct,100,1e-9,'troca ida/volta não perde 100% canônico');

const d10=clone(defaultState);
d10.airbnb.managementOccupancyDeltaPp=10;
const c10=calculateModel(d10);
approx(c10.weightedOccupancy,217.35/365,1e-12,'delta não altera autogestão');
assert(c10.adminWeightedOccupancy<c.adminWeightedOccupancy,'delta menor reduz admin');

// V30 não configurada: novo delta 20, ajuste adicional 0.
const old=clone(defaultState);
old.version=30;
delete old.airbnb.occupancyInputBasis;
delete old.airbnb.managementOccupancyDeltaPp;
old.airbnb.adminOccupancyImpactPp=0;
const migrated=normalizeState(old);
assert(migrated.airbnb.occupancyInputBasis==='self','migração usa base autogestão');
approx(migrated.airbnb.managementOccupancyDeltaPp,20,1e-9,'migração V30 recebe referência 20');
approx(migrated.airbnb.adminOccupancyImpactPp,0,1e-9,'migração V30 não cria -20 adicional');

// V30 configurada com total +20: mover total para global sem duplicar.
const configured=clone(old);
configured.airbnb.adminOccupancyImpactPp=20;
configured.guidedSetup.adminProposal={configured:true,plan:'premium',occupancyImpactPp:20,calibrationStatus:'official-response'};
configured.guidedSetup.adminProfiles.premium={configured:true,plan:'premium',occupancyImpactPp:20};
const migratedConfigured=normalizeState(configured);
approx(migratedConfigured.airbnb.managementOccupancyDeltaPp,20,1e-9,'total antigo vira referência global');
approx(migratedConfigured.airbnb.adminOccupancyImpactPp,0,1e-9,'ativo não duplica');
approx(migratedConfigured.guidedSetup.adminProfiles.premium.occupancyImpactPp,0,1e-9,'perfil não duplica');

console.log('V31 ocupação bidirecional: base explícita, delta calibrável e migração passaram.');
