# V28 — Calibração oficial da administradora

Data: 24/10/2026

## Respostas incorporadas

### Comissão e taxa Airbnb

A administradora confirmou:
1. comissão de 15%/25% sobre o valor elegível pago pelo hóspede;
2. taxa Airbnb descontada primeiro sobre o total;
3. divisão entre proprietário e administradora depois desse desconto.

A V28 passou a exibir essa ordem diretamente. A decomposição é economicamente equivalente à antiga alocação proporcional da taxa, mas os rótulos agora refletem o fluxo informado.

### Taxa de limpeza

A taxa de limpeza:
- aumenta o total pago pelo hóspede;
- entra na divisão;
- portanto entra na base dos 15% e dos 25%.

A hipótese V26 de repasse integral da limpeza à administradora no Premium foi descartada.

Importante: receita de taxa de limpeza e custo operacional de limpeza continuam conceitos separados. A resposta não diz que o custo do profissional de limpeza esteja incluído na comissão.

### Enxoval

Regra confirmada: o enxoval pertence a quem compra.

No preset Premium, onde a administradora compra o enxoval, o ativo não integra o patrimônio do proprietário.

### Performance

Declaração comercial recebida:
- Superhost com apoio: acima de 80% de ocupação;
- proprietário sem apoio: abaixo de 60%;
- aumento de diária: pequeno/insignificante.

Decisão de modelagem:
- 80% é usado como **piso-alvo conservador** no preset oficial;
- o piso nunca reduz uma ocupação que já esteja acima de 80%;
- a sazonalidade é preservada por um ajuste uniforme em pontos percentuais, com teto de 100%;
- uplift default de diária = 0%;
- a alegação não entra como evidência no módulo de comparáveis de mercado.

Validação futura: Issue #46.

### Manutenção, enxoval e amenidades

A administradora afirmou que:
- manutenção de equipamentos, imóvel e bens é do proprietário;
- a administradora repõe/troca enxoval e amenidades.

O preset:
- mantém manutenção como custo do proprietário;
- não presume gestão dos reparos sem confirmação específica;
- preserva a compra do enxoval pela administradora no Premium;
- não presume que o custo monetário de amenidades esteja incluído apenas pela expressão “repõe/troca”.

## Compatibilidade

A V28 adiciona:
- `adminOccupancyMode`;
- `adminOccupancyTargetPct`;
- metadados de calibração oficial.

O cenário-base permanece com modo `delta` e alvo 0 até o wizard ser aplicado. Assim, simulações existentes não recebem uplift silencioso.
