# V43 — Financiamento e aporte adicional na aquisição

Data: 25/10/2026  
Issue: #43

## Princípio

O simulador nunca cria financiamento ou aporte automaticamente para fazer uma compra caber. Toda fonte adicional precisa ser informada explicitamente.

## Fontes de aquisição

A necessidade inicial pode ser coberta por:
- capital inicialmente disponível;
- aporte adicional de capital próprio;
- financiamento;
- combinação das três fontes.

Custos de contratação do crédito entram uma única vez na necessidade inicial.

## Financiamento

O motor vigente é anual. Por isso o financiamento é representado por uma prestação anual fixa equivalente.

Para cada ano são registrados:
- saldo inicial;
- juros;
- amortização;
- pagamento total;
- saldo final.

Com taxa zero, a amortização é linear pelo prazo. Com taxa positiva, a prestação segue a fórmula de anuidade de pagamento fixo.

## Patrimônio e caixa

A dívida não é capital do usuário.

- pagamento da prestação reduz caixa;
- juros são custo financeiro;
- amortização reduz a dívida;
- saldo devedor é subtraído do patrimônio terminal;
- na venda do imóvel, o saldo projetado no horizonte é quitado no fechamento.

Assim, amortizar principal não cria nem destrói patrimônio por si só: reduz caixa e passivo simultaneamente.

## Benchmark

No caminho capital → compra:

`capital do benchmark = capital disponível + aporte adicional`

O principal financiado não entra no benchmark.

Aportes futuros necessários para cobrir déficits operacionais continuam sendo espelhados no benchmark no mesmo timing pelo motor anual.

## Compatibilidade

Se aporte adicional, principal financiado e custos de contratação forem zero:
- funding mode = cash;
- necessidade e sobra de capital preservam a lógica V25;
- resultados históricos do caminho cash-only permanecem compatíveis.

## Verificação

Teste específico: `tests/acquisition-financing-v43.test.js`.

Suíte completa: **40/40 testes**.
