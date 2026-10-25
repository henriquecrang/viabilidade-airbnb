# V32 — Resumo final filtrável e horizonte de 3 anos

Data: 25/10/2026  
Issue: #49

## Objetivo

Transformar o resumo final na principal superfície de decisão, com comparação plurianual legível e controle explícito sobre quais cenários aparecem.

## Cenários

A seção final calcula uma visão própria com a comparação Essencial/Premium habilitada, independentemente de o wizard da administradora ter sido aberto.

Cenários disponíveis:
- Airbnb próprio — autogestão;
- Airbnb próprio — Admin Essencial;
- Airbnb próprio — Admin Premium;
- Airbnb alugado — autogestão;
- Airbnb alugado — Admin Essencial;
- Airbnb alugado — Admin Premium;
- aluguel tradicional;
- investimento financeiro.

O seletor acima dos cards controla apenas a apresentação. Ele não remove premissas nem altera o motor detalhado.

## Horizonte padrão

O horizonte principal passa de 5 para **3 anos**.

Os cards finais são construídos com `calculateHorizonProjection(..., 3)` por default.

Para o excedente nominal sobre preservação:
- total = valor acumulado/projetado no horizonte;
- média anual = total ÷ anos;
- média mensal equivalente = total ÷ (anos × 12).

Essas médias são equivalentes aritméticos, não um motor mensal.

## Cards finais

Cada card passa a destacar:
- excedente total no horizonte;
- média anual;
- média mensal equivalente;
- caixa livre acumulado e equivalentes;
- ganho patrimonial real;
- resultado econômico real;
- capital inicial, CAPEX, reservas, capital de giro e caução;
- patrimônio final nominal e real;
- custo real do trabalho;
- gaps financeiro/econômico contra o benchmark;
- payback.

## Filtro

`analysis.finalScenarioIds` guarda os cenários exibidos. O default contém os oito cenários. A interface impede que o usuário desmarque todos ao mesmo tempo.

A tabela de 1/3/5 anos usa o mesmo filtro da grade de cards.

## Restaurar defaults

O botão **Restaurar defaults** no cabeçalho:
1. pede confirmação;
2. substitui o estado atual por `defaultState`;
3. regrava o autosave;
4. renderiza novamente toda a interface.

## Compatibilidade

Simulações antigas recebem os novos campos por merge de defaults. Valores previamente escolhidos para o horizonte continuam preservados quando carregados; o horizonte 3 anos é o default de novas simulações/restaurações.

## Verificação

Suíte completa: **32/32 testes**.

Teste específico: `tests/final-summary-v32.test.js`.
