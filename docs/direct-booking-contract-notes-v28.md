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

## Implicação para o simulador

Esses elementos pertencem principalmente à Issue #30 (mix de canais):
- canal direto pode ter custo de plataforma diferente ou zero;
- pode exigir contrato/checklist próprios;
- pode ter política própria de cancelamento;
- risco/seguro pode ser diferente do Airbnb/AirCover.

O valor, imóvel, serviços e condições deste contrato específico não devem ser usados como comparável de preço para o apartamento-base.
