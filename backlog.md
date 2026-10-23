# Backlog — Simulador Airbnb x Aluguel x Investimento

Este backlog consolida os achados da auditoria mais recente da aplicação e os organiza em blocos de execução que podem ser implementados e validados em conjunto.

## Princípios para as próximas alterações

- Evitar mudanças grandes demais em uma única rodada.
- Preservar a separação entre **fluxo de caixa**, **patrimônio**, **reservas vinculadas** e **resultado econômico**.
- Evitar dupla contagem entre OPEX, CAPEX, depreciação, reservas e custo de oportunidade.
- Manter compatibilidade com JSONs salvos sempre que possível; quando houver migração, documentá-la.
- Depois de cada bloco, criar testes de regressão para impedir que uma correção quebre premissas já estabilizadas.

---

## Status de execução

- **Rodada A — concluída em 23/10/2026:** Blocos 1, 2, 3 e 4 implementados e cobertos por testes de regressão.
- **Rodada B0 — executada em 23/10/2026:** itens 13.1, 13.2 e 13.4 concluídos; 13.3 parcialmente calibrado com referências públicas e pendente da proposta comercial real.
- Próxima rodada funcional planejada: Rodada B — Blocos 5, 7 e parte do 8.

# Bloco 1 — Delegação para administradora e horas do investidor

**Status:** ✅ Concluído na Rodada A

**Prioridade:** crítica  
**Motivo:** hoje a interface permite dizer que a administradora assume custos/atividades, mas isso não reduz automaticamente o tempo do investidor. O resultado econômico pode ficar materialmente errado.

## Achados incluídos

### 1.1 Separar “administradora gerencia” de “custo incluído na comissão”

Hoje um único checkbox tende a misturar duas perguntas diferentes:

- A administradora executa/gerencia esta atividade?
- O custo monetário desta atividade está incluído na comissão da administradora?

Exemplo: a administradora pode coordenar a faxina, eliminando o tempo do investidor, mas a faxina continuar sendo cobrada separadamente.

### 1.2 Calcular horas do investidor por atividade

Substituir ou complementar o campo genérico “horas/mês no Airbnb administrado” por horas associadas às atividades.

Exemplos:

- limpeza: horas por reserva de supervisão/coordenação;
- check-in/out: horas por reserva;
- marketing/comercial: horas por mês;
- mensagens e reservas: horas por mês;
- suporte operacional: horas por mês;
- gestão de prestadores: horas por mês.

Quando `adminGerencia = true`, as horas daquela atividade devem deixar de ser atribuídas ao investidor no cenário administrado.

### 1.3 Manter “supervisão da administradora” como tempo residual

Mesmo com delegação ampla, o proprietário pode gastar algum tempo acompanhando desempenho, aprovando decisões e cobrando a empresa.

Adicionar campo independente:

- `horasSupervisaoAdministradoraMes`

### Critérios de conclusão

- Marcar “administradora gerencia atendimento ao hóspede” reduz automaticamente as horas do investidor no cenário administrado.
- Marcar apenas “custo incluído na comissão” não altera horas.
- Marcar apenas “administradora gerencia” não zera o custo monetário se ele continuar cobrado separadamente.
- Resultado econômico do cenário administrado reflete as horas residuais de supervisão.

---

# Bloco 2 — Caixa sustentável da aplicação financeira

**Status:** ✅ Concluído na Rodada A

**Prioridade:** crítica  
**Motivo:** hoje o resumo trata todo o rendimento líquido nominal como caixa livre. Isso superestima o valor que pode ser retirado sem corroer o principal em termos reais e pode mudar o ranking dos cenários.

## Achados incluídos

### 2.1 Separar rendimento nominal de renda sustentável

Mostrar separadamente:

- rendimento nominal líquido;
- parcela necessária para preservar o poder de compra do principal;
- caixa distribuível preservando o principal real;
- ganho patrimonial real.

### 2.2 Corrigir o número usado no quadro “Quanto você ganha”

O resumo de caixa deve usar o **caixa distribuível preservando o principal real**, e não todo o rendimento nominal líquido, quando a comparação estiver sendo feita sob a premissa de preservação real do capital.

### 2.3 Revisar nomenclatura

Evitar chamar a inflação de “despesa”. Preferir termos como:

- preservação do poder de compra;
- manutenção real do capital;
- parcela do rendimento necessária para preservação do principal real.

### Critérios de conclusão

Em um teste com:

- capital = R$ 1.000.000;
- inflação = 6%;
- rendimento líquido nominal = 12%;

espera-se:

- patrimônio nominal final = R$ 1.120.000;
- parcela nominal para preservação do poder de compra = R$ 60.000;
- caixa nominal distribuível preservando o principal = R$ 60.000;
- ganho real ≈ R$ 56.604 em reais do início do período.

---

# Bloco 3 — Reservas vinculadas e administradora

**Status:** ✅ Concluído na Rodada A

**Prioridade:** crítica  
**Motivo:** há um bug objetivo: ao marcar que a administradora cobre a reposição, o saldo inicial já existente da reserva pode desaparecer do patrimônio do proprietário.

## Achados incluídos

### 3.1 Preservar saldo inicial da reserva

O saldo inicial de uma reserva vinculada é patrimônio já existente do investidor.

Portanto:

- nunca deve desaparecer por causa da contratação de administradora;
- apenas **novos aportes futuros** podem ser zerados se a administradora assumir integralmente aquela obrigação.

### 3.2 Separar saldo existente de obrigação futura

Estrutura sugerida:

- `saldoInicialReserva`;
- `aporteAnualReserva`;
- `adminCobreReposicaoFutura`.

### Critérios de conclusão

Se houver R$ 10.000 de saldo inicial e a administradora passar a cobrir novas reposições:

- reserva vinculada final começa em R$ 10.000;
- novos aportes do proprietário podem ser zero;
- os R$ 10.000 continuam compondo o patrimônio.

---

# Bloco 4 — Tributação e base tributável

**Status:** ✅ Concluído na Rodada A

**Prioridade:** crítica  
**Motivo:** hoje a base tributável pode estar sendo reduzida por despesas que não são necessariamente dedutíveis no IRPF. Isso pode subestimar o imposto e favorecer artificialmente alguns cenários.

## Achados incluídos

### 4.1 Não usar automaticamente OPEX total como base de dedução

Cada custo deve poder indicar se é ou não dedutível da base tributável.

Possível estrutura por linha de custo:

- `dedutivelIR = true/false`.

### 4.2 Criar defaults tributários conservadores

Precisamos revisar e marcar por padrão apenas despesas cuja dedutibilidade seja razoavelmente sustentada pelas regras aplicáveis.

### 4.3 Tratar corretamente o Airbnb em imóvel alugado

No cenário de sublocação, o aluguel pago ao proprietário pode ter tratamento específico na base tributária e deve ser modelado separadamente.

### 4.4 Preservar receitas tributáveis adicionais

Taxas cobradas do hóspede, como taxa de limpeza, devem continuar entrando na receita tributável quando aplicável.

### Critérios de conclusão

- Alterar um custo entre dedutível/não dedutível muda apenas a base tributável, não o caixa operacional antes do imposto.
- O imposto final é calculado sobre a base tributável configurada, não sobre `receita - OPEX total` indiscriminadamente.
- O cenário de imóvel alugado trata o aluguel pago como variável tributária separada.

---

# Bloco 5 — Receita e efeito da administradora sobre performance

**Prioridade:** alta  
**Motivo:** hoje a administradora só adiciona custo ou absorve despesas. Ela nunca pode aumentar receita, embora gestão de preço, calendário, reservas e anúncio possa afetar performance.

## Achados incluídos

### 5.1 Permitir impacto da administradora na diária

Adicionar, com default zero:

- `impactoAdminDiariaPct`.

### 5.2 Permitir impacto da administradora na ocupação

Adicionar, com default zero:

- `impactoAdminOcupacaoPp` (pontos percentuais) ou percentual relativo, escolhendo uma semântica única e clara.

### 5.3 Aplicar esses impactos somente ao cenário administrado

O cenário autogerido continua usando as premissas-base.

### Critérios de conclusão

- Com ambos os impactos em zero, o cenário administrado mantém exatamente a mesma receita-base do autogerido.
- Alterar apenas a diária afeta apenas o preço médio e receita.
- Alterar apenas ocupação afeta noites vendidas, número de reservas e custos variáveis relacionados.

---

# Bloco 6 — Métricas Airbnb compatíveis com dados de mercado

**Prioridade:** alta  
**Motivo:** o ADR atual não necessariamente é comparável ao ADR usado por plataformas de inteligência de mercado, que podem incluir taxa de limpeza e outras receitas da reserva.

## Achados incluídos

### 6.1 Separar “diária média” de “ADR total”

Mostrar pelo menos:

- diária média das noites vendidas: apenas receita de diária / noites ocupadas;
- ADR total: receita total da reserva / noites ocupadas.

### 6.2 Revisar RevPAR

Mostrar:

- RevPAR baseado em diária;
- RevPAR total, se útil, usando a mesma convenção do ADR total.

### 6.3 Manter definição de ocupação atual

A ocupação calculada sobre noites efetivamente disponíveis está correta e deve ser preservada.

### Critérios de conclusão

- Taxa de limpeza altera ADR total, mas não a diária média pura.
- Dias bloqueados não entram no denominador de ocupação.

---

# Bloco 7 — CAPEX: quem paga x quem fica com o ativo

**Prioridade:** alta  
**Motivo:** hoje marcar um CAPEX como “incluído pela administradora” pode eliminar também o valor residual do ativo. Isso só é correto se o ativo não pertencer ao proprietário.

## Achados incluídos

### 7.1 Separar pagador do proprietário do ativo

Para cada item de CAPEX, distinguir:

- quem desembolsa;
- quem possui o ativo ao final.

Estrutura sugerida:

- `pagoPelaAdministradora = true/false`;
- `ativoPertenceAoProprietario = true/false`.

### 7.2 Preservar valor residual quando apropriado

Se a administradora paga uma TV, mas contratualmente a TV passa a pertencer ao imóvel/proprietário:

- desembolso do proprietário = zero;
- valor residual continua compondo patrimônio do proprietário.

### Critérios de conclusão

Testar quatro combinações:

1. proprietário paga / proprietário fica com ativo;
2. administradora paga / proprietário fica com ativo;
3. proprietário paga / terceiro fica com ativo;
4. administradora paga / administradora fica com ativo.

---

# Bloco 8 — Resultado econômico real vs benchmark

**Prioridade:** alta  
**Motivo:** hoje o custo do tempo do investidor aparece separado, mas o `Δ vs benchmark` ainda pode comparar apenas resultados financeiros, fazendo uma estratégia intensiva em trabalho parecer melhor do que realmente é economicamente.

## Achados incluídos

### 8.1 Manter duas comparações

Exibir:

- `Δ financeiro vs benchmark`;
- `Δ econômico vs benchmark`.

### 8.2 Incluir custo do tempo na comparação econômica

Resultado econômico deve considerar:

- horas do investidor;
- valor/hora;
- horas residuais da administradora;
- eventualmente pequeno tempo gasto para gerir o investimento financeiro.

### 8.3 Permitir tempo do cenário financeiro

Adicionar, mesmo que default seja próximo de zero:

- `horasInvestimentoMes`.

### Critérios de conclusão

Uma estratégia pode aparecer positiva financeiramente e negativa economicamente se consumir muitas horas do proprietário.

---

# Bloco 9 — Capital de giro

**Prioridade:** alta, mas pode ser implementado inicialmente de forma simples  
**Motivo:** um negócio pode fechar o ano positivo e ainda precisar de caixa no meio do caminho para atravessar meses negativos.

## Achados incluídos

### 9.1 Adicionar capital de giro manual na versão anual

Enquanto o modelo ainda é anual, adicionar:

- `capitalGiroInicial` ou `reservaCapitalGiro`.

Esse valor deve ser tratado como:

- patrimônio vinculado;
- capital de oportunidade;
- não como despesa.

### 9.2 Futuramente calcular automaticamente

Quando houver fluxo mensal, substituir/validar o campo manual pelo **pico de necessidade de caixa acumulada**.

### Critérios de conclusão

- Capital de giro reduz capital livre disponível para outros usos.
- Continua compondo patrimônio.
- Entra no benchmark financeiro de custo de oportunidade.

---

# Bloco 10 — Benchmark de custo de oportunidade e timing dos aportes

**Prioridade:** média agora; alta antes da projeção plurianual  
**Motivo:** hoje déficits anuais podem ser tratados como se o capital necessário estivesse disponível desde o início do ano, mesmo que o aporte só aconteça meses depois.

## Achados incluídos

### 10.1 Documentar aproximação atual

Na versão anual, manter claramente indicado que aportes para cobrir déficit são tratados de forma conservadora como capital comprometido pelo período inteiro.

### 10.2 Migrar para aportes temporais no modelo mensal

Quando houver fluxo mês a mês:

- cada aporte entra no benchmark no mês em que seria necessário;
- o custo de oportunidade passa a considerar o tempo efetivo de permanência do dinheiro.

### Critérios de conclusão

Não implementar aproximações silenciosas. A interface deve informar quando o benchmark anual estiver usando a simplificação.

---

# Bloco 11 — Arquitetura dos cenários Airbnb: posse x gestão

**Prioridade:** média  
**Motivo:** hoje existem cenários fixos: próprio/autogerido, próprio/administrado e alugado/autogerido. Falta alugado/administrado e a estrutura tende a crescer de forma pouco elegante.

## Achados incluídos

### 11.1 Transformar Airbnb em combinação de duas dimensões

**Posse:**

- imóvel próprio;
- imóvel alugado.

**Gestão:**

- autogestão;
- administradora.

Isso gera naturalmente:

1. próprio + autogestão;
2. próprio + administradora;
3. alugado + autogestão;
4. alugado + administradora.

### 11.2 Reduzir duplicação de código

Receita e operação-base devem ser compartilhadas, com diferenças aplicadas por configuração.

### Critérios de conclusão

- Os quatro modos Airbnb usam o mesmo motor-base.
- Administradora funciona de forma idêntica em imóvel próprio e alugado.
- Custos de posse e aluguel entram apenas onde aplicáveis.

---

# Bloco 12 — Itens revisados e considerados corretos

**Prioridade:** preservar por testes de regressão  
**Motivo:** estes pontos já estão conceitualmente bem resolvidos e não devem ser quebrados durante as próximas alterações.

Criar testes para garantir permanentemente:

### 12.1 Sazonalidade

- dias bloqueados retirados da disponibilidade;
- ocupação aplicada apenas aos dias disponíveis;
- noites ocupadas consistentes;
- número de reservas = noites ocupadas / estadia média.

### 12.2 Receita Airbnb

- taxa de limpeza cobrada do hóspede entra como receita;
- outras receitas por reserva entram na receita quando configuradas;
- taxa da plataforma incide sobre a base correta definida no modelo.

### 12.3 Custos variáveis

- custos por reserva escalam com o número esperado de reservas.

### 12.4 Manutenção x fundo de reposição

- manutenção é OPEX;
- fundo de reposição é transferência para reserva vinculada;
- não ocorre dupla contagem.

### 12.5 CAPEX e depreciação

- CAPEX é desembolso inicial;
- valor residual permanece como ativo;
- depreciação é perda econômica, não necessariamente saída de caixa.

### 12.6 Caução

- caução é patrimônio vinculado;
- não é despesa enquanto recuperável.

### 12.7 Nominal x real

- inflação e valorização real do imóvel são compostas corretamente;
- patrimônio nominal e patrimônio real são separados;
- ganho real é calculado em moeda de poder de compra do início do período.

### 12.8 Capital de oportunidade

- déficit anual aumenta capital de oportunidade;
- CAPEX adicional também entra no benchmark;
- o mesmo dinheiro não é contado duas vezes.

### 12.9 Benchmark por estratégia

- cada estratégia é comparada contra a aplicação do capital efetivamente exigido por ela.

---

# Ordem sugerida de execução

## Rodada A — Corrigir resultados que podem mudar a conclusão

Implementar juntos:

1. Bloco 1 — Delegação e horas;
2. Bloco 2 — Caixa sustentável da aplicação;
3. Bloco 3 — Reserva inicial no cenário administrado;
4. Bloco 4 — Tributação.

**Por quê:** todos podem alterar diretamente o ranking atual dos cenários.

---

## Rodada B — Melhorar a fidelidade do cenário administrado

Implementar juntos:

1. Bloco 5 — Impacto sobre receita;
2. Bloco 7 — CAPEX pago x propriedade do ativo;
3. parte do Bloco 8 — custo econômico das horas.

**Por quê:** os três tratam do que realmente muda quando a operação é terceirizada.

---

## Rodada C — Melhorar métricas e interpretação

Implementar juntos:

1. Bloco 6 — ADR/RevPAR compatíveis;
2. conclusão do Bloco 8 — Δ financeiro x Δ econômico;
3. Bloco 9 — capital de giro manual.

**Por quê:** melhoram a leitura da decisão sem ainda exigir transformar o motor em mensal.

---

## Rodada D — Refatoração estrutural dos cenários Airbnb

Implementar:

1. Bloco 11 — posse x gestão.

**Por quê:** deve ser feito depois que as regras de administradora estiverem estabilizadas, para não refatorar duas vezes.

---

## Rodada E — Modelo mensal e horizonte de 3/5 anos

Dependências:

- Blocos 1–11 estabilizados.

Incluir futuramente:

- fluxo de caixa mensal;
- timing real de aportes;
- cálculo automático de capital de giro;
- custo de oportunidade pelo mês efetivo;
- evolução das reservas vinculadas;
- depreciação e reposição de ativos no tempo;
- reajuste de aluguel;
- valorização do imóvel;
- patrimônio nominal e real em 1, 3 e 5 anos;
- ponto de equilíbrio/payback do CAPEX de montagem.

Esse bloco absorve o achado do Bloco 10.

---

# Próximo passo recomendado

Com a Rodada A concluída e a B0 executada, a próxima rodada funcional é a **Rodada B — fidelidade do cenário administrado** (Blocos 5, 7 e parte do 8). O item 13.3 pode ser finalizado assim que a proposta comercial real de administradora estiver disponível.

---

# Bloco 13 — Ajustes de apresentação e defaults de mercado

**Prioridade:** alta  
**Motivo:** depois da Rodada A, o motor distingue corretamente rendimento nominal, preservação do poder de compra e ganho real, mas a apresentação final ainda precisa destacar a métrica mais útil para decisão. Além disso, os valores de exemplo/defaults ainda refletem em parte premissas históricas e devem ser recalibrados para o mercado atual.

## Achados incluídos

### 13.1 Destacar no resultado final o excedente nominal sobre preservação

**Status:** ✅ Concluído na Rodada B0

No quadro final, substituir o destaque principal de **caixa livre** pelo **Excedente nominal sobre preservação do poder de compra** quando a pergunta for “quanto posso consumir sem corroer o principal real?”.

Manter visíveis, em segundo plano, as demais métricas:

- rendimento/caixa nominal;
- parcela necessária para preservação do poder de compra;
- excedente nominal sobre preservação;
- ganho patrimonial real;
- patrimônio real final.

**Critério de conclusão:** o ranking visual principal não deve favorecer uma aplicação apenas porque parte do rendimento nominal necessária para recompor a inflação foi tratada como renda disponível.

### 13.2 Atualizar valores default para a realidade do mercado atual

**Status:** ✅ Concluído na Rodada B0 — cenário-base Rio de Janeiro/outubro de 2026

Revisar os valores padrão da aplicação com dados atuais, incluindo pelo menos:

- taxa da plataforma Airbnb;
- inflação projetada;
- rentabilidade financeira de referência;
- imposto efetivo usado nos exemplos;
- diária e ocupação dos exemplos;
- custos de limpeza/lavanderia/amenities;
- condomínio, IPTU, utilities e internet;
- custos de software/automação;
- custos de manutenção e reposição;
- aluguel tradicional de referência;
- comissão típica de imobiliária;
- comissão típica de administradora de Airbnb;
- horas de dedicação do proprietário quando aplicável.

Separar claramente **default de exemplo** de **premissa recomendada**, evitando apresentar um número de mercado como universal quando depender muito do imóvel/localização.

### 13.3 Estudar proposta real recebida de administradora para calibrar defaults

**Status:** 🟡 Parcial — referências públicas calibradas; proposta comercial real ainda não localizada

Usar uma proposta comercial real de administradora como estudo de caso para:

- identificar exatamente quais serviços entram na comissão;
- distinguir serviços gerenciados de custos efetivamente incluídos;
- mapear taxas fixas, percentuais e cobranças extras;
- estimar horas residuais de supervisão do proprietário;
- revisar os checkboxes que devem vir marcados por padrão;
- avaliar se a administradora promete/entrega impacto esperado em preço, ocupação ou RevPAR;
- calibrar comissão, onboarding e demais defaults da aplicação.

**Critério de conclusão:** produzir um preset “administradora — caso real” ou documentar defaults revisados derivados da proposta, sem transformar uma proposta específica em regra geral.

### 13.4 Ampliar a largura da página e acomodar os cinco cenários lado a lado

**Status:** ✅ Concluído na Rodada B0

Aumentar a largura máxima útil da aplicação em telas grandes, especialmente na seção de resumo final, para que os cinco cenários caibam em uma única linha:

- Airbnb autogerido;
- Airbnb com administradora;
- Airbnb em imóvel alugado;
- aluguel tradicional;
- investimento financeiro.

Preservar comportamento responsivo:

- cinco colunas em desktops largos;
- redução progressiva para 3/2/1 colunas conforme a largura da tela;
- evitar cards estreitos demais, truncamento de rótulos e scroll horizontal;
- manter o bloco de destaque do “melhor cenário” alinhado ao novo grid.

**Critério de conclusão:** em uma tela desktop ampla como a usada no print de referência, os cinco cards principais do resumo final aparecem lado a lado, com leitura confortável e sem comprometer a responsividade em telas menores.

---


### 13.5 Mostrar equivalente mensal dos resultados anuais

**Prioridade:** baixa / ajuste de apresentação  
**Motivo:** os resultados anuais são corretos para o motor econômico, mas a leitura de um valor mensal facilita a comparação com aluguel, renda recorrente e orçamento pessoal.

No resumo final, mostrar também o **equivalente mensal** das principais métricas monetárias anuais, calculado simplesmente como:

- `valor mensal equivalente = valor anual ÷ 12`.

Aplicar pelo menos ao valor principal destacado no card final — atualmente **Excedente nominal sobre preservação do poder de compra** — e avaliar se vale repetir o equivalente mensal para caixa livre e outras métricas de fluxo.

Regras de apresentação:

- manter o valor anual como referência principal do modelo;
- mostrar o equivalente mensal logo abaixo ou ao lado, sem substituir o anual;
- usar rótulo como **“equivalente mensal”** ou **“média mensal equivalente”**;
- não chamar o valor em reais de “taxa mensal”;
- se futuramente houver exibição de percentuais mensais, não dividir uma taxa anual composta por 12: usar conversão financeira apropriada.

**Critério de conclusão:** cada card do resumo final permite enxergar imediatamente o valor anual e sua média mensal equivalente, sem alterar nenhum cálculo econômico do cenário.

---

## Registro de execução da Rodada B0 — 23/10/2026

Implementado:

- resumo final passa a ranquear por **Excedente nominal sobre preservação do poder de compra**; caixa livre continua visível como métrica de liquidez;
- página ampliada para `max-width: 1560px`, com cinco cards lado a lado a partir de 1280 px e fallback responsivo 3/2/1;
- defaults recalibrados para cenário-base do Rio de Janeiro em outubro de 2026;
- sazonalidade simplificada para alta / intermediária / baixa com dados recentes do mercado;
- benchmark financeiro alterado para taxa nominal de referência (CDI corrente) em vez do antigo IPCA+8%;
- aluguel tradicional e comissão imobiliária atualizados para referências contemporâneas;
- gestão Airbnb mantém 25% como referência de pacote completo e passa a marcar por padrão quais atividades normalmente são gerenciadas, sem presumir que os custos de terceiros estejam incluídos.

Pendência mantida:

- receber/localizar a **proposta comercial real de administradora** para revisar comissão, base de incidência, onboarding, despesas incluídas, contrato e horas residuais. Essa etapa deve gerar um preset/caso real, sem substituir automaticamente o default de mercado.

---

# Bloco 14 — Módulo de estudo de preço e ocupação do imóvel

**Prioridade:** alta  
**Motivo:** hoje diária e ocupação entram como premissas manuais. Para a calculadora se tornar uma ferramenta de decisão completa, precisamos de um módulo que ajude a estimar essas duas variáveis a partir de comparáveis de mercado e características do imóvel.

## Objetivo

Criar um módulo independente, mas integrado ao simulador, para estimar:

- diária média esperada;
- ocupação média esperada;
- sazonalidade por período;
- faixa pessimista/base/otimista;
- eventual RevPAR esperado.

## Entradas candidatas

Características do imóvel, por exemplo:

- localização/bairro;
- latitude/longitude ou raio de busca;
- metragem;
- número de quartos;
- número de camas/hóspedes;
- tipo de imóvel;
- padrão de acabamento;
- elevador;
- garagem;
- ar-condicionado;
- vista/andar;
- piscina/academia/portaria;
- proximidade de atrações, praia, transporte ou centros de evento;
- nota/avaliação esperada;
- política de estadia mínima;
- disponibilidade anual.

## Fontes e metodologia a estudar

- comparáveis manuais do Airbnb;
- dados de plataformas de inteligência de STR quando disponíveis;
- anúncios equivalentes próximos;
- histórico de preços por temporada/eventos;
- diferença entre preço anunciado e receita efetivamente realizada;
- definição de ADR/ocupação usada pela fonte;
- tamanho mínimo da amostra e critérios para descartar outliers.

## Saída para o simulador

O módulo não deve alterar silenciosamente as premissas principais. Deve produzir uma sugestão que o usuário possa aplicar, por exemplo:

- diária base sugerida;
- ocupação base sugerida;
- blocos sazonais sugeridos;
- intervalo de confiança/faixa de sensibilidade;
- lista de comparáveis que fundamentaram a estimativa.

### Critérios de conclusão

- o usuário consegue descrever o imóvel e obter uma estimativa auditável de preço/ocupação;
- os comparáveis utilizados ficam visíveis;
- a estimativa pode ser enviada para a simulação principal com uma ação explícita;
- o módulo não confunde preço anunciado com receita efetiva;
- cenários pessimista/base/otimista podem ser gerados a partir da mesma pesquisa.

---

# Atualização da ordem sugerida de execução

Antes da projeção plurianual, considerar a seguinte sequência adicional:

## Rodada B0 — Calibração e apresentação

1. Bloco 13.1 — destacar excedente nominal sobre preservação no resultado final;
2. Bloco 13.2 — atualizar defaults de mercado;
3. Bloco 13.3 — estudar proposta real de administradora e calibrar defaults/checklists;
4. Bloco 13.4 — ampliar o layout para exibir os cinco resultados lado a lado em telas largas.

**Por quê:** melhora imediatamente a leitura dos resultados e evita testar as próximas funcionalidades sobre premissas antigas ou pouco realistas.

## Frente de pesquisa de mercado

- Bloco 14 — módulo de preço médio/ocupação.

**Observação:** pode ser desenvolvido em paralelo às Rodadas B/C porque é relativamente independente do motor contábil central, desde que sua saída seja tratada como sugestão de premissas e não como cálculo silencioso.

---

# Bloco 15 — Uso parcial do imóvel e disponibilidade híbrida

**Status:** backlog futuro

## Problema

A versão inicial do simulador assume um apartamento comprado ou mantido como investimento, com potencial de disponibilidade de até 365 dias por ano. Essa premissa não cobre bem situações em que o imóvel também gera **valor de uso pessoal**.

Há pelo menos dois casos economicamente diferentes:

1. **Imóvel de investimento com uso pessoal ocasional** — o proprietário bloqueia alguns dias para férias, feriados ou visitas e evita gastar com hotel/hospedagem.
2. **Moradia principal com locação oportunística** — a pessoa mora no imóvel a maior parte do ano e disponibiliza o apartamento apenas em datas específicas de alta demanda, viagens próprias ou eventos.

Nesses casos, simplesmente reduzir os “dias disponíveis” é insuficiente: precisamos reconhecer também o benefício econômico do uso próprio e rever o capital/custo de oportunidade atribuído à atividade de locação.

## Objetivo

Permitir analisar imóveis de uso misto sem tratar todos os 365 dias e todo o capital imobiliário como se estivessem exclusivamente dedicados ao Airbnb.

## Novas premissas candidatas

### Disponibilidade e uso próprio

- dias disponíveis para locação;
- dias bloqueados por uso pessoal;
- dias bloqueados por moradia habitual;
- dias bloqueados por manutenção/indisponibilidade operacional;
- períodos específicos de locação (ex.: Carnaval, Réveillon, Rock in Rio, férias do proprietário);
- possibilidade de classificar cada bloco de dias por motivo de indisponibilidade.

### Valor econômico do uso próprio

Para uso pessoal ocasional:

- custo evitado de hotel/hospedagem por noite;
- número de pessoas beneficiadas, se relevante;
- custos incrementais do uso próprio;
- benefício econômico imputado pelo uso do imóvel.

O benefício de “economizar hotel” deve aparecer separadamente do caixa, como **benefício de consumo/uso próprio**, não como receita recebida.

### Moradia principal + Airbnb eventual

Para quem mora no imóvel:

- valor de aluguel residencial equivalente da moradia (custo de habitação evitado);
- custos que existiriam independentemente do Airbnb;
- custos incrementais causados apenas pela atividade Airbnb;
- necessidade de desocupação temporária e eventual custo de hospedagem alternativa;
- armazenamento/retirada de itens pessoais;
- limpeza/preparação extraordinária antes/depois da locação;
- prêmio necessário para justificar disponibilizar a própria residência.

## Custo de oportunidade

Rever a lógica atual de capital de oportunidade para que ela não atribua automaticamente todo o valor do imóvel exclusivamente à operação Airbnb quando o ativo também presta serviço de moradia ou lazer ao proprietário.

Estudar pelo menos duas abordagens:

1. **Abordagem por uso econômico:** separar o valor produzido pela moradia/uso pessoal do valor produzido pela locação de curta duração.
2. **Abordagem incremental:** avaliar se disponibilizar determinados dias no Airbnb melhora a situação econômica em relação ao cenário-base em que a pessoa continuaria usando/morando no imóvel.

Para o caso de moradia principal, a pergunta central tende a ser incremental:

> “Quanto eu ganho a mais ao disponibilizar estes dias, considerando os custos e inconvenientes adicionais?”

em vez de:

> “Qual é o retorno do imóvel inteiro como investimento?”

## Resultados adicionais

Além das lentes já existentes, considerar mostrar:

- receita Airbnb nos dias disponibilizados;
- caixa incremental da locação eventual;
- benefício econômico do uso próprio;
- hospedagem/hotel evitado;
- custo de hospedagem alternativa, quando houver;
- retorno incremental dos dias colocados à disposição;
- retorno sobre o CAPEX adicional necessário para viabilizar o Airbnb;
- valor econômico total = caixa + benefício de uso próprio, mantendo as parcelas claramente separadas.

## Regras para evitar dupla contagem

- economia com hotel não é receita de Airbnb;
- valor de moradia própria não é caixa recebido;
- custos fixos que existiriam mesmo sem Airbnb não devem ser integralmente atribuídos à operação incremental sem uma regra explícita de rateio;
- custos adicionais gerados exclusivamente pela locação devem ser atribuídos integralmente ao Airbnb;
- dias bloqueados para uso pessoal não devem ser tratados como “vacância” ou falha de ocupação;
- benefício de uso pessoal não deve ser somado ao patrimônio; é benefício de consumo no período.

## Interface futura

Adicionar um seletor de finalidade do imóvel, por exemplo:

- **Investimento dedicado — disponível até 365 dias/ano**;
- **Investimento com uso pessoal ocasional**;
- **Moradia principal com locação eventual**.

A escolha deve revelar apenas os campos necessários para cada caso, preservando a simplicidade do modo padrão.

### Critérios de conclusão

- dias de uso pessoal deixam de ser confundidos com vacância;
- o simulador consegue valorizar explicitamente economia de hospedagem quando o usuário desejar;
- moradia principal é analisada de forma incremental, sem exigir que todo o valor do imóvel “renda” como se fosse capital dedicado ao Airbnb;
- custos fixos compartilhados e custos incrementais ficam claramente separados;
- caixa, benefício de uso e patrimônio continuam sendo métricas distintas;
- o modo padrão de apartamento puramente para investimento continua simples e permanece como configuração inicial.

---

# Atualização adicional da ordem sugerida

O Bloco 15 deve ser executado **depois de estabilizarmos o modelo de investimento dedicado e, preferencialmente, depois do modelo mensal/plurianual**, porque o valor econômico de dias específicos, viagens do proprietário e janelas de alta demanda é muito mais bem representado em uma linha do tempo mensal/diária do que em médias anuais.

---

# Bloco 16 — Wizards de onboarding e configuração guiada

## Objetivo

Criar uma camada de configuração progressiva que ajude o usuário a descobrir primeiro **qual problema econômico está tentando resolver** e, depois, preencher apenas as premissas relevantes para os cenários escolhidos.

A intenção é evitar que a aplicação apresente dezenas de campos para todos os usuários desde o início. O wizard deve configurar a estrutura do estudo e revelar apenas os módulos necessários.

## 16.1 Wizard principal — definição do problema e dos cenários

Criar um primeiro wizard de alto nível para identificar a situação de partida e o uso pretendido do imóvel.

Perguntas possíveis:

### Situação patrimonial atual

- Você já possui um imóvel?
- Você possui capital e está pensando em comprar um imóvel?
- Você cogita alugar um imóvel de terceiro para operar no Airbnb?
- Você quer apenas comparar manter o capital aplicado com alguma das alternativas imobiliárias?

### Finalidade do imóvel

Se já possui ou pretende comprar:

- O imóvel será dedicado integralmente a investimento?
- Você pretende morar nele e disponibilizá-lo no Airbnb apenas em algumas datas?
- Você pretende mantê-lo como imóvel de lazer/segunda residência, usando parte do ano e alugando no restante?
- Você pretende colocá-lo em aluguel tradicional?
- Você pretende avaliar Airbnb, aluguel tradicional e aplicação financeira simultaneamente?

### Cenários habilitados automaticamente

Com base nas respostas, o wizard deve ativar apenas os cenários relevantes. Exemplos:

**Tenho dinheiro e penso em comprar:**
- comprar para Airbnb autogerido;
- comprar para Airbnb administrado;
- comprar para aluguel tradicional;
- alugar imóvel de terceiro para Airbnb, se o usuário disser que cogita essa alternativa;
- manter o dinheiro investido.

**Já tenho imóvel:**
- Airbnb autogerido;
- Airbnb administrado;
- aluguel tradicional;
- vender e investir o capital líquido;
- eventualmente Airbnb parcial/uso pessoal, conforme finalidade declarada.

**Moro no imóvel:**
- moradia principal sem Airbnb como cenário-base;
- Airbnb eventual em datas selecionadas;
- eventual comparação com mudança de estratégia somente se o usuário quiser.

**Segunda residência / imóvel de lazer:**
- uso pessoal + Airbnb parcial;
- aluguel integral;
- venda + investimento, quando pertinente.

## 16.2 Separar configuração de cenário de preenchimento de premissas

O wizard principal deve responder apenas:

> **“Quais cenários devem existir nesta simulação?”**

Depois disso, a aplicação apresenta wizards especializados para responder:

> **“Quais são as premissas desses cenários?”**

Isso evita misturar decisão estratégica com preenchimento detalhado de números.

## 16.3 Wizard de custo de oportunidade / investimento financeiro

Criar um wizard específico para configurar o benchmark financeiro.

Perguntas possíveis:

- Que tipo de aplicação você considera como alternativa?
  - CDB/RDB;
  - Tesouro Selic;
  - Tesouro IPCA+;
  - fundo DI/renda fixa;
  - outro investimento;
- Você conhece a rentabilidade nominal, líquida ou real?
- A taxa informada já considera IR?
- Qual prazo de investimento está sendo considerado?
- Há liquidez diária ou prazo de vencimento?
- Existem taxas de administração/custódia?
- O investimento será usado apenas como benchmark ou representa uma aplicação real já disponível ao usuário?

O wizard deve converter as respostas para as variáveis internas já usadas pela calculadora, preservando a distinção entre:

- retorno nominal;
- imposto;
- preservação do poder de compra;
- retorno real.

## 16.4 Wizard de administradora / co-host

Criar um wizard para transformar uma proposta comercial real em configuração do cenário administrado.

Perguntas possíveis:

- Você já recebeu uma proposta de administradora/co-host?
- Qual é a comissão percentual?
- Existe mensalidade fixa?
- Existe taxa de onboarding/setup?
- A comissão incide sobre quais componentes da receita?
- Quais atividades a administradora gerencia?
- Quais custos estão efetivamente incluídos na comissão?
- Quais despesas continuam sendo pagas à parte pelo proprietário?
- Quem é responsável por limpeza, lavanderia, manutenção e check-in/out?
- A empresa promete ou apresenta evidência de aumento de diária/ocupação?
- Quanto tempo de supervisão do proprietário continua necessário?

O wizard deve configurar automaticamente os pares de atributos já previstos no modelo:

- **Admin gerencia** → afeta horas do proprietário;
- **Custo incluído** → afeta desembolso do proprietário.

## 16.5 Wizard de operação Airbnb

Criar um preenchimento guiado para usuários que não sabem estimar todos os custos operacionais.

Perguntas possíveis:

- haverá check-in presencial ou eletrônico?
- quem fará limpeza e lavanderia?
- haverá atendimento 24h/local?
- haverá tráfego pago ou marketing externo?
- haverá software/PMS/dynamic pricing?
- quais utilities serão pagos pelo anfitrião?
- qual duração média esperada das reservas?
- será cobrada taxa de limpeza do hóspede?

O wizard deve preencher defaults editáveis e mostrar sempre as premissas produzidas antes de aplicá-las.

## 16.6 Wizard de aquisição / venda do imóvel

Quando o modelo de posição inicial estiver implementado, criar um wizard específico para transições patrimoniais.

### Para quem tem dinheiro e pensa em comprar

Perguntar:

- capital disponível;
- preço máximo do imóvel;
- custos de compra;
- reforma;
- montagem/mobiliário;
- capital de giro desejado.

O wizard deve garantir que o custo total da estratégia não exceda silenciosamente o capital disponível.

### Para quem já tem imóvel e considera vender

Perguntar:

- valor de mercado estimado;
- saldo de financiamento, se houver;
- corretagem;
- custos de venda;
- eventual ganho de capital/imposto;
- capital líquido esperado após venda.
Esse capital líquido passa a ser o principal financeiro comparável.

## 16.7 Wizard de uso parcial do imóvel

Integrar futuramente com o Bloco 15.

Perguntas possíveis:

- o imóvel é moradia principal, segunda residência ou investimento dedicado?
- quantos dias por ano pretende usar pessoalmente?
- quais datas/períodos pretende bloquear?
- qual seria o custo de hotel/hospedagem evitado nesses períodos?
- precisará pagar hospedagem alternativa para colocar a própria residência no Airbnb?

O wizard deve configurar automaticamente disponibilidade, uso próprio e parâmetros de custo/benefício incremental.

## 16.8 Princípios de UX dos wizards

- permitir **pular** qualquer wizard e editar os campos manualmente;
- nunca esconder as premissas finais produzidas pelo wizard;
- permitir voltar etapas sem perder respostas;
- mostrar resumo antes de aplicar;
- permitir editar diretamente os valores gerados depois;
- não obrigar usuário experiente a passar pelo wizard;
- preservar importação/exportação JSON;
- registrar no JSON quais premissas vieram do wizard e quais foram alteradas manualmente, se isso puder ser feito sem complexidade excessiva;
- usar linguagem de decisão, não linguagem contábil/técnica quando não for necessária.

## 16.9 Arquitetura sugerida

Pensar em dois níveis distintos:

### Nível 1 — Wizard de cenários

Descobre:

- de onde o usuário está partindo;
- qual uso pretende dar ao imóvel;
- quais alternativas realmente deseja comparar.

Resultado: **conjunto de cenários habilitados**.

### Nível 2 — Wizards de premissas

Módulos independentes e reutilizáveis:

- investimento financeiro;
- administradora;
- operação Airbnb;
- aquisição/venda;
- uso parcial;
- eventualmente estudo de mercado/preço e ocupação.

Resultado: **preenchimento assistido das variáveis dos cenários**.

## 16.10 Integração futura com o módulo de estudo de mercado

O módulo de preço/ocupação do Bloco 14 pode funcionar também como um wizard especializado.

Fluxo possível:

1. usuário informa características do imóvel;
2. sistema pesquisa/recebe comparáveis;
3. apresenta faixa de diária, ocupação e RevPAR;
4. usuário escolhe cenário pessimista/base/otimista;
5. valores são aplicados à sazonalidade da simulação principal.

## Critérios de conclusão

- usuário consegue iniciar uma simulação sem conhecer previamente toda a estrutura financeira do modelo;
- os cenários irrelevantes não aparecem por padrão;
- a situação de partida determina corretamente quais custos de transição entram na comparação;
- wizards especializados convertem respostas simples em premissas explícitas e editáveis;
- nenhuma premissa fica escondida atrás do wizard;
- usuários avançados continuam podendo editar tudo manualmente;
- JSON exportado continua suficiente para reproduzir a simulação sem precisar repetir os wizards.

---

# Atualização adicional da ordem sugerida — Wizards

O Bloco 16 deve permanecer **próximo do fim do roadmap**, depois de estabilizados:

1. modelo econômico anual;
2. estrutura posse × gestão;
3. posição inicial “tenho imóvel” × “tenho dinheiro”;
4. uso parcial do imóvel;
5. projeção mensal/plurianual;
6. módulo de estudo de mercado.

Motivo: o wizard deve ser uma **camada de simplificação sobre um modelo já estável**. Implementá-lo cedo demais faria a interface cristalizar regras que ainda estão evoluindo e aumentaria muito o custo de manutenção.