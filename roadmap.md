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

### V12 — utilities do cenário-base
Concluída em 24/10/2026 na Issue #37.

Defaults mensais:
- água + esgoto: R$ 200;
- gás: R$ 100;
- energia elétrica: R$ 400.

A calibração usa tarifas atuais de Águas do Rio, Naturgy e Light e assume um apartamento de 1 quarto e sala em operação de temporada com dois aparelhos de ar-condicionado.

### V13 — IPTU e TCL do imóvel-base
Concluída em 24/10/2026 na Issue #38.

Imóvel-base identificado:
- Rua Maestro Francisco Braga, 76, apto 405, Copacabana;
- inscrição imobiliária 0916633-1;
- IPTU: R$ 0 (isenção/cobrança suspensa);
- TCL — Taxa de Coleta Domiciliar de Lixo: R$ 625/ano em 2026.

O modelo mantém IPTU e TCL como itens separados.

### V14 — benchmark financeiro após venda líquida
Concluída em 24/10/2026 na Issue #34.

O cenário-base parte de alguém que já possui o imóvel. O benchmark financeiro passa a modelar a decisão **vender + investir**, separando:
- valor de mercado/patrimônio inicial;
- valor esperado de venda;
- corretagem e custos de liquidação;
- eventual quitação de financiamento;
- capital líquido efetivamente investido.

Default de corretagem: 5%, editável.

### V17 — horizontes 1/3/5 anos
Concluída em 24/10/2026 na Issue #35.

- comparação 1/3/5 anos;
- horizonte principal default de 5 anos;
- CAPEX e venda entram uma única vez;
- inflação e valorização compostas.

A tentativa V18 de aproximar timing mensal foi posteriormente retirada por decisão de produto. O motor ativo permanece anual.

### V16/V19 — comparáveis e aplicação de mercado
Epic #15 concluído em 24/10/2026.

- metodologia auditável em `docs/market-methodology.md`;
- perfil do imóvel-alvo;
- comparáveis com filtros e score explicável;
- P25/mediana/P75;
- ocupação só entra com evidência adequada;
- cenários pessimista/base/otimista;
- aplicação explícita, sem sobrescrita silenciosa.

### V20 — política de continuidade ao fim do horizonte
Concluída em 24/10/2026.

- default: renovar / continuar;
- alternativa futura "encerrar a operação" já aparece na interface, mas permanece desabilitada;
- estratégia de saída multi-cenário foi separada na Issue #40;
- Issue #36 encerrada.

### V21 — motor anual e média mensal equivalente
Concluída em 24/10/2026.

- cálculo em passos anuais;
- déficits e aportes reconhecidos por ano;
- valores mensais são apenas média mensal equivalente;
- nenhum calendário/fluxo mensal é inferido;
- motor mensal real adiado para a Issue #41.

### V22 — uso parcial e disponibilidade híbrida
Concluída em 24/10/2026 — Epic #19 / Issues #20, #21 e #22.

- classificação anual de uso pessoal, moradia e indisponibilidade operacional;
- janelas de alta demanda continuam representadas pelos períodos sazonais existentes;
- compatibilidade com `unavailableDays` legado;
- benefício de hospedagem evitada e moradia separado de receita;
- custos fixos preexistentes separados dos custos incrementais do Airbnb eventual;
- custos mensais incrementais marcáveis item a item;
- CAPEX adicional com residual/depreciação;
- caixa incremental, benefício de consumo e patrimônio mantidos em lentes distintas;
- defaults neutros; cenário-base permanece numericamente idêntico.

### V23 — evidência real do mercado do imóvel-base
Concluída em 24/10/2026.

- snapshot de 19 comparáveis públicos no Bairro Peixoto e entorno;
- 14 diárias verificáveis, ainda abaixo do mínimo operacional de 15;
- links e datas de evidência expostos na interface;
- P25/mediana/P75 de preço mantidos como sugestão, nunca sobrescritos silenciosamente;
- ocupação permanece sem estimativa por falta de booked/available confiável;
- migração do cenário-base V22 vazio carrega o snapshot;
- resultados econômicos default permanecem inalterados até ação explícita de aplicar uma sugestão.

### V24 — configuração guiada e auditoria
Consolidada em 24/10/2026, com duas dependências explicitamente abertas.

- #25 concluída: wizard de benchmark financeiro;
- #27 concluída: wizard de operação Airbnb;
- #29 concluída: wizard de uso parcial/híbrido;
- #24 concluída na V25: o caminho capital → compra passou a habilitar cenários após uma aquisição válida ser configurada;
- #28 concluída na V25: capital disponível, custos de aquisição, CAPEX e capital de giro agora entram de forma auditável;
- #42 concluída na V25 com escopo de compra integralmente coberta pelo capital disponível; financiamento/aporte adicional foi separado para backlog;
- #26 concluída na V26 com presets provisórios Essencial/Premium; revisão formal deslocada para #44/#32;
- estrutura genérica de revisão/aplicação compartilhada entre os wizards;
- metadados descritivos ficam separados das variáveis que afetam o motor;
- nenhuma regra econômica é criada silenciosamente pela camada de onboarding;
- auditoria confirmou resultados default idênticos à V23 e 24/24 testes passando.

### V25 — aquisição a partir de capital disponível
Concluída em 24/10/2026.

- compra e benchmark partem do mesmo capital inicial;
- custos de aquisição entram uma única vez e são consumidos economicamente;
- CAPEX, reservas e capital de giro permanecem separados;
- sobra de capital continua aplicada financeiramente dentro do cenário de compra;
- benchmark financeiro de quem parte de capital não sofre custos de venda;
- compra que não cabe integralmente no capital informado é rejeitada;
- financiamento, dívida ou aporte adicional para completar a entrada ficam para backlog;
- #42, #28 e #24 concluídas;
- regressão confirmou zero alteração no cenário-base de imóvel já possuído e nos horizontes 1/3/5 anos;
- suíte ampliada para 25 testes.

### V26 — administradora Essencial/Premium provisória
Concluída em 24/10/2026.

- wizard da administradora implementado (#26);
- presets Essencial 15% e Premium 25%;
- taxa Airbnb alocada por parcela econômica no preset;
- limpeza Essencial entra na base de 15%;
- limpeza Premium vai integralmente à administradora e fica fora da base de 25%;
- uplift provisório de ocupação = +20% relativo;
- diária/ADR sem uplift por default;
- enxoval Premium pago e pertencente à administradora;
- manutenção Premium gerenciada pela administradora, mas paga pelo proprietário;
- premissas explicitamente marcadas como provisórias;
- #44 criada para revisão após resposta formal;
- #45 criada para comparação simultânea Essencial × Premium;
- cenário-base V25 preservado numericamente;
- suíte completa: 26/26 testes.

### V27 — matriz posse × gestão do Airbnb
Concluída em 24/10/2026 — Rodada D / Issues #11 e #12.

- motor Airbnb compartilhado por **posse** (próprio/alugado) × **gestão** (autogestão/administradora);
- quatro modos Airbnb gerados pela mesma estrutura;
- novo cenário `airbnb-rented-admin`;
- regras de contrato, caução, encargos e CAPEX alugado preservadas nos dois modos de gestão;
- regras da administradora aplicáveis igualmente a imóvel próprio e alugado;
- **Admin gerencia** separado de **Custo incluído** também em custos percentuais;
- horizontes 1/3/5 anos incluem o quarto modo;
- imóvel alugado + administradora não incorpora valor imobiliário ao patrimônio;
- regressão numérica zero nos cinco cenários preexistentes da V26;
- suíte completa: 27/27 testes;
- Rodada D concluída.

### V28 — respostas oficiais da administradora
Concluída em 24/10/2026.

- substituição das premissas provisórias da V26;
- taxa Airbnb modelada explicitamente antes da divisão;
- limpeza entra na divisão nos planos 15% e 25%;
- remoção do repasse integral da limpeza no Premium;
- enxoval pertence a quem compra;
- manutenção de imóvel/equipamentos permanece do proprietário;
- ocupação administrada suporta piso-alvo ou delta em p.p.;
- a V30 substitui o antigo piso default de 80% por **+20 p.p. por período**, com teto de 100%, sem uplift de ADR e com edição livre;
- #46 posteriormente descartada: não será exigido histórico adicional da administradora para sustentar esse default;
- contrato enviado classificado como canal direto/hóspede, não contrato de administração;
- #32 e #44 podem ser encerradas após incorporação;
- regressão do cenário-base V27 preservada;
- suíte completa: 28/28 testes.


### V29 — perfis independentes Essencial × Premium
Concluída em 24/10/2026 — Issue #45.

- perfis `essential` e `premium` persistidos separadamente;
- comparação simultânea nos regimes próprio e alugado;
- Premium preserva os IDs históricos para compatibilidade;
- Essencial recebe IDs próprios;
- edição do perfil ativo continua compatível com os controles detalhados;
- troca de plano captura a configuração ativa antes de aplicar a outra;
- horizontes 1/3/5 anos calculam cada perfil independentemente;
- cenário-base V28 permanece com seis estratégias até o wizard da administradora ser aplicado;
- suíte completa: 29/29 testes.


### V30 — recalibração de ocupação e autogestão manual
Concluída em 25/10/2026 — Issue #47.

- ocupação autogerida default reduzida para 59,55% ponderados;
- sazonalidade: 100% / 75% / 100% / 55% / 50% / 55%;
- administradora passa a usar +20 p.p. por período, com teto de 100%;
- uplift de ADR permanece 0%;
- trabalho manual por reserva recalibrado para 2 h lavanderia + 0,5 h limpeza + 0,5 h amenidades + 1 h check-in/out;
- horas mensais existentes mantidas;
- autogestão default passa a aproximadamente 263,25 h/ano;
- migração V29 → V30 só para o cenário-base intacto;
- simulações customizadas preservadas.

### V31 — base de ocupação bidirecional
Concluída em 25/10/2026 — Issue #48.

- ganho esperado com administradora vira variável global calibrável;
- default permanece +20 p.p.;
- usuário escolhe se informa ocupação de autogestão ou já administrada;
- tabela mostra ocupação informada e derivada lado a lado;
- armazenamento interno permanece canônico em autogestão;
- troca de base não altera a economia nem perde informação em tetos de 100%;
- ajustes de perfil da administradora são adicionais ao delta global;
- migração V30 → V31 evita duplicar o antigo +20 p.p.

### V32 — resumo final filtrável e horizonte de 3 anos
Concluída em 25/10/2026 — Issue #49.

- comparação final força Essencial e Premium como cenários separados;
- até oito cenários finais podem ser exibidos/ocultados individualmente;
- filtro final é de apresentação e não altera premissas;
- horizonte padrão passa a 3 anos;
- cards exibem total do horizonte, média anual e média mensal equivalente;
- comparação 1/3/5 respeita o mesmo filtro;
- botão no topo restaura todos os defaults após confirmação;
- suíte completa: 32/32 testes.

### V33 — destaque mensal nos cards finais
Concluída em 25/10/2026 — Issue #50.

- média mensal equivalente vira o número principal dos cards;
- total do horizonte e média anual permanecem visíveis em segundo nível;
- valores negativos preservam a sinalização visual;
- nenhuma fórmula ou regra de ranking foi alterada;
- suíte completa: 32/32 testes.

### V34 — resultado principal sensível ao valor da hora
Concluída em 25/10/2026 — Issue #51.

- cards e ranking final passam a usar resultado econômico real;
- valor da hora passa a afetar diretamente o número principal;
- excedente nominal permanece como lente financeira secundária;
- comparação 1/3/5 também prioriza o resultado econômico;
- novo teste de sensibilidade cobre R$ 0/h × R$ 200/h;
- suíte completa: 33/33 testes.

### V35 — trabalho do proprietário no detalhamento
Concluída em 25/10/2026 — Issue #52.

- detalhamento anual mostra horas × valor/h = custo econômico;
- custo é identificado como não-caixa;
- projeções 1/3/5 acumulam horas próprias;
- cards finais exibem a fórmula do trabalho do proprietário;
- investimento e demais cenários seguem a mesma regra;
- suíte completa: 34/34 testes.

### V36 — trabalho mensal no detalhamento
Concluída em 25/10/2026 — Issue #53.

- todos os cenários exibem horas trabalhadas por mês;
- todos exibem valor econômico das horas por mês;
- campos permanecem visíveis mesmo em zero;
- cards finais e comparação 1/3/5 mostram equivalentes mensais;
- suíte completa: 35/35 testes.

### V38 — simplificação do trabalho nos cards
Concluída em 25/10/2026 — Issue #54.

- removida a linha visual de total acumulado do trabalho;
- mantidas apenas horas/mês e valor das horas/mês;
- custo total permanece no motor econômico;
- corrigido overflow entre cards;
- suíte completa: 35/35 testes.

### V39 — workload Essencial × Premium
Concluída em 25/10/2026 — Issue #55.

- Essencial deixa limpeza, lavanderia e amenidades com o proprietário;
- check-in, reservas, atendimento e comercial continuam delegados;
- Premium mantém todas essas tarefas gerenciadas;
- Essencial default próprio ≈ 13,9 h/mês;
- Premium default próprio = 1,0 h/mês;
- migração restrita a presets Essencial legados não customizados;
- suíte completa: 36/36 testes.

### V40 — indicadores secundários mensais
Concluída em 25/10/2026 — Issue #56.

- indicador principal permanece como resultado econômico real mensal;
- caixa secundária 1 passa a mostrar valor real mensal total = ganho econômico real + valor do trabalho;
- caixa secundária 2 mostra horas de trabalho por mês;
- total do horizonte e média anual saem das caixas secundárias;
- a mesma fórmula vale para todos os cenários;
- suíte completa: 37/37 testes.

### V41 — wizard principal integrado
Concluída em 25/10/2026 — Issue #57.

- “Situação inicial” evolui para “Configurar simulação”;
- oito cenários finais selecionáveis;
- horizonte e valor da hora editáveis;
- ocupação self/admin, delta e sazonalidade editáveis;
- estadia, limpeza e custos principais por reserva editáveis;
- revisão mostra ocupação resultante e horas/mês de autogestão, Essencial e Premium;
- wizards especializados permanecem disponíveis;
- suíte completa: 38/38 testes.

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

### V11 — contrato do Airbnb alugado
Implementação anual concluída em 24/10/2026 na Issue #36.

Inclui:
- mobiliado × não mobiliado;
- encargos atribuídos ao locatário;
- CAPEX condicional;
- autorização de sublocação/temporada;
- resumo contratual e alertas.

A #36 permanece aberta para custos de saída e integração plurianual.

### Pré-Rodada D — cenário Airbnb em imóvel alugado
**Issue:** #36

Revisar encargos contratuais, custos fixos, CAPEX e a distinção entre imóvel mobiliado e não mobiliado antes de consolidar a matriz posse × gestão.

### Rodada D — arquitetura dos cenários Airbnb
**Delivery:** #11 · **Concluída em 24/10/2026 — V27**

Entregou:
- #12 — motor compartilhado próprio/alugado × autogestão/administradora;
- quarto modo Airbnb: alugado + administradora;
- regressão dos modos anteriores e projeções 1/3/5 anos.

### Rodada E — horizonte anual 1/3/5 anos
**Delivery:** #13

Escopo atual concluído:
- projeções anuais em 1/3/5 anos;
- inflação e valorização compostas;
- CAPEX inicial e payback;
- patrimônio nominal/real;
- média mensal equivalente apenas como apresentação.

O motor mensal real foi retirado do escopo atual e movido para a Issue #41, de horizonte distante.

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
**Epic:** #19 · **Concluída em 24/10/2026 — V22**

Suporta, em granularidade anual:
- investimento com uso pessoal ocasional;
- segunda residência;
- moradia principal com Airbnb eventual.

Issues concluídas:
- #20 — classificar disponibilidade e bloqueios;
- #21 — benefício econômico do uso pessoal;
- #22 — retorno incremental da locação eventual.

O calendário mensal continua deliberadamente fora desta Epic e permanece na Issue #41.

### Epic — wizards de onboarding e configuração
**Epic:** #23 · **Concluída em 24/10/2026 — V26**

Objetivo: descobrir primeiro **quais cenários fazem sentido** e depois orientar o preenchimento das premissas.

Issues filhas:
- #24 — wizard principal de situação inicial/cenários;
- #25 — benchmark financeiro/custo de oportunidade;
- #26 — proposta de administradora — concluída na V26;
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
