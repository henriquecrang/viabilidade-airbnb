# Metodologia de comparáveis para diária, ocupação e RevPAR

Atualizado em: 24/10/2026  
Issue: #16  
Parent epic: #15

## 1. Objetivo

Estimar, de forma auditável, as premissas de mercado de uma unidade de locação por temporada:

- diária anunciada;
- diária efetivamente realizada, quando a fonte permitir;
- ocupação;
- RevPAR;
- sazonalidade;
- faixa pessimista / base / otimista.

O módulo de mercado **não altera automaticamente** a simulação principal. Ele produz uma sugestão acompanhada dos comparáveis, da fonte, da data e das transformações utilizadas.

## 2. Separar observação, estimativa e premissa

Cada valor precisa carregar um tipo:

1. **observado** — vem diretamente de uma fonte identificável;
2. **estimado pela fonte** — produzido por algoritmo de terceiro (ex.: booked × blocked);
3. **derivado** — calculado pelo nosso sistema a partir de valores observados/estimados;
4. **premissa do simulador** — decisão explícita do usuário ou default.

Nunca apresentar uma estimativa como se fosse observação direta.

## 3. Fontes

### 3.1 AirDNA / fonte especializada equivalente

Uso preferencial quando disponível para:
- ocupação ajustada;
- noites reservadas;
- noites disponíveis;
- ADR;
- RevPAR;
- receita;
- comparáveis;
- histórico mensal.

Definições relevantes em 2026:
- ocupação de mercado = noites reservadas / noites disponíveis;
- dias bloqueados pelo proprietário são excluídos da disponibilidade;
- ADR da AirDNA inclui diária + taxa de limpeza;
- RevPAR combina receita e noites disponíveis;
- a AirDNA informa que usa sinais adicionais para diferenciar noites reservadas de bloqueios de calendário.

Fontes:
- https://help.airdna.co/en/articles/8062178-how-does-airdna-calculate-occupancy-rate
- https://help.airdna.co/en/articles/8062173-how-does-airdna-calculate-average-daily-rate-adr
- https://help.airdna.co/en/articles/8062179-what-is-revpar
- https://help.airdna.co/en/articles/8374548-how-does-airdna-calculate-revenue
- https://apidocs.airdna.co/

### 3.2 Inside Airbnb

Fonte aberta útil para:
- universo de anúncios;
- localização aproximada;
- tipo de propriedade/quarto;
- quartos, camas e capacidade;
- preço anunciado;
- reviews e atividade recente;
- disponibilidade declarada;
- recortes por bairro.

O Rio de Janeiro possui snapshot disponível de 22/09/2026 com listings, calendar e reviews.

**Limitação crítica:** o Inside Airbnb declara que o calendário da plataforma não permite distinguir noite reservada de noite bloqueada pelo anfitrião. Portanto, `unavailable` **não deve ser convertido diretamente em ocupação**.

Fontes:
- https://insideairbnb.com/get-the-data/
- https://insideairbnb.com/data-assumptions/

### 3.3 Airbnb / Booking / Vrbo observados manualmente

Uso permitido para:
- preço anunciado em datas específicas;
- taxa de limpeza e outras taxas visíveis;
- estadia mínima;
- capacidade;
- amenidades;
- qualidade/posicionamento do anúncio;
- disponibilidade futura.

Não inferir ocupação histórica apenas olhando dias indisponíveis.

### 3.4 Propostas de administradoras e operação real

Dados de administradoras, PMS ou proprietários podem entrar como fonte adicional quando trouxerem:
- histórico de reservas;
- ADR;
- ocupação;
- receita;
- calendário de bloqueios;
- sazonalidade.

Registrar origem e período. Não generalizar um imóvel isolado como mercado inteiro.

## 4. Definições internas

### Preço anunciado
Preço público de uma noite futura, sem pressupor que houve reserva.

### Diária média de acomodação

```
receita de diárias / noites ocupadas
```

Não inclui taxa de limpeza.

### ADR total

```
(diárias + taxas cobradas do hóspede) / noites ocupadas
```

Quando importarmos ADR da AirDNA, marcar que sua definição inclui taxa de limpeza e fazer a ponte para ADR total, não silenciosamente para a diária de acomodação.

### Ocupação ajustada

```
noites reservadas / noites efetivamente disponíveis
```

Dias de uso próprio, manutenção e bloqueios deliberados não entram no denominador.

### Ocupação de calendário

```
noites reservadas / dias totais do período
```

Manter separada da ocupação ajustada.

### RevPAR de acomodação

```
receita de diárias / noites disponíveis
```

### RevPAR total

```
receita total / noites disponíveis
```

## 5. Perfil do imóvel-alvo

O comparador deve registrar, no mínimo:

- latitude/longitude ou endereço;
- bairro;
- tipo de unidade;
- imóvel inteiro / quarto;
- número de quartos;
- banheiros;
- capacidade de hóspedes;
- camas;
- metragem, quando disponível;
- andar;
- elevador;
- garagem;
- ar-condicionado;
- vista / frente / fundos;
- cozinha;
- máquina de lavar;
- qualidade/acabamento;
- estadia mínima;
- dias que o proprietário pretende disponibilizar.

## 6. Seleção de comparáveis

### 6.1 Filtros duros

Preferir inicialmente:
- mesma categoria (`entire home`, quando aplicável);
- mesmo número de quartos;
- capacidade de hóspedes com diferença máxima de 1;
- localização próxima;
- anúncio com sinais recentes de atividade.

Não misturar quarto privado com apartamento inteiro.

### 6.2 Expansão geográfica

**Decisão de modelagem do projeto:**

1. começar em raio de 500 m;
2. se houver menos de 15 comparáveis válidos, expandir para 1 km;
3. se ainda houver menos de 15, expandir para 2 km;
4. acima de 2 km, exigir sinalização explícita de baixa comparabilidade.

No Rio, barreiras urbanas e micro-localizações importam. Distância linear não substitui bairro, praia, morro, acesso ao metrô ou qualidade da quadra.

### 6.3 Tamanho da amostra

**Decisão de modelagem do projeto:**
- mínimo operacional: 15;
- alvo: 25;
- acima de 40, priorizar os 25 mais semelhantes em vez de simplesmente aumentar a amostra.

A API da AirDNA oferece até 25 propriedades comparáveis; isso não é tratado como prova de que 25 seja estatisticamente ótimo, apenas como referência operacional coerente.

## 7. Ranking de similaridade

Modelo inicial (pesos de produto, não fatos de mercado):

| Dimensão | Peso |
|---|---:|
| localização/distância | 25% |
| tipo + quartos | 25% |
| capacidade/camas/banheiros | 15% |
| ar-condicionado/elevador/garagem | 10% |
| qualidade/acabamento | 10% |
| rating/reviews/atividade recente | 10% |
| estadia mínima/disponibilidade | 5% |

O score deve ser explicável: o usuário precisa conseguir ver por que um imóvel entrou ou saiu do conjunto.

## 8. Tratamento de outliers

Não remover automaticamente um anúncio apenas por ser caro ou barato.

Fluxo:
1. detectar valores extremos por IQR/MAD;
2. marcar como outlier;
3. verificar se há explicação observável (luxo, vista, piscina, quarto extra, evento, erro);
4. excluir apenas com motivo registrado.

Para centro da distribuição, preferir **mediana**. Exibir também P25/P75.

## 9. Sazonalidade

Calcular por mês sempre que a fonte permitir.

No Rio, eventos extraordinários como Réveillon e Carnaval devem ser tratados como **janelas explícitas**, e não dissolvidos na média mensal se houver dados suficientes.

Não assumir que preço anunciado futuro representa preço realizado histórico.

## 10. Faixas de cenário

Para cada período:

- **pessimista:** P25 dos comparáveis robustos;
- **base:** mediana;
- **otimista:** P75.

Para ocupação, usar percentis apenas quando a fonte realmente sustentar booked/available.

Se a ocupação vier de fonte fraca, mostrar intervalo de incerteza maior ou solicitar premissa manual.

## 11. Evidência mínima armazenada

Cada comparável deve preservar:

- ID/URL da fonte;
- plataforma/fonte;
- data da coleta;
- coordenadas aproximadas;
- atributos usados no score;
- preço/ADR/ocupação conforme disponíveis;
- definição da métrica;
- score de similaridade;
- flags de outlier;
- motivo de exclusão, se houver.

Cada estimativa agregada deve guardar:
- conjunto de comparáveis;
- data;
- método;
- N;
- raio;
- mediana;
- P25/P75;
- fonte da ocupação;
- observações de qualidade.

## 12. Regra de integração com o simulador

O módulo de mercado gera uma **proposta de premissas**.

A interface deve mostrar:
- valores atuais;
- valores sugeridos;
- fonte/metodologia;
- comparáveis;
- ação explícita **Aplicar à simulação**.

Nunca sobrescrever diária, ocupação ou sazonalidade em silêncio.

## 13. Limitações

- scraping/calendário público não revela necessariamente reservas;
- métricas de fornecedores podem ser estimadas por modelos proprietários;
- um preço futuro não é receita realizada;
- um anúncio sem reviews recentes pode estar ativo de forma irregular;
- eventos extraordinários podem contaminar médias;
- comparáveis geograficamente próximos podem pertencer a micro-mercados diferentes.

A interface deve preferir dizer “evidência insuficiente” a produzir uma estimativa com falsa precisão.
