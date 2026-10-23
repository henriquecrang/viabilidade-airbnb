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

A Rodada A inclui testes sem dependências externas para as quatro correções críticas:

```bash
node tests/round-a.test.js
```

Os testes cobrem delegação de horas, separação entre gestão e custo incluído, caixa sustentável da aplicação, preservação do saldo inicial das reservas e base tributável configurável, incluindo sublocação.