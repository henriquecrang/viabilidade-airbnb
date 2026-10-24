const fs=require('fs');
const path=require('path');
global.window={};
eval(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'));
const {defaultState,normalizeState,calculateHorizonProjection}=window.SimulatorAirbnb;
const clone=x=>JSON.parse(JSON.stringify(x));
function assert(c,m){if(!c)throw new Error(m);}

assert(defaultState.version===20,'política de fim deve estar na V20');
assert(defaultState.rentedAirbnb.contractEndStrategy==='renew','default deve assumir renovação');

for(const h of [1,3,5]){
  const p=calculateHorizonProjection(defaultState,h);
  const rented=p.scenarios.find(x=>x.id==='airbnb-rented');
  assert(rented && rented.years===h,'projeção deve continuar operacional em '+h+' anos');
}

// Legado recebe renovação.
const legacy=clone(defaultState);
legacy.version=19;
delete legacy.rentedAirbnb.contractEndStrategy;
const migrated=normalizeState(legacy);
assert(migrated.rentedAirbnb.contractEndStrategy==='renew','migração deve assumir renovação');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.includes('Renovar e continuar'),'opção de continuidade ausente');
assert(html.includes('Encerrar a operação'),'opção futura ausente');
assert(html.includes('disabled title="Será implementado na Issue #40"'),'encerramento deve permanecer desabilitado');

console.log('V20 fim do horizonte: todos os testes passaram.');
