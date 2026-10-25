# Notas do contrato de hospedagem direta recebido em 24/10/2026

## Classificação

O arquivo recebido é um **contrato entre proprietário e hóspede/locatário para hospedagem temporária**. Não é contrato entre proprietário e administradora.

A própria administradora explicou, em mensagem separada, que usa esse documento quando fecha reservas fora do Airbnb; reservas via Airbnb seguem as regras da plataforma.

Por privacidade, o PDF original **não deve ser commitado no repositório público**, pois contém dados pessoais e documento de identificação de terceiro.

## Elementos úteis para a futura modelagem de canal direto

Sem reproduzir dados pessoais, o modelo contém:
- prazo determinado de hospedagem e regra de renovação;
- preço fechado para um período, incluindo despesas e serviços específicos;
- política de não devolução por saída antecipada, com exceção indicada para problema estrutural não solucionado;
- vistoria/checklist de entrada e saída;
- inventário de móveis, equipamentos e enxoval;
- obrigações de conservação e restituição;
- proibição de sublocação/cessão e de uso comercial;
- responsabilização por danos;
- foro eleito.

## Relato operacional da administradora

No áudio complementar recebido junto com as respostas oficiais, a administradora informou que:
- usa esse tipo de contrato apenas quando a reserva é fechada **fora do Airbnb**;
- no Airbnb, segue as regras da própria plataforma e não usa esse contrato;
- no canal direto, costuma enviar o contrato ao hóspede e obter concordância informal por mensagem/WhatsApp, sem exigir assinatura física;
- recomenda ao proprietário manter um seguro anual do imóvel para cobrir ocorrências mais sérias;
- mencionou uma faixa aproximada de **R$ 250–300/ano** para esse seguro;
- afirmou nunca ter precisado acionar o AirCover em aproximadamente quatro anos de operação.

Esses pontos são **relato operacional**, não cotação de mercado nem garantia de cobertura. O valor de R$ 250–300/ano não deve virar default automático sem pesquisa específica de seguro e cobertura.

## Implicação para o simulador

Esses elementos pertencem principalmente à Issue #30 (mix de canais):
- canal direto pode ter custo de plataforma diferente ou zero;
- pode exigir contrato/checklist próprios;
- pode ter política própria de cancelamento;
- risco/seguro pode ser diferente do Airbnb/AirCover;
- pode existir custo anual de seguro específico fora da proteção da plataforma;
- pode haver tempo administrativo adicional para contrato, mensagens, vistoria e cobrança.

O valor, imóvel, serviços e condições deste contrato específico não devem ser usados como comparável de preço para o apartamento-base.
