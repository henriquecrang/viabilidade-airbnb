# V44 — Imóvel parado

Data: 26/10/2026  
Issue: #58

## Objetivo

Representar explicitamente a alternativa de manter um imóvel próprio sem Airbnb e sem aluguel tradicional.

## Economia

O cenário `idle-property`:
- tem receita de locação igual a zero;
- mantém o imóvel como patrimônio;
- usa a mesma valorização nominal/real dos demais cenários próprios;
- paga apenas os custos mensais marcados com `idleProperty=true`;
- não incorre em custos por reserva, plataforma, administradora ou IR sobre aluguel;
- mantém custo econômico do tempo separado.

### Defaults de carregamento

Marcados por default:
- seguro do imóvel;
- IPTU;
- TCL;
- água/esgoto;
- energia;
- gás;
- internet;
- condomínio.

Não marcados:
- marketing;
- pré-venda;
- atendimento ao hóspede;
- suporte local;
- software;
- pricing;
- seguro-garantia;
- contabilidade operacional;
- licenças operacionais.

A classificação é editável na tabela de custos mensais.

## Trabalho

Default: `work.idlePropertyHoursMonthly = 0.5`.

## Integração

O cenário reutiliza a máquina de imóvel próprio, portanto participa de:
- valorização;
- compra à vista ou financiada;
- benchmark financeiro equivalente;
- aportes por caixa negativo;
- projeções 1/3/5;
- estratégia de saída do imóvel próprio.

No wizard principal ele é elegível em:
- já possuo o imóvel;
- tenho capital e penso em comprar.

Não é elegível no caminho de imóvel alugado de terceiro.

## Default atual

- receita anual: R$ 0;
- custos de carregamento: R$ 16.585/ano;
- trabalho: 0,5 h/mês;
- horizonte de 3 anos: aproximadamente –R$ 1.375/mês de resultado econômico real equivalente.

## Verificação

Suíte completa: **41/41 testes**.

Teste específico: `tests/idle-property-v44.test.js`.
