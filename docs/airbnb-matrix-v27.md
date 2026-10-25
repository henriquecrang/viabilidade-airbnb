# V27 — Matriz posse × gestão do Airbnb

Data: 24/10/2026  
Issues: #11, #12

## Objetivo

Eliminar a separação arquitetural entre “Airbnb próprio administrado” e “Airbnb alugado” e representar os quatro modos como combinações de duas dimensões.

| Posse | Gestão | ID |
| --- | --- | --- |
| próprio | autogestão | airbnb-self |
| próprio | administradora | airbnb-admin |
| alugado | autogestão | airbnb-rented |
| alugado | administradora | airbnb-rented-admin |

## Separação de responsabilidades

### Posse

**Próprio**
- valor e valorização do imóvel;
- aquisição/venda;
- patrimônio imobiliário;
- custos de propriedade;
- benchmark após venda quando aplicável.

**Alugado**
- aluguel pago ao proprietário;
- encargos atribuídos ao locatário;
- caução/garantia;
- custos de entrada do contrato;
- CAPEX específico mobiliado/não mobiliado;
- nenhum valor imobiliário no patrimônio.

### Gestão

**Autogestão**
- performance-base;
- taxa Airbnb do operador sobre a receita-base;
- tarefas e horas próprias;
- custos operacionais não delegados.

**Administradora**
- impacto em diária/ocupação;
- comissão e base de incidência;
- regra da taxa de limpeza;
- alocação da taxa Airbnb;
- tarefas gerenciadas;
- custos incluídos;
- onboarding;
- CAPEX pago pela administradora e titularidade do ativo;
- supervisão residual.

## Regra do novo modo alugado + administradora

O cenário combina o contrato de locação com as premissas de gestão, sem criar uma terceira lógica econômica.

Seu capital inicial inclui apenas:
- CAPEX/custos iniciais que o operador paga;
- reservas iniciais;
- caução;
- capital de giro;
- aportes necessários para déficit.

O valor do imóvel nunca entra no cenário.

## Regressão

A refatoração foi comparada diretamente com a V26. Os cinco cenários preexistentes mantiveram os mesmos valores nos principais indicadores e nos horizontes 1, 3 e 5 anos.

Teste específico: tests/airbnb-matrix-v27.test.js.

Suíte completa: **27/27**.

## Evoluções fora do escopo

- #40 — encerramento/liquidação ao fim do horizonte;
- #41 — motor mensal real;
- #45 — presets Essencial e Premium simultâneos com configurações independentes.
