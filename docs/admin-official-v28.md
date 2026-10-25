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

Decisão de modelagem original da V28:
- 80% foi inicialmente usado como piso-alvo conservador;
- uplift default de diária = 0%;
- a premissa não é usada como evidência independente no módulo de comparáveis de mercado.

**Recalibração V30:** o piso fixo de 80% foi substituído por +20 pontos percentuais sobre a ocupação autogerida de cada período, com teto de 100%.

**Evolução V31:** esses 20 p.p. deixam de pertencer ao preset de um plano específico e viram uma **variável global calibrável de diferença de gestão**. A interface permite informar a ocupação pela lente sem administradora ou já com administradora e deriva a outra automaticamente.

Decisão posterior: a Issue #46 foi descartada. Não será exigida validação adicional com histórico da administradora para sustentar esse default operacional.

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

## Verificação

Suíte completa: **28/28 testes**.

A comparação direta contra a V27 confirmou zero diferença nos indicadores econômicos do cenário-base enquanto o wizard não é aplicado.


### Diferença operacional Essencial × Premium

A V39 corrige uma simplificação antiga: ambos os presets estavam marcando as mesmas tarefas como gerenciadas, produzindo o mesmo esforço residual de 1 h/mês.

A proposta comercial original distinguia os planos:
- Essencial: vendas/reservas/check-in/atendimento são gerenciados, mas limpeza, lavanderia e consumíveis continuam operados pelo proprietário;
- Premium: essas tarefas operacionais também são assumidas pela administradora.

A V39 passa a refletir essa diferença apenas no eixo **quem gerencia / horas próprias**. As respostas oficiais posteriores sobre quem paga cada custo continuam prevalecendo para o eixo financeiro.
