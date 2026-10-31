# Nova simulação guiada — Issue #59

## Experiência

Botão adicional **Criar nova simulação guiada**. Abre um pop-in independente dos wizards existentes. O usuário pode baixar o JSON atual antes de começar, iniciar sem baixar ou cancelar. Uma pergunta por tela, com Voltar e Continuar. Ao final, a revisão permite editar respostas e **Criar simulação** aplica o novo preset e fecha o pop-in.

O estado ativo não é alterado durante o questionário. Fechar, Escape ou Cancelar descarta o rascunho. O rascunho não é salvo entre recarregamentos. O estado final usa o autosave e a exportação/importação já existentes.

## Caminhos

| Etapa | Ramificação |
| --- | --- |
| Ponto de partida | Imóvel próprio; capital para compra; alugar imóvel de terceiro para operar temporada |
| Modalidade | Temporada; tradicional; comparar ambos. Arbitragem segue diretamente para temporada |
| Gestão da temporada | Autogestão; administradora; comparar |
| Plano | Essencial; Premium; ambos |
| Uso próprio | Renda exclusiva; ocasional; moradia. Pergunta dias por período quando aplicável |
| Alternativas | Investimento financeiro e imóvel parado para imóvel próprio/compra |
| Imóvel | Valor de mercado; ou capital/preço/custos/fontes de compra; ou contrato/caução/encargos do imóvel alugado |
| Receitas | Sazonalidade de referência ou diária/ocupação por período; estadia/taxas; aluguel tradicional se selecionado |
| Custos | Somente itens atribuídos aos caminhos escolhidos; encargos repassados ou pagos pelo proprietário/locatário |
| Trabalho | Horas por tarefa só quando autogestão ou Essencial mantêm a atividade com o usuário; supervisão da administradora |
| Comparação | Valor/hora, horizonte 1/3/5, inflação, valorização, benchmark financeiro e conversão de venda quando aplicável |

## Decisões de produto adotadas

- **Criar uma nova simulação**, em vez de editar a atual. A fonte é o cenário-base mais as respostas; não se herdam personalizações antigas.
- Nenhuma abertura automática ao carregar a página: entrada apenas pelo novo botão.
- Perfil e estratégias exigem escolhas explícitas. Nos números, Continuar confirma a referência exibida, com botão para restaurá-la.
- Sazonalidade pode ser mantida ou preenchida período por período; não se cria uma média anual que apague o desenho sazonal.
- Operação detalhada pode ser preenchida item por item ou mantida com referências expostas na revisão.
- Seguro/IPTU/TCL são perguntados por ano e convertidos para o valor mensal interno; contas de consumo e condomínio são mensais.
- O seguro padrão foi atualizado em 31/10/2026, por solicitação do usuário, para R$ 300/ano (R$ 25/mês). O fluxo lê essa referência dos defaults e permite editá-la. Configurações já salvas mantêm seus valores.
- O benchmark continua presente economicamente mesmo se seu card não estiver selecionado. Por isso seus parâmetros e, para imóvel próprio, custos de venda são coletados.
- No aluguel tradicional, há uma escolha simples para condomínio/IPTU/TCL: inquilino ou proprietário. Em arbitragem: só consumo; consumo+condomínio; consumo+condomínio+IPTU/TCL. Divisões específicas permanecem editáveis na tabela.
- Comparação Premium ou Essencial isolado respeitada também nos resultados detalhados; os antigos assistentes mantêm sua expansão por categoria.
- Identidade/endereço/características e comparáveis do imóvel-base são retirados do novo preset para não aparentarem evidência sobre outro imóvel.
- Referências numéricas continuam identificadas como cenário-base Rio/outubro de 2026. Não há nova busca de mercado.
- Final do horizonte continua com a estratégia. Saída, residual, dedutibilidade e ajustes mais específicos permanecem nos controles existentes; as referências adicionais são mostradas na revisão.
- Compra insuficientemente financiada bloqueia a aplicação. Fontes adicionais nunca são inventadas. Ocupação administrada abaixo do delta informado exige corrigir a inconsistência.
- Uso próprio remove dias da oferta. Benefícios de consumo são opcionais e separados de receita. Custos híbridos detalhados continuam disponíveis no assistente especializado.

## Implementação

`guided-preset.js` contém perguntas declarativas, montagem pura do preset e controle do pop-in. A montagem começa de uma cópia dos defaults, aplica somente perguntas ativas e usa os patches de aquisição, administração e wizard principal existentes. Respostas de ramos abandonados ficam no rascunho ao voltar, mas não alteram campos de caminhos inativos.

A integração em `app.js` apenas fornece exportação, aplicação, autosave e renderização. O filtro exato de cenários é opcional e só é usado pela nova configuração. Não houve mudança nas fórmulas econômicas nem na versão do esquema JSON (44); os metadados de configuração são adicionais e compatíveis com a normalização existente.

`guidedSetup.preset` registra versão do fluxo, respostas, referências mantidas/confirmadas e valores informados. Depois da aplicação, o estado detalhado é a fonte de verdade; esse registro descreve a criação inicial, não substitui edições posteriores.

## Verificação

- 42 arquivos de teste passaram (41 preexistentes e o novo teste do fluxo).
- `node tests/guided-preset.test.js`: 27 combinações de situação/gestão/plano, projeções 1/3/5, seleção exata, ramificações, fontes de compra, conversão anual/mensal, uso pessoal, taxas independentes e rejeição de valores inválidos.
- Verificação no navegador: abertura, backup JSON, retorno, validação de número inválido, edição na revisão, aplicação/retorno à tela principal e cancelamento preservando a simulação anterior; assistente antigo continua acessível. Também foi validada a troca de Premium para ambos os planos na revisão, com inclusão das perguntas de horas do Essencial e dois cards no resultado.
