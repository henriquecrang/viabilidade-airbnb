# Snapshot de mercado do imóvel-base — outubro/2026

Atualizado em: 24/10/2026  
Imóvel-alvo: Rua Maestro Francisco Braga, 76, apto 405 — Copacabana / Bairro Peixoto  
Versão do simulador: V23

## Objetivo

Preencher o módulo de mercado com evidência pública real sem alterar silenciosamente as premissas econômicas do cenário-base.

O conjunto serve para **sugerir** diária e documentar a oferta local. A aplicação de P25/mediana/P75 continua exigindo ação explícita do usuário na interface.

## Fontes estruturais

### Inside Airbnb

O snapshot público mais recente encontrado para o Rio de Janeiro é de **22/09/2026**. Ele é útil para universo de anúncios, localização aproximada, tipo, quartos, preço anunciado, reviews e atividade.

Não usamos indisponibilidade de calendário do Inside Airbnb como ocupação, porque a fonte não permite distinguir com segurança noites reservadas de noites bloqueadas pelo anfitrião.

Fonte:
- https://insideairbnb.com/get-the-data/
- https://insideairbnb.com/data-assumptions/

### Residencial Peixoto

O endereço-base corresponde ao Residencial Peixoto. A página pública do condomínio registra apartamentos a partir de 34 m², unidades de 1 quarto e **elevador**. Isso sustenta a atualização de `market.subject.elevator` para `yes`.

Fonte:
- https://www.quintoandar.com.br/condominio/residencial-peixoto-copacabana-rio-de-janeiro-dv7sggmwod

Nenhum valor de condomínio/IPTU do simulador foi alterado com base nessa página: esses itens dependem da unidade específica e permanecem premissas independentes.

## Evidência de curta duração

O snapshot V23 contém **19 comparáveis elegíveis** pelos filtros duros atuais e **14 com preço público**.

A amostra de preço fica deliberadamente marcada como **insuficiente** frente ao mínimo operacional de 15. Não foi incluído um 15º valor fraco apenas para atingir o limiar.

### Mesmo prédio / mesma rua

- **Maestro Francisco Braga 76 — Juano Tours**: 1 quarto, 4 pessoas, recém-renovado; a descrição informa **R$ 380/noite + R$ 180 de taxa de serviço**, embora o cabeçalho mostre R$ 450/dia. O simulador armazena R$ 380 como diária e preserva a divergência na nota de evidência.
  - https://juanotours.com.br/tours/apartamentos/copacabana/maestro-francisco-braga-76/
- **Oásis em Copacabana — Residencial Peixoto**: Airbnb no mesmo Residencial Peixoto, 51 m², 1 quarto, 2 hóspedes, 2 camas, rating 5,0. Sem preço público sem datas; entra apenas como evidência de oferta/atributos.
  - https://www.airbnb.com.br/rooms/1617000716467540808
- **Brisa do Peixoto!**: Airbnb na Rua Maestro Francisco Braga, 1 quarto, 2 hóspedes, rating 5,0 com 13 avaliações. Sem preço público.
  - https://www.airbnb.com.br/rooms/1425439030218835876

### Bairro Peixoto

Também foram preservados anúncios Airbnb no Bairro Peixoto sem preço público, úteis para atributos, reviews e confirmação de oferta local:
- https://www.airbnb.com.br/rooms/822933221852279797
- https://www.airbnb.com.br/rooms/1799361479339616502
- https://www.airbnb.com.br/rooms/1772689317426025304

### Entorno próximo com diária pública

Foram usados anúncios/diárias públicas em Rua Santa Clara, Rua Anita Garibaldi e Rua Pompeu Loureiro. Cada linha guarda a URL e a data de coleta/referência. Entre as fontes:
- https://www.yestemporada.com/pt/apartment/PP19J/vacation-rental-in-copacabana-sleeps-2
- https://www.exploraai.com.br/hotel/kitnet-em-copacabana-no-po
- https://www.exploraai.com.br/hotel/studio-for-2-people-steps-from-copacabana-beach
- https://www.exploraai.com.br/hotel/adoravel-studio-copacabana
- https://www.exploraai.com.br/hotel/studio-santa-clara-rio-de-janeiro12
- https://www.exploraai.com.br/hotel/bemvindo
- https://www.exploraai.com.br/hotel/brisa-de-copa
- https://www.exploraai.com.br/hotel/apartment-in-the-heart-of-copacabana-beach-street
- https://www.exploraai.com.br/hotel/studio-copacabana-rio-de-janeiro1234
- https://www.exploraai.com.br/hotel/laris-rio-copacabana-apto-1-quarto-e-piscina-no-oneflat
- https://www.hospedapluss.com.br/pt/apartment/GK06J
- https://www.exploraai.com.br/hotel/flat-2-quadras-praia-2-min-metro-com-garagem
- https://www.exploraai.com.br/hotel/flat-copacabana-rio-de-janeiro19

## Resultado descritivo do snapshot

Com os **14 preços** atualmente armazenados:

- P25: **R$ 278,38**
- mediana: **R$ 348,50**
- P75: **R$ 519,25**
- evidência de ocupação: **0 comparáveis**

Esses números misturam datas de estadia diferentes e propriedades com diferenças de amenidades. Portanto são uma **faixa observacional de preços anunciados/de referência**, não uma estimativa de ADR realizado.

Os flats da Rua Pompeu Loureiro 99 possuem piscina/sauna/garagem e aparecem mais caros em parte da amostra; o score de similaridade e as notas preservam essa diferença em vez de removê-los silenciosamente como outliers.

## Decisões de integração

1. O snapshot é carregado no cenário-base V23.
2. Simulações V22 do cenário-base com lista vazia recebem o snapshot na migração.
3. Simulações customizadas preservam sua própria lista.
4. Nenhum percentil é aplicado automaticamente.
5. A interface mostra separadamente:
   - comparáveis elegíveis;
   - comparáveis com diária;
   - P25/mediana/P75;
   - ocupação com evidência;
   - link de evidência por linha.
6. A confiança de preço permanece baixa enquanto houver menos de 15 observações de diária.
7. A ocupação permanece sem sugestão até existir uma fonte que sustente booked/available.

## Próximos passos possíveis

- aumentar a amostra de preço com comparáveis de 1 quarto ainda mais próximos e com data homogênea;
- obter uma fonte de ocupação confiável (AirDNA, PMS/administradora ou dados operacionais);
- separar melhor amenidades estruturais (piscina, garagem, vista) no score;
- tratar outliers por IQR/MAD com justificativa explícita, como previsto em `docs/market-methodology.md`.
