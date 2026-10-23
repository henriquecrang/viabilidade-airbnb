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
```

Os testes cobrem delegação de horas, separação entre gestão e custo incluído, caixa sustentável da aplicação, preservação do saldo inicial das reservas e base tributável configurável, incluindo sublocação.