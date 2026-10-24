# Auditoria V24 — 24/10/2026

## Escopo

Revisão de consistência econômica, temporal, de migração e de UX após V21–V24.

A auditoria cobre:

- motor anual e médias mensais equivalentes;
- disponibilidade híbrida;
- comparáveis de mercado;
- CAPEX, residual e depreciação;
- reservas e capital de giro;
- déficits e aportes externos;
- propriedade, venda e benchmark financeiro;
- horizontes de 1/3/5 anos;
- wizards e filtros de cenário;
- migrações preservadas pela suíte histórica.

## Resultado

A V24 não altera silenciosamente a economia do cenário-base.

Uma comparação direta entre o motor da V23 e o da V24 encontrou **zero diferenças** nos principais resultados do cenário-base e nos horizontes de 1, 3 e 5 anos.

A suíte completa após a auditoria contém **24 testes e passou 24/24**.

## Invariantes econômicas permanentes

O arquivo `tests/economic-invariants-v24.test.js` verifica, entre outros:

- receita − OPEX − imposto = caixa operacional;
- caixa operacional − reservas = caixa livre;
- déficit = aporte externo necessário;
- caixa livre − CAPEX = caixa do primeiro ano;
- patrimônio final − capital inicial = criação de riqueza;
- capital de giro e reservas permanecem patrimônio, não despesa;
- residual de CAPEX não é contado como caixa;
- aportes para cobrir déficit entram no capital de oportunidade;
- custos de venda são descontados uma única vez do capital líquido investível;
- Δ financeiro e Δ econômico reconciliam com o benchmark correspondente.

Os casos incluem default, CAPEX/reservas/capital de giro elevados, operação deficitária e custos materiais de venda.

## Motor temporal

O motor ativo permanece anual.

Não foram encontrados artefatos ativos como `timingMonthly`, `monthlyContribution`, `monthIndex`, `monthlyCash` ou calendário mensal. A V18 permanece apenas como histórico documental, e a evolução real continua na #41.

## Wizards

A camada guiada não substitui o motor.

Cada wizard:

1. parte das premissas atuais;
2. monta um patch explícito;
3. mostra revisão antes de aplicar;
4. escreve nos mesmos campos detalhados já existentes;
5. preserva metadados que não devem afetar economia.

O wizard principal filtra somente a apresentação dos cenários. A auditoria ajustou também os diagnósticos para não falar de venda/valorização de imóvel quando o usuário está vendo apenas Airbnb em imóvel alugado.

## Bloqueios reais

### #42 — capital → compra

O motor ainda não possui uma posição inicial economicamente completa para quem tem dinheiro e pretende comprar um imóvel.

Enquanto a #42 estiver aberta:

- #24 bloqueia esse caminho;
- #28 pode coletar capital disponível e custos de aquisição, mas deixa claro que esses valores ainda não entram no cálculo;
- nenhum benchmark usa venda de um imóvel que o usuário ainda não possui.

Implementar a #42 exige uma decisão de modelagem sobre capital inicial, custos de aquisição, eventual financiamento/entrada e comparação com manter o mesmo capital investido.

### #5 / #32 — administradora

A matriz Essencial/Premium continua dependente das respostas reais da administradora sobre base da comissão, limpeza, enxoval, manutenção, responsabilidades e performance.

Por isso #26 permanece bloqueada e a refatoração da matriz de gestão não foi antecipada.

## Futuro deliberadamente preservado

- #40 — estratégia de saída/liquidação no fim do horizonte;
- #41 — motor mensal real;
- #30 — mix Airbnb/Booking/direto;
- #26 — wizard da administradora, após #5/#32.

Nenhum desses itens foi puxado para a V24.
