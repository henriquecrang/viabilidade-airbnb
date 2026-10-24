# Roadmap — Viabilidade Airbnb

Este arquivo é o **mapa conceitual e estratégico** do projeto. O controle operacional do trabalho — status, prioridade, escopo executável e conclusão — passou a ser feito em **GitHub Issues**.

> Regra de organização: o Markdown explica **por que** e **em que ordem** evoluímos o produto; as Issues controlam **o que precisa ser feito**.

## Princípios do produto

- Separar fluxo de caixa, patrimônio, capital vinculado e resultado econômico.
- Evitar dupla contagem entre OPEX, CAPEX, depreciação, reservas e custo de oportunidade.
- Manter comparações nominal × real explícitas.
- Preservar compatibilidade de simulações salvas quando possível.
- Criar testes de regressão para regras econômicas estabilizadas.
- Não esconder premissas: wizards e estimadores devem preencher valores editáveis, não substituir o modelo por uma “caixa-preta”.
- Tratar defaults de mercado como ponto de partida documentado, nunca como verdade universal.

## Entregas já concluídas

### Rodada A — correções econômicas críticas
Concluída em 23/10/2026.

Incluiu:
- delegação e horas do proprietário;
- caixa sustentável da aplicação financeira;
- preservação de reservas vinculadas;
- base tributável configurável;
- testes de regressão da Rodada A.

Histórico preservado no Git.

### Rodada B0 — calibração e apresentação
Concluída em 23/10/2026, com uma pendência de pesquisa que foi migrada para a Issue #5.

Incluiu:
- destaque do **Excedente nominal sobre preservação do poder de compra**;
- defaults de mercado recalibrados para Rio/out-2026;
- página ampliada com cinco resultados lado a lado;
- testes da Rodada B0.

### V10 — defaults de trabalho e sazonalidade
Concluída em 24/10/2026.

Premissas do cenário-base:
- posição inicial: **já possui o imóvel**;
- valor econômico da hora: R$ 100;
- trabalho próprio distribuído por tarefa e por reserva;
- ocupação recuperada da planilha original;
- diárias calibradas pela proposta da administradora: R$ 750 Réveillon/Carnaval, R$ 400 verão e R$ 250 demais períodos;
- tabela consolidada separa horas, custo econômico das horas e resultado econômico.

A futura venda do imóvel para formar o benchmark financeiro líquido está na Issue #34.

## Rodadas de execução

### Rodada B — fidelidade do cenário administrado
**Delivery:** #1

Objetivo: representar melhor o que realmente muda quando a operação é terceirizada.

Issues:
- #2 — impacto da administradora em diária e ocupação;
- #3 — CAPEX: pagador × proprietário do ativo;
- #4 — Δ financeiro × Δ econômico vs benchmark;
- #5 — calibração com proposta comercial real de administradora.

### Rodada C — métricas e interpretação
**Delivery:** #6 · **Concluída em 24/10/2026**

Entregou:
- #7 — diária média, ADR total, RevPAR de diárias e RevPAR total;
- #4 — comparação financeira × econômica;
- #8 — capital de giro manual por estratégia;
- #9 — equivalente mensal dos resultados anuais;
- #10 — suíte ampliada de regressão;
- #31 — revisão da base tributável e dos defaults fiscais.

Implementação principal: V9, commit `902acdbd2c6ce2d2abbc1185113638db00525399`.

### Pré-Rodada D — cenário Airbnb em imóvel alugado
**Issue:** #36

Revisar encargos contratuais, custos fixos, CAPEX e a distinção entre imóvel mobiliado e não mobiliado antes de consolidar a matriz posse × gestão.

### Rodada D — arquitetura dos cenários Airbnb
**Delivery:** #11

Objetivo: refatorar o motor para a matriz **posse × gestão** depois de estabilizar as regras de administradora.

Issue:
- #12 — próprio/alugado × autogestão/administradora.

### Rodada E — modelo mensal e horizonte 3/5 anos
**Delivery:** #13

Objetivo: levar o modelo anual para uma linha do tempo capaz de representar timing, capital de giro e evolução patrimonial.

Issue já aberta:
- #14 — timing dos aportes no benchmark financeiro.

Escopo macro futuro:
- fluxo mensal;
- capital de giro automático;
- reservas ao longo do tempo;
- depreciação/reposição;
- reajustes de aluguel;
- valorização do imóvel;
- patrimônio nominal/real em 1, 3 e 5 anos;
- payback do CAPEX.

Novas Issues desse bloco devem ser abertas apenas quando a Rodada E estiver próxima, evitando detalhamento prematuro.

## Frentes e epics paralelos

### Epic — inteligência de mercado para diária e ocupação
**Epic:** #15

Objetivo: estimar diária, ocupação, sazonalidade e RevPAR a partir das características do imóvel e de comparáveis auditáveis.

Issues filhas:
- #16 — metodologia e fontes de comparáveis;
- #17 — características do imóvel e seleção de comparáveis;
- #18 — integração da estimativa ao simulador.

Esta frente pode avançar em paralelo às Rodadas B/C porque sua saída é uma **sugestão de premissas**, não uma alteração silenciosa do motor.

### Epic — uso parcial e disponibilidade híbrida
**Epic:** #19

Objetivo: suportar:
- investimento com uso pessoal ocasional;
- segunda residência;
- moradia principal com Airbnb eventual.

Issues filhas:
- #20 — classificar disponibilidade e bloqueios;
- #21 — benefício econômico do uso pessoal;
- #22 — retorno incremental da locação eventual.

Preferencialmente executar depois do modelo mensal/plurianual, pois datas específicas têm grande impacto econômico.

### Epic — wizards de onboarding e configuração
**Epic:** #23

Objetivo: descobrir primeiro **quais cenários fazem sentido** e depois orientar o preenchimento das premissas.

Issues filhas:
- #24 — wizard principal de situação inicial/cenários;
- #25 — benchmark financeiro/custo de oportunidade;
- #26 — proposta de administradora;
- #27 — operação Airbnb;
- #28 — aquisição/venda do imóvel;
- #29 — uso parcial do imóvel.

O wizard é uma camada sobre o motor: todas as premissas geradas devem permanecer visíveis e editáveis.

## Taxonomia das Issues

### Rodadas
- `round:B`
- `round:C`
- `round:D`
- `round:E`

### Prioridade
- `priority:P1` — importante para correção/fidelidade do modelo ou próxima execução;
- `priority:P2` — relevante, mas dependente de estabilização anterior;
- `priority:P3` — evolução de UX/conveniência ou horizonte mais distante.

### Tipo
- `type:delivery` — agrupa uma rodada;
- `type:epic` — capacidade ampla do produto;
- `type:feature`
- `type:modeling`
- `type:research`
- `type:ui`
- `type:quality`
- `type:refactor`

### Áreas
Exemplos:
- `area:admin`
- `area:benchmark`
- `area:market`
- `area:metrics`
- `area:architecture`
- `area:hybrid`
- `area:onboarding`
- `area:tests`

Outros labels:
- `front:market-research` — frente paralela de pesquisa de mercado;
- `future` — horizonte posterior às rodadas funcionais atuais.

## GitHub Milestones e Project

O conector atual permite criar e editar Issues/labels, mas não expõe criação de **Milestones** ou de **GitHub Projects**.

Quando esses dois recursos forem configurados na interface do GitHub, a convenção será:

- **Milestone = Rodada** (`Rodada B`, `Rodada C`, `Rodada D`, `Rodada E`);
- os labels `round:*` existentes facilitam a migração para milestones;
- **Project** com visões de Board e Roadmap;
- campos recomendados: Status, Priority e Effort;
- as Issues de `type:delivery` continuam servindo como página de escopo/critério de saída da rodada;
- as Issues de `type:epic` continuam agrupando capacidades maiores, independentemente da rodada em que suas partes forem executadas.

### Evolução futura — mix de canais e taxas
**Issue:** #30

Hoje o modelo usa uma única taxa de plataforma. Futuramente, poderá representar um mix entre Airbnb, Booking, canal direto e outros, com taxas e participações diferentes. Essa evolução deve permanecer fora do motor principal até termos necessidade concreta e dados suficientes.

## Regra para novas ideias

1. Se ainda é uma ideia conceitual ou princípio de arquitetura, registrar aqui.
2. Quando houver uma unidade concreta de trabalho que pode ser concluída, criar uma Issue.
3. Se a capacidade exigir várias Issues, criar um `type:epic`.
4. Se precisar ser entregue junto com outras mudanças, associar ao label de rodada correspondente.
5. Commits e PRs devem referenciar a Issue; quando concluírem integralmente a tarefa, usar `Closes #N`.

---

O conteúdo detalhado do backlog anterior permanece acessível no histórico do Git até o commit que realizou esta migração.
