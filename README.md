# Simulador patrimonial — Airbnb × aluguel × investimento

Aplicação web estática (HTML + CSS + JavaScript, sem dependências) para comparar seis categorias-base de estratégia:

1. Airbnb em imóvel próprio, autogerido
2. Airbnb em imóvel próprio, com administradora
3. Airbnb em imóvel alugado, autogerido
4. Airbnb em imóvel alugado, com administradora
5. Aluguel tradicional
6. Investimento financeiro

Na comparação final, os modos “com administradora” são desdobrados em **Essencial** e **Premium**, resultando em até oito cenários simultâneos.

Pode ser aberta localmente ou publicada no GitHub Pages. As simulações podem ser exportadas/importadas em JSON.

## Princípios do modelo

O simulador separa deliberadamente quatro conceitos que não devem ser misturados:

- **Caixa livre:** dinheiro sustentável disponível depois de OPEX, impostos, aportes às reservas e, no investimento financeiro, da parcela que precisa permanecer aplicada para preservar o poder de compra do principal.
- **Patrimônio:** valor econômico dos ativos e do caixa, em termos nominais e reais.
- **Capital vinculado:** patrimônio que continua sendo do usuário, mas não está livre (reservas, caução/garantia etc.).
- **Capital de oportunidade:** todo capital que a estratégia exige e que, alternativamente, poderia estar aplicado financeiramente.

A inflação não é OPEX. Ela é usada para separar crescimento nominal de preservação do poder de compra.

## Benchmark financeiro equivalente

Além do cenário financeiro isolado, cada estratégia operacional possui seu próprio benchmark financeiro. O capital desse benchmark é o capital realmente comprometido pela estratégia:

- valor do imóvel, quando o imóvel é próprio;
- CAPEX de implantação;
- reservas iniciais;
- cauções/garantias, no Airbnb em imóvel alugado;
- aportes externos necessários quando o caixa livre anual fica negativo.

Assim, dinheiro usado para mobiliar o imóvel ou cobrir prejuízo operacional não desaparece da comparação de custo de oportunidade.

Na versão atual, déficits e aportes são reconhecidos em **passos anuais**. O benchmark considera o ano em que cada aporte é necessário; não existe ponderação intranual. O timing mensal real foi deliberadamente adiado para a Issue #41.


## Delegação para administradora

A operação distingue duas perguntas diferentes por atividade:

- **Admin gerencia:** a administradora executa/coordena a tarefa, então as horas correspondentes deixam de ser atribuídas ao proprietário no cenário administrado.
- **Custo incluído:** a despesa monetária já está coberta pela comissão e não é cobrada separadamente.

As tabelas de custos por reserva e custos mensais permitem informar o tempo próprio associado a cada atividade. O cenário administrado soma apenas as horas das tarefas não delegadas mais um campo de **supervisão da administradora**.

## Caixa sustentável da aplicação financeira

O rendimento líquido nominal não é tratado integralmente como renda disponível. O simulador separa:

- rendimento líquido nominal;
- parcela necessária para preservar o poder de compra do principal;
- **caixa sustentável distribuível**, que pode ser retirado sem reduzir o principal real;
- ganho patrimonial real.

Exemplo: R$ 1 milhão, inflação de 6% e rendimento líquido nominal de 12% resultam em R$ 120 mil de rendimento nominal, R$ 60 mil necessários à preservação do principal, R$ 60 mil de caixa sustentável e aproximadamente R$ 56,6 mil de ganho patrimonial real em reais do início do período.

## Tributação configurável

O imposto não é mais calculado presumindo que todo OPEX seja dedutível. Custos por reserva, custos mensais e custos percentuais têm um indicador **Dedutível IR** que altera apenas a base tributável, sem alterar o caixa operacional antes do imposto.

Os defaults são conservadores. Por padrão, taxa da plataforma, IPTU/tributos incidentes sobre o imóvel e condomínio são tratados como dedutíveis quando efetivamente suportados pelo locador; outras despesas ficam desmarcadas, salvo configuração explícita. No Airbnb em imóvel alugado, o aluguel pago ao proprietário é tratado separadamente como dedução da sublocação. A alíquota informada continua sendo uma simplificação efetiva aplicada à base tributável configurada.

## Rodada B — cenário administrado

A versão 8 torna três dimensões explícitas:

- **Performance da administradora:** impactos opcionais e independentes sobre diária (%) e ocupação (pontos percentuais). Defaults são zero; quando alterados, o cenário administrado recalcula noites, reservas, taxas cobradas do hóspede, plataforma, comissão, OPEX percentual, reservas, tributação e horas por reserva.
- **CAPEX no cenário administrado:** cada item distingue **Admin paga** de **Ativo fica com você**. Quem desembolsa e quem mantém o valor residual são decisões independentes.
- **Benchmark econômico:** cada cenário mostra separadamente **Δ financeiro vs benchmark** e **Δ econômico vs benchmark**. O segundo desconta o custo do tempo do proprietário e compara também com o tempo configurado para gerir o investimento financeiro.

JSONs anteriores são migrados automaticamente. No CAPEX legado, `adminIncluded=true` é interpretado como “admin paga / ativo não fica com o proprietário”, preservando o comportamento econômico anterior.

## Matriz Airbnb: posse × gestão

A V27 organiza o Airbnb em duas dimensões independentes:

- **posse:** imóvel próprio ou alugado;
- **gestão:** autogestão ou administradora.

Isso produz quatro modos: próprio + autogestão, próprio + administradora, alugado + autogestão e alugado + administradora.

Nos dois modos alugados, o contrato possui campos próprios para:

- aluguel mensal pago ao proprietário;
- caução/garantia reembolsável;
- custos iniciais não recuperáveis do contrato;
- custos anuais do contrato/garantia;
- horas de trabalho do usuário.

A tabela de custos mensais, percentuais e CAPEX permite separar o que pertence ao regime de posse alugado do que muda com a gestão. O valor do imóvel não entra no patrimônio nem no custo de oportunidade de nenhum dos dois modos alugados. Comissão, performance, tarefas gerenciadas, custos incluídos e regras de CAPEX da administradora são aplicados sobre o mesmo contrato alugado quando a gestão é terceirizada.

## CAPEX e valor residual

Cada item de implantação possui valor inicial e percentual residual estimado ao fim do primeiro ano. Comprar um ativo reduz caixa, mas não destrói imediatamente todo o patrimônio. A depreciação econômica é a diferença entre valor inicial e valor residual.

## Reservas vinculadas

Aporte a fundo de reposição não é OPEX. Ele reduz caixa livre e aumenta capital vinculado. O desgaste econômico dos bens é capturado pela depreciação, evitando dupla contagem. Se a administradora assumir as reposições futuras, apenas os **novos aportes** do proprietário podem zerar; qualquer saldo inicial já existente continua sendo patrimônio do investidor.

## Calibração dos defaults — outubro de 2026

A simulação inicial da versão 7 deixa de reproduzir os números históricos da planilha e passa a usar um **cenário-base de mercado para o Rio de Janeiro**, pensado para um apartamento de investimento disponível o ano todo. Esses números são um ponto de partida auditável, não uma recomendação universal para qualquer endereço.

Principais referências usadas:

- **Airbnb:** taxa do anfitrião de 16% para anúncios no Brasil, após a migração para a estrutura de taxa única em 2026. Fonte: [Airbnb Resource Center](https://www.airbnb.com/resources/hosting-homes/a/how-much-does-airbnb-charge-hosts-288).
- **Mercado de temporada do Rio:** sazonalidade-base de 51% de ocupação / R$649 na alta (dez–mar), 46% / R$602 na intermediária (jul–ago) e 46% / R$582 na baixa (abr–jun e set–nov), com estadia média de aproximadamente 5,6 noites. Fonte: [AirROI — Rio de Janeiro 2026](https://www.airroi.com/airbnb-data/brazil/rio-de-janeiro/rio-de-janeiro).
- **Custos operacionais Airbnb:** a calibração usa a mesma referência de mercado para aproximar limpeza/lavanderia, utilities, amenities e manutenção. O fundo de reposição continua separado de manutenção para preservar a lógica contábil do simulador.
- **Inflação:** default prospectivo de 4,3%, alinhado à expectativa de mercado para 2027 divulgada pelo Banco Central no segundo semestre de 2026. Fonte: [Banco Central — Relatório de Política Monetária, set/2026](https://www.bcb.gov.br/publicacoes/rpm/202609).
- **Investimento financeiro:** default nominal de 13,65% a.a., equivalente ao CDI corrente em 22/10/2026, com IR ilustrativo de 17,5% para um horizonte em torno de um ano. A taxa deve ser revisada quando o cenário for usado em outra data.
- **Aluguel tradicional:** R$3.500/mês para um imóvel-base de R$636 mil, aproximadamente coerente com o rental yield residencial do Rio em 2026; taxa de administração padrão alterada para 10%, no centro da faixa pública de 8%–12%.
- **Administração Airbnb:** 25% permanece como default de gestão completa. Referências públicas no Rio exibem planos de 20% a 30%, inclusive uma oferta de 25% com gestão de limpeza, lavanderia, manutenção e entrada/saída. Custos de terceiros continuam separados quando a gestora apenas coordena o serviço.

Alguns parâmetros permanecem necessariamente **ilustrativos**, especialmente imposto efetivo do proprietário, condomínio, IPTU, valor/hora do investidor e CAPEX. A versão 7 usa 15% como alíquota efetiva de exemplo tanto para Airbnb quanto para aluguel tradicional apenas para eliminar a assimetria antiga; o usuário deve substituir esse número pela sua situação tributária.

A V26 substituiu o proxy genérico por presets provisórios Essencial/Premium autorizados pelo usuário. Eles permanecem explicitamente marcados como provisórios até a resposta formal da administradora e serão revisados pela Issue #44.

## Organização do desenvolvimento

A execução do roadmap é gerenciada em **GitHub Issues**. O arquivo `roadmap.md` funciona como mapa conceitual, registra dependências e aponta para as rodadas/epics ativos.

Convenções principais:

- `type:delivery` — issue que agrupa uma rodada;
- `type:epic` — capacidade ampla com várias issues;
- `round:B/C/D/E` — janela de entrega;
- `priority:P1/P2/P3` — prioridade;
- `area:*` — área funcional.

Commits devem mencionar a Issue relacionada e usar `Closes #N` quando concluírem integralmente uma tarefa.

## Estrutura dos arquivos

- `index.html` — interface
- `styles.css` — estilos
- `app.js` — estado, cálculos, persistência e renderização
- `example-simulation.json` — simulação de exemplo compatível com a versão atual

## GitHub Pages

Publique os arquivos na raiz de um repositório e habilite **Settings → Pages → Deploy from a branch**. Não há build nem backend.

## V25 — aquisição a partir de capital disponível

A posição inicial **“tenho capital e penso em comprar”** passou a alterar efetivamente o motor econômico.

Regra atual:

- o patrimônio inicial é o **capital disponível informado**;
- o cenário de compra e o benchmark financeiro partem exatamente desse mesmo montante;
- preço de compra + custos de aquisição + CAPEX + reservas iniciais + capital de giro precisam caber integralmente no capital disponível;
- custos de aquisição são consumidos uma única vez e não viram patrimônio;
- CAPEX mantém sua lógica própria de residual/depreciação;
- capital de giro e reservas continuam sendo patrimônio vinculado;
- o capital que sobra após a entrada permanece aplicado financeiramente e integra o patrimônio do cenário;
- o benchmark sem compra investe o capital inicial integral, sem aplicar custos de venda de um imóvel que ainda não existe;
- quando o usuário já possui o imóvel, permanece a regra anterior: vender implica corretagem e demais custos de liquidação, e apenas o capital líquido é investido.

Nesta versão, **não existe financiamento nem aporte adicional para completar uma compra que exceda o capital disponível**. O wizard rejeita essa configuração. Essa expansão foi separada para o backlog, para não introduzir dívida, juros e aportes assimétricos sem modelagem explícita.

Os horizontes continuam anuais (1/3/5 anos), e o comportamento default de quem já possui o imóvel permanece numericamente idêntico à V24.

## V26 — presets provisórios da administradora

O wizard **Administradora** traduz os planos **Essencial (15%)** e **Premium (25%)** para as mesmas premissas detalhadas usadas pelo motor.

Premissas provisórias autorizadas em 24/10/2026:

- a taxa do Airbnb é alocada entre proprietário e administradora conforme a parcela econômica de cada um;
- **Essencial:** taxa de limpeza permanece na receita compartilhada e entra na base dos 15%;
- **Premium:** taxa de limpeza é repassada integralmente à administradora e fica fora da base dos 25%;
- o aumento informado de ocupação é interpretado provisoriamente como **+20% relativo**, não +20 pontos percentuais;
- não há uplift de diária/ADR sem evidência adicional;
- no Premium, o enxoval pago pela administradora não integra o patrimônio do proprietário;
- no Premium, a administradora gerencia pequenos reparos/eletrodomésticos, mas o proprietário continua pagando esses reparos;
- “Admin gerencia” e “Custo incluído” permanecem dimensões independentes e editáveis.

Essas premissas não são aplicadas silenciosamente ao cenário-base. Elas só alteram a simulação quando o usuário usa o wizard. A revisão formal está registrada na Issue #44; a espera pela resposta real continua em #32.

A comparação simultânea **Essencial × Premium** foi separada na Issue #45 e concluída na V29, com configurações independentes e editáveis por plano.

A migração V25 → V26 preserva os resultados default; a suíte passou **26/26 testes**.

## V27 — matriz posse × gestão do Airbnb

A Rodada D refatorou os cenários Airbnb para um motor-base compartilhado em duas dimensões:

| Posse | Gestão | Cenário |
| --- | --- | --- |
| próprio | autogestão | Airbnb próprio + autogestão |
| próprio | administradora | Airbnb próprio + administradora |
| alugado | autogestão | Airbnb alugado + autogestão |
| alugado | administradora | Airbnb alugado + administradora |

A dimensão **posse** determina valor do imóvel, aluguel, caução, encargos contratuais, CAPEX alugado e patrimônio imobiliário. A dimensão **gestão** determina comissão, performance, taxa de limpeza, alocação da taxa Airbnb, tarefas delegadas, custos incluídos, onboarding e titularidade/pagamento de CAPEX.

O novo modo **alugado + administradora**:
- não incorpora o valor do imóvel ao capital;
- preserva aluguel, caução e encargos do contrato alugado;
- aplica as mesmas regras da administradora usadas no imóvel próprio;
- combina CAPEX alugado com as flags de quem paga e de quem mantém o ativo;
- possui benchmark financeiro próprio sobre o capital efetivamente comprometido;
- funciona nos horizontes anuais de 1/3/5 anos.

A refatoração preservou numericamente os cinco cenários que já existiam na V26. A suíte completa passou **27/27 testes**.

A V27 ainda usava um único conjunto ativo de premissas da administradora para os dois modos administrados. Essa limitação foi removida na V29.

## V28 — calibração oficial da administradora

As respostas formais recebidas em 24/10/2026 substituem os presets provisórios da V26.

Regras incorporadas:

- **ordem financeira:** a taxa Airbnb é descontada do valor total e a divisão 15%/25% ocorre depois; o motor agora exibe essa decomposição explicitamente, sem mudar o resultado líquido equivalente;
- **taxa de limpeza:** entra no valor pago pelo hóspede e na divisão em **ambos** os planos; não é repassada 100% à administradora no Premium;
- **Essencial:** 15%;
- **Premium:** 25%;
- **enxoval:** pertence a quem compra; quando a administradora compra no preset Premium, o ativo não integra o patrimônio do proprietário;
- **manutenção de imóvel/equipamentos/bens:** responsabilidade financeira do proprietário; o preset não presume que reparos estejam incluídos nem que a administradora gerencie esses reparos;
- **enxoval e amenidades:** a administradora declarou que repõe/troca esses itens; isso confirma responsabilidade operacional, mas o simulador não presume custo de amenidades incluído sem preço/contrato explícito;
- **ocupação:** a administradora declarou que um Superhost costuma operar acima de 80%, contra abaixo de 60% sem apoio. Desde a V31, a diferença esperada da gestão é uma **variável calibrável em pontos percentuais** (default +20 p.p.), e a ocupação pode ser informada tanto pela lente de autogestão quanto pela lente administrada;
- **diária/ADR:** uplift default permanece 0%, coerente com a resposta de que o ganho seria pequeno/insignificante.

A diferença de ocupação é usada apenas como **default operacional informado pelo parceiro**, totalmente editável no wizard. Foi decidido não exigir validação histórica adicional para esse uso; a Issue #46 foi encerrada como não planejada.

O contrato enviado pela administradora foi classificado como **contrato de hospedagem direta com hóspede**, usado fora do Airbnb, e não como contrato proprietário × administradora. Por conter dados pessoais de terceiros, o PDF não foi adicionado ao repositório público; apenas notas sem PII foram registradas.

O cenário-base continua economicamente neutro até o usuário aplicar o wizard. A migração V27 → V28 não altera silenciosamente os resultados existentes. A suíte completa V28 passou **28/28 testes**.


## V29 — comparação simultânea Essencial × Premium

A Issue #45 foi concluída com perfis independentes de gestão.

Depois que o wizard **Administradora** é aplicado, a comparação passa a mostrar simultaneamente:
- Airbnb próprio + Admin Essencial;
- Airbnb próprio + Admin Premium;
- Airbnb alugado + Admin Essencial;
- Airbnb alugado + Admin Premium.

Regras de compatibilidade e edição:
- o cenário-base continua com seis estratégias enquanto nenhuma proposta de administradora tiver sido aplicada, preservando o comportamento V28 e evitando aplicar silenciosamente a hipótese comercial de 80%;
- Premium mantém os IDs históricos `airbnb-admin` e `airbnb-rented-admin`;
- Essencial usa `airbnb-admin-essential` e `airbnb-rented-admin-essential`;
- cada plano guarda sua própria comissão, performance, tarefas gerenciadas, custos incluídos, supervisão e regras de CAPEX;
- o plano ativo continua refletindo alterações feitas nos campos detalhados; ao trocar de plano no wizard, sua configuração é capturada antes da mudança;
- os horizontes anuais de 1/3/5 anos projetam cada perfil separadamente;
- o filtro do wizard principal continua trabalhando com a categoria “com administradora” e a expande para Essencial + Premium quando a comparação está ativa.

A implementação não transforma o número de planos em regra do motor econômico: a separação fica concentrada na camada de perfis de gestão e reutiliza o mesmo motor posse × gestão da V27.

Suíte completa: **29/29 testes**.


## V30 — recalibração de ocupação e trabalho manual

A Issue #47 revisa os defaults do cenário-base sem transformar a autogestão em uma operação altamente automatizada.

**Ocupação autogerida:** Réveillon 100%, verão 75%, Carnaval 100%, outono 55%, inverno 50% e primavera 55%, resultando em aproximadamente **59,55% de ocupação anual ponderada**.

**Gestão profissional:** o preset Essencial/Premium adiciona **20 pontos percentuais** à ocupação de cada período, limitado a 100%. Com a sazonalidade default, a ocupação ponderada administrada fica em aproximadamente **78,95%**. O uplift default de ADR permanece 0%.

**Trabalho por reserva — autogestão manual:**
- lavanderia: **2 h/reserva**;
- limpeza: **0,5 h/reserva**;
- amenidades/consumíveis: **0,5 h/reserva**;
- check-in/out presencial: **1 h/reserva**.

As horas mensais existentes foram mantidas nesta rodada. Com estadia média de 5,6 noites e a ocupação V30, a autogestão default estima cerca de **263,25 h/ano**, ou **21,94 h/mês**. A administradora continua retirando as horas das tarefas delegadas e mantendo apenas a supervisão residual configurada.

A recalibração é aplicada automaticamente apenas ao antigo cenário-base V29 intacto. Simulações customizadas preservam seus valores.

## V31 — ocupação bidirecional e delta de gestão calibrável

A Issue #48 separa a **ocupação informada pelo usuário** do **ganho esperado da gestão profissional**.

Na tabela sazonal, o usuário escolhe se os percentuais digitados representam **autogestão / sem administradora** ou **operação com administradora**. O ganho esperado com administradora é uma variável global calibrável, com default **+20 p.p.**.

O simulador mantém internamente a autogestão como base canônica e deriva a outra lente automaticamente. Quando a entrada é autogestão, soma o delta com teto de 100%; quando a entrada é administrada, converte o valor digitado para autogestão removendo o delta, com piso de 0%.

Trocar a base de preenchimento não altera os resultados econômicos: muda apenas a forma de exibir e editar os mesmos valores. A tabela mostra simultaneamente a ocupação informada e a derivada. Ajustes específicos dos perfis Essencial/Premium continuam disponíveis como ajustes adicionais ao delta global e começam em zero.

## V32 — resumo final filtrável em 3 anos

A Issue #49 reorganiza a seção final para funcionar como a principal tela de decisão:

- **3 anos** passam a ser o horizonte padrão;
- os cards finais usam a projeção plurianual, e não apenas o resultado do primeiro ano;
- o indicador principal mostra **total do horizonte**, **média anual** (total ÷ anos) e **média mensal equivalente** (total ÷ meses);
- Essencial e Premium são sempre disponibilizados separadamente na comparação final, mesmo antes de abrir o wizard da administradora;
- os oito cenários podem ser exibidos ou ocultados individualmente por um seletor acima dos cards;
- esse filtro altera apenas a apresentação final, não as premissas econômicas;
- a tabela 1/3/5 anos respeita o mesmo conjunto de cenários selecionados;
- o topo da aplicação ganhou **Restaurar defaults**, que recompõe toda a simulação a partir da configuração padrão atual após confirmação.

A comparação final força internamente a expansão Essencial/Premium, mas o motor detalhado anterior continua preservando sua arquitetura e seus filtros próprios.

## V33 — mensal como destaque principal

Na comparação final, a **média mensal equivalente** passa a ser o valor principal em fonte grande de cada cenário. O **total do horizonte** e a **média anual** continuam imediatamente abaixo como valores secundários.

A mudança é apenas de hierarquia visual: ranking, projeções e fórmulas permanecem inalterados. A média mensal continua sendo o total do horizonte dividido pelo número de meses, não um fluxo mensal real.

## V34 — resultado principal sensível ao valor da hora

A Issue #51 corrige uma inconsistência da comparação final: o valor econômico da hora já afetava o custo do trabalho e o resultado econômico, mas o número principal dos cards e o ranking ainda usavam o excedente financeiro nominal, que não desconta o trabalho próprio.

Desde a V34:
- o número principal mensal e o ranking usam **resultado econômico real**;
- alterar o valor da hora afeta imediatamente os cenários com trabalho próprio;
- o excedente nominal sobre preservação continua visível como **lente financeira secundária**;
- a tabela 1/3/5 também destaca o resultado econômico real e mostra o ganho patrimonial/caixa separadamente.

Isso mantém explícita a distinção entre resultado financeiro e custo econômico do tempo.

## Limitações atuais

- O motor ativo é **anual**, com horizontes de 1, 3 e 5 anos (default: 3); valores mensais são apenas médias mensais equivalentes.
- Não existe calendário mensal, sazonalidade por mês nem timing intranual de aportes; essa evolução está na Issue #41.
- A estratégia de saída/liquidação ao fim do horizonte ainda não é calculada; por default, assume-se continuidade/renovação (#40).
- Os wizards de situação inicial, benchmark financeiro, aquisição/venda, administradora, operação e uso híbrido já estão disponíveis. O ganho esperado de ocupação com administradora é global e editável (default +20 p.p.); ajustes específicos de Essencial/Premium são adicionais e começam neutros.
- Tributação continua sendo uma aproximação anual: a alíquota efetiva é informada pelo usuário e a aplicação não substitui Carnê-Leão, declaração ou orientação tributária individual.

## Testes de regressão

As Rodadas A e B0 incluem testes sem dependências externas para as correções críticas e para a calibração/apresentação:

```bash
node tests/round-a.test.js
node tests/round-b0.test.js
node tests/round-b.test.js
```

Os testes cobrem delegação de horas, separação entre gestão e custo incluído, caixa sustentável da aplicação, preservação do saldo inicial das reservas e base tributável configurável, incluindo sublocação.

## Rodada C — métricas e interpretação

A versão 9 consolida quatro melhorias:

- **Tributação:** novas simulações consideram por padrão a taxa da plataforma, a comissão da administradora e a administração do aluguel tradicional como deduções/exclusões configuráveis da base tributável. OPEX e dedutibilidade continuam independentes.
- **Métricas Airbnb:** separa diária média das noites vendidas, ADR total, RevPAR de diárias e RevPAR total. Taxas cobradas do hóspede afetam as métricas totais, mas não a diária média pura.
- **Capital de giro manual:** configurável por estratégia, tratado como patrimônio vinculado e capital de oportunidade, nunca como OPEX.
- **Equivalente mensal:** o resumo final mantém o resultado anual como principal e mostra sua média mensal equivalente para facilitar comparação com rendas mensais.

Arquivos antigos preservam as flags fiscais que já continham; os novos defaults só valem para novas simulações.

### Testes

```bash
node tests/round-a.test.js
node tests/round-b0.test.js
node tests/round-b.test.js
node tests/round-c.test.js
```


## V10 — recalibração dos defaults

O cenário-base passa a incorporar trabalho próprio e uma sazonalidade híbrida:

- valor econômico da hora: **R$ 100**;
- horas distribuídas por tarefa e por reserva, em vez de um único número opaco;
- ocupação autogerida recalibrada na V30: Réveillon 100%, verão 75%, Carnaval 100%, outono 55%, inverno 50% e primavera 55% (59,55% ponderados no ano);
- diárias calibradas a partir da proposta comercial recebida: R$ 750 em Réveillon/Carnaval, R$ 400 no verão e R$ 250 nos demais períodos;
- tabela consolidada separa horas, custo econômico das horas e resultado econômico após trabalho.

O custo das horas **não é OPEX e não reduz o caixa**. Ele serve para comparar economicamente estratégias que consomem quantidades diferentes de trabalho do proprietário.

A migração V9 → V10 só recalibra automaticamente o antigo cenário-base intacto (sazonalidade B0 e trabalho todo zerado). Simulações customizadas preservam suas próprias premissas.


## V11 — Airbnb em imóvel alugado

A primeira etapa da Issue #36 torna o cenário de arbitragem contratualmente mais explícito:

- seletor **mobiliado × não mobiliado**;
- sinalização de **autorização contratual para sublocação/locação por temporada**;
- custos mensais compartilhados passam a representar explicitamente o que o locatário paga;
- condomínio ordinário entra no cenário alugado por default; IPTU continua fora por default;
- seguro do imóvel/incêndio fica separado de seguro-fiança/garantia locatícia;
- custos percentuais podem ser ligados/desligados especificamente no Airbnb alugado;
- itens de CAPEX podem ser marcados como **“só se não mobiliado”**;
- resumo do contrato mostra aluguel, encargos, CAPEX, entrada e caução.

A ausência de autorização contratual gera alerta, mas não impede a simulação financeira. Custos de saída, reajustes e horizonte contratual continuam para a modelagem plurianual (#35).


## V12 — utilities do cenário-base

Os defaults mensais do apartamento-base no Rio foram recalibrados para uma operação de temporada em um quarto e sala com dois aparelhos de ar-condicionado:

- **Água + esgoto: R$ 200/mês.** A Águas do Rio usa conta mínima residencial associada a 15 m³; nas áreas centrais/Zona Sul da Região 1 a tarifa vigente desde dezembro/2025 coloca água + esgoto próximos de R$ 195 na primeira faixa. A cobrança de esgoto é equivalente à de água.
- **Gás: R$ 100/mês.** Pela tabela residencial da Naturgy vigente desde 01/06/2026, a conta mínima de 7 m³ é R$ 51,07 e consumos de 10–12 m³/mês ficam aproximadamente na faixa de R$ 79–97.
- **Energia elétrica: R$ 400/mês.** A Light publica tarifa residencial acima de R$ 1/kWh com tributos, além de bandeira e COSIP. O default assume uso de temporada com dois splits, acima do perfil residencial médio, sem tentar modelar equipamento/hora de uso individualmente.

Referências:
- Águas do Rio — Legislação e Tarifas: https://www.aguasdorio.com.br/legislacao-e-tarifas/
- Regulamento de saneamento / cobrança de esgoto: https://aguasdorio.com.br/wp-content/uploads/2025/10/RegulamentoServicosSaneamento.pdf
- Naturgy — tarifas RJ: https://www.naturgy.com.br/atendimento/tarifas/tarifa_rio_de_janeiro/
- Light — tarifas de baixa tensão: https://www.light.com.br/Documentos%20Compartilhados/Entenda-Conta-Casa-Arquivos-Relacionados/Tarifas%20Baixa%20Tens%C3%A3o.pdf
- Inmetro — condicionadores de ar: https://www.gov.br/inmetro/pt-br/assuntos/regulamentacao/avaliacao-da-conformidade/programa-brasileiro-de-etiquetagem/tabelas-de-eficiencia-energetica/condicionadores-de-ar

A migração V11 → V12 só altera automaticamente o antigo cenário-base quando água, luz e gás ainda conservam exatamente os defaults anteriores.


## V13 — IPTU e TCL do imóvel-base

O cenário-base passa a refletir o imóvel específico usado na calibração:

- **Rua Maestro Francisco Braga, 76, apto 405, Copacabana**
- inscrição imobiliária **0916633-1**
- IPTU: **R$ 0**, em razão da isenção/cobrança suspensa registrada no carnê;
- TCL — Taxa de Coleta Domiciliar de Lixo: **R$ 625/ano** em 2026, equivalente a R$ 52,0833/mês no motor.

O carnê municipal de 2026 registra 10 cotas de R$ 62,50 e cota única de R$ 581,25 com 7% de desconto. A Prefeitura identifica a TCL como taxa anual de coleta, recolhimento, transporte e destinação de resíduos, lançada junto com o IPTU.

A TCL fica separada do IPTU no modelo e não é atribuída por default ao locatário do cenário de Airbnb alugado.


## V14 — venda do imóvel e benchmark líquido

Quando a posição inicial é **já possui o imóvel**, o cenário de investimento financeiro passa a representar a decisão econômica completa: **vender o imóvel e investir o capital líquido realizável**.

A conversão usa:

```
valor esperado de venda
- corretagem
- custos/documentação
- saldo de financiamento a quitar
- IR estimado sobre ganho de capital
- outros custos de liquidação
= capital líquido investível
```

O modelo mantém duas bases separadas:
- **patrimônio inicial:** valor/equity existente antes da venda;
- **capital investível:** valor líquido que sobra após a alienação.

Isso faz a corretagem e demais custos aparecerem como perda patrimonial real da decisão de vender, em vez de simplesmente desaparecerem da base de comparação.

### Default
- ajuste do preço de venda: 0%;
- corretagem: **5%**;
- demais custos: R$ 0 até serem informados.

A corretagem é editável. O CRECI-RJ informa que a remuneração é de livre negociação; a referência de 5% foi escolhida por ser praticada em operações da Loft no Rio de Janeiro.

### Limitação atual
Se houver saldo de financiamento, ele é quitado na conversão para caixa. Os cenários que mantêm o imóvel ainda não modelam juros e amortização da dívida; o aplicativo gera um alerta para essa assimetria.


## V15 — CAPEX específico do Airbnb alugado

O cenário de imóvel alugado passa a ter valores de montagem próprios, separados do CAPEX do imóvel que o usuário já possui.

Default para um 1 quarto e sala **não mobiliado**:
- adequação / frete / montagem: R$ 2.500;
- mobiliário: R$ 6.000;
- eletrodomésticos, dois splits e instalações: R$ 12.500;
- enxoval: R$ 1.800;
- utensílios/equipamentos: R$ 1.500;
- fechadura/acesso: R$ 600;
- decoração: R$ 1.500;
- fotografia: R$ 700.

Total: **R$ 27.100**.

Se o imóvel vier **mobiliado**, mobiliário, eletrodomésticos e decoração são retirados automaticamente; permanecem R$ 7.100 em adequação/complementação operacional por default.

Referências de varejo consultadas em outubro/2026 incluem Magazine Luiza para cama box, sofá-cama/retrátil, geladeira ~300 L, TV 43", lavadora 11 kg, cooktop, split 12 mil BTU, mesa com 4 cadeiras e guarda-roupa. Os valores são premissas centrais editáveis, não orçamento fechado de compra.


## V16 — perfil e ranking de comparáveis

A Issue #17 adiciona uma camada de mercado ainda **sem alterar as premissas da simulação**:

- perfil estruturado do imóvel-alvo;
- entrada manual/auditável de comparáveis;
- filtros duros de elegibilidade;
- score de similaridade explicável;
- ranking;
- P25, mediana e P75 de diária anunciada;
- estatística de ocupação apenas quando a evidência é marcada como observada ou estimada por fonte adequada.

O imóvel-base começa identificado como apartamento inteiro de 1 quarto, 33 m², em Copacabana, com dois aparelhos de ar-condicionado. Campos ainda não confirmados permanecem desconhecidos/zero e não entram no score.

A metodologia está em `docs/market-methodology.md`.


## V17 — horizontes 1/3/5 anos

A primeira camada plurianual da Issue #35 adiciona:

- horizonte principal selecionável em 1, 3 ou 5 anos (default: 3);
- comparação 1 × 3 × 5 sempre visível no resumo;
- CAPEX inicial aplicado apenas no início;
- custo de venda do imóvel aplicado apenas na conversão para investimento;
- inflação composta;
- valorização imobiliária composta;
- receitas, aluguel e custos monetários recorrentes corrigidos pela inflação;
- caixa acumulado;
- aportes externos acumulados para déficits;
- reservas acumuladas;
- valor residual do CAPEX ao longo do horizonte;
- ganho patrimonial real;
- Δ contra benchmark financeiro;
- payback de caixa do CAPEX quando ocorre.

### Granularidade

A V17 usa passos **anuais**. Isso já resolve a distorção principal de diluir custos iniciais em horizontes maiores sem simplesmente dividir CAPEX por N.

O timing intramês, o capital de giro por pico mensal e o custo de oportunidade pelo mês efetivo não fazem parte do motor ativo; foram adiados para a Issue #41.


## V18 — timing mensal dos aportes (histórico; aposentada)

A V18 chegou a introduzir uma aproximação mensal para o timing de aportes e capital de giro. Essa implementação foi **retirada do motor ativo na V21** por decisão de produto.

O comportamento vigente é anual: déficits e aportes são reconhecidos por ano, e qualquer valor apresentado por mês é apenas **média mensal equivalente**. O calendário mensal real permanece como evolução futura na Issue #41.


## V19 — aplicar sugestões do mercado

A Issue #18 conecta o conjunto de comparáveis à sazonalidade sem sobrescrever premissas silenciosamente.

O módulo calcula:
- P25, mediana e P75 de diária anunciada;
- P25, mediana e P75 de ocupação apenas quando a fonte sustenta booked/available;
- confiança baixa/média/alta conforme tamanho e qualidade da amostra.

Para preservar o formato sazonal já configurado:
- a diária de cada período recebe um **fator multiplicativo comum** para levar a média ponderada ao alvo de mercado;
- a ocupação de cada período recebe um **Δ comum em pontos percentuais** para levar a ocupação média ao alvo;
- limites 0–100% continuam valendo.

Há três ações explícitas: aplicar cenário pessimista, base ou otimista. Sem clique do usuário, nada muda na simulação.


## V20 — política de fim do horizonte

O Airbnb em imóvel alugado passa a declarar explicitamente o que acontece ao fim do horizonte:

- **default calculado: renovar / continuar**;
- **alternativa visível, ainda não calculada: encerrar a operação**.

A opção de encerramento permanece desabilitada até a implementação da Issue #40, que tratará distrato, custos de saída, recuperação de caução e realização/reutilização de ativos. A mesma Issue foi desenhada para futuramente permitir estratégias de saída coerentes nos demais cenários.

Enquanto isso, as projeções de 1, 3 e 5 anos assumem continuidade operacional.


## V21 — motor anual e média mensal equivalente

Por decisão de produto, o simulador trabalha exclusivamente em **passos anuais** neste estágio.

### Regra atual

- simulações-base são anuais;
- horizontes de 1/3/5 anos são compostos por anos completos;
- receitas, custos, inflação e valorização evoluem ano a ano;
- déficits futuros são reconhecidos por ano, não por mês;
- CAPEX e venda continuam eventos únicos;
- valores mensais são apenas **médias mensais equivalentes**.

Para 1 ano:

```
média mensal equivalente = valor anual / 12
```

Para 3/5 anos:

```
média mensal equivalente = valor acumulado / (anos × 12)
```

A média mensal equivalente é usada apenas para métricas de fluxo. Ganho patrimonial, patrimônio final e retornos compostos permanecem métricas do horizonte.

### V18 aposentada do motor ativo

A aproximação de timing mensal de aportes introduzida na V18 foi retirada. A lógica mensal real — incluindo calendário sazonal, aportes por mês, picos de caixa e reajustes em datas específicas — foi movida para a Issue #41, de prioridade futura.

## V22 — uso parcial e disponibilidade híbrida

A Epic #19 foi implementada mantendo a granularidade **anual** do motor.

- cada período sazonal distingue **uso pessoal**, **moradia habitual** e **indisponibilidade operacional**;
- uso pessoal e moradia deixam de ser tratados como vacância;
- JSONs anteriores que possuíam apenas `unavailableDays` migram esse valor para indisponibilidade operacional;
- a análise incremental do Airbnb eventual exclui por padrão custos fixos que existiriam sem Airbnb;
- custos mensais podem ser marcados individualmente como **incrementais no uso híbrido**;
- preparação, armazenamento e outros custos incrementais anuais podem ser informados separadamente;
- hospedagem evitada e benefício imputado de moradia aparecem como **benefício de consumo**, nunca como receita;
- CAPEX adicional do Airbnb eventual mantém desembolso, residual e depreciação separados;
- a saída mostra separadamente **caixa incremental do Airbnb**, **benefício de consumo**, **patrimônio incremental vinculado** e **resultado econômico incremental**.

Todos os novos defaults são zero/falso, portanto a V22 não altera os resultados do cenário-base até que o usuário configure uso híbrido.

### Teste específico

```bash
node tests/hybrid-use-v22.test.js
```


## V23 — snapshot auditável de mercado do imóvel-base

O módulo de comparáveis passa a nascer preenchido no cenário-base com evidência pública coletada em setembro/outubro de 2026.

- 19 comparáveis locais passam pelos filtros duros atuais;
- 14 possuem diária pública verificável;
- a amostra de preço continua marcada como **insuficiente** frente ao mínimo operacional de 15;
- P25/mediana/P75 do snapshot atual: **R$ 278,38 / R$ 348,50 / R$ 519,25**;
- nenhuma ocupação é inferida de calendário público;
- cada linha preserva URL, data de coleta/referência e nota de evidência;
- a interface distingue comparáveis elegíveis de comparáveis com diária;
- o Residencial Peixoto passa a registrar elevador como característica conhecida;
- nenhum valor de mercado é aplicado automaticamente à sazonalidade.

A evidência detalhada está em `docs/base-property-market-evidence-2026-10.md`.

### Teste específico

```bash
node tests/market-evidence-v23.test.js
```


## V24 — configuração guiada e auditoria

A camada de onboarding guiado foi adicionada sem criar um segundo motor econômico. Todos os wizards partem das premissas atuais, mostram uma revisão e só então aplicam alterações aos mesmos campos detalhados já existentes.

### #24 — situação inicial (parcial)

- já possui imóvel, moradia principal, segunda residência e Airbnb em imóvel alugado filtram apenas os cenários exibidos;
- premissas dos cenários ocultos continuam salvas e o motor detalhado não é apagado;
- no Airbnb alugado, o benchmark financeiro permanece embutido no próprio cenário; o investimento standalone baseado na venda do imóvel não é exibido;
- o caminho **“tenho capital e penso em comprar”** foi completado na V25: compra e benchmark partem do mesmo capital inicial; a compra precisa caber integralmente nesse capital.

### #25 — benchmark financeiro

- pergunta tipo de aplicação, forma da taxa, IR, custos, prazo, liquidez e papel na análise;
- prazo, liquidez, tipo e papel ficam como metadados auditáveis, sem penalidades implícitas;
- taxas nominais líquidas são convertidas para a taxa bruta equivalente antes da aplicação, evitando dupla cobrança de IR/custos.

### #27 — operação Airbnb

- estadia média e taxa de limpeza;
- check-in/out, limpeza e lavanderia por reserva;
- atendimento, suporte local, marketing, PMS/software e pricing;
- água, energia, gás e internet;
- não altera horas próprias, dedutibilidade fiscal nem responsabilidades contratuais.

### #28 — aquisição e venda (parcial)

- o caminho “já possuo o imóvel” cobre valor de mercado, CAPEX, capital de giro e todas as premissas de venda líquida da #34;
- o caminho “tenho capital e penso em comprar” já coleta capital disponível e custos de aquisição, mas esses dois itens permanecem explicitamente fora do cálculo até a modelagem econômica da **#42**;
- o wizard não mascara essa lacuna nem aplica custos de compra silenciosamente.

### #29 — uso parcial / híbrido

- classifica dias de uso pessoal, moradia e indisponibilidade operacional por período anual;
- impede que a soma ultrapasse a duração de cada período;
- configura benefício de hospedagem evitada, moradia, custos incrementais e CAPEX adicional;
- preserva a separação entre receita, benefício de consumo e patrimônio.

### Auditoria V24

- os resultados default permanecem numericamente idênticos à V23, inclusive em 1/3/5 anos;
- não há artefatos ativos do motor mensal aposentado;
- diagnósticos e “melhores cenários” respeitam o filtro do wizard principal;
- identidades de caixa, CAPEX, reservas, capital de giro, déficit/aportes, venda e benchmark são verificadas por teste permanente;
- a suíte atual contém **24 testes** e passou integralmente na revisão da V24.

Testes adicionados nesta versão:

```bash
node tests/main-wizard-v24.test.js
node tests/financial-wizard-v24.test.js
node tests/property-wizard-v24.test.js
node tests/airbnb-ops-wizard-v24.test.js
node tests/hybrid-wizard-v24.test.js
node tests/economic-invariants-v24.test.js
```

A auditoria detalhada está em `docs/audit-v24.md`.
