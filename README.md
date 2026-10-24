# Simulador patrimonial — Airbnb × aluguel × investimento

Aplicação web estática (HTML + CSS + JavaScript, sem dependências) para comparar cinco estratégias:

1. Airbnb em imóvel próprio, autogerido
2. Airbnb em imóvel próprio, com administradora
3. Airbnb em imóvel alugado (arbitragem de locação)
4. Aluguel tradicional
5. Investimento financeiro

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

Na versão atual, o aporte negativo anual é tratado como se estivesse disponível para investimento durante o período inteiro. Quando a simulação plurianual/mensal for implementada, o benchmark poderá respeitar o momento exato de cada aporte.


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

## Airbnb em imóvel alugado

O cenário usa a mesma receita, sazonalidade, custos por reserva, OPEX percentual e reservas do Airbnb autogerido. Possui campos próprios para:

- aluguel mensal pago ao proprietário;
- caução/garantia reembolsável;
- custos iniciais não recuperáveis do contrato;
- custos anuais do contrato/garantia;
- horas de trabalho do usuário.

A tabela de custos mensais e a tabela de CAPEX possuem uma coluna específica **Airbnb alugado**, permitindo decidir quais despesas cabem ao locatário. O valor do imóvel não entra no patrimônio nem no custo de oportunidade desse cenário.

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

A proposta comercial real de administradora mencionada no backlog ainda não foi localizada nos materiais conectados. Até que ela seja fornecida, os checkboxes de gestão usam como proxy o escopo público de planos completos do mercado carioca: a administradora gerencia atendimento, preços, limpeza/lavanderia e operação, mas esses custos não são presumidos como incluídos financeiramente na comissão.

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

## Limitações atuais

- Horizonte principal ainda é de um ano.
- Custos de compra/venda e a escolha inicial “já tenho imóvel” × “já tenho dinheiro” ainda serão modelados.
- O benchmark de aportes ocorridos ao longo do ano ainda não faz ponderação temporal mensal.
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
- ocupação recuperada da planilha original: Réveillon 100%, verão 90%, Carnaval 100%, outono 70%, inverno 60% e primavera 70%;
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

- horizonte principal selecionável em 1, 3 ou 5 anos (default: 5);
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

O timing intramês de aportes, capital de giro automático e custo de oportunidade pelo mês efetivo continuam deliberadamente na Issue #14 / Rodada E.


## V18 — timing mensal dos aportes

A Issue #14 corrige a aproximação que tratava todo déficit futuro como capital disponível desde o início da análise.

Para cada cenário e horizonte:
- o caixa recorrente de cada ano é distribuído em 12 meses;
- o modelo identifica quando o saldo ficaria negativo;
- o aporte externo ocorre apenas naquele mês;
- calcula-se o maior déficit acumulado como **capital de giro automático requerido**;
- cada aporte entra no benchmark financeiro apenas pelo tempo restante até o fim do horizonte;
- a base real do capital aportado é trazida ao mês zero antes de calcular ganho patrimonial real.

Essa granularidade mensal trata o **timing do financiamento da operação**, mas ainda não redistribui Réveillon/verão/Carnaval/outono/inverno/primavera por meses específicos. Essa sazonalidade mensal completa permanece na Rodada E (#13).


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
