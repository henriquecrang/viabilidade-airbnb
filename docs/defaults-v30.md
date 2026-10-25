# V30 — Recalibração dos defaults de ocupação e trabalho

Data: 25/10/2026  
Issue: #47

## Objetivo

Representar a autogestão default como uma operação ainda **manual**, sem presumir automações e otimizações que um proprietário mais organizado pode implementar depois.

## Ocupação autogerida

| Período | Ocupação V30 |
| --- | ---: |
| Réveillon | 100% |
| Verão | 75% |
| Carnaval | 100% |
| Outono | 55% |
| Inverno | 50% |
| Primavera | 55% |

Resultado ponderado: **59,55%** ou **217,35 noites/ano**.

Com estadia média de 5,6 noites: **38,81 reservas/ano**.

## Trabalho manual por reserva

| Atividade | Horas/reserva |
| --- | ---: |
| Lavanderia de cama/banho | 2,0 h |
| Limpeza — coordenação/acompanhamento | 0,5 h |
| Amenidades e consumíveis | 0,5 h |
| Check-in / check-out presencial | 1,0 h |
| **Total variável** | **4,0 h** |

As horas mensais gerais anteriores foram mantidas nesta rodada. Somadas ao trabalho variável, o cenário-base estima **263,25 h/ano**, equivalentes a **21,94 h/mês**.

## Gestão profissional

O antigo piso fixo de 80% foi substituído por **+20 pontos percentuais sobre cada período autogerido**, limitado a 100%.

Com a sazonalidade acima:
- Réveillon: 100%;
- Verão: 95%;
- Carnaval: 100%;
- Outono: 75%;
- Inverno: 70%;
- Primavera: 75%.

Resultado ponderado: **78,95%**. O ganho agregado fica ligeiramente abaixo de 20 p.p. porque Réveillon e Carnaval já estão no teto de 100%.

O uplift default de ADR permanece **0%**.

## Migração

A V29 → V30 é aplicada automaticamente somente quando o arquivo/autosave corresponde ao antigo cenário-base intacto:
- ocupações V29 ainda inalteradas;
- horas por reserva V29 ainda inalteradas;
- proposta da administradora ainda não configurada.

Qualquer simulação customizada preserva suas próprias premissas.

## Verificação

Suíte completa: **30/30 testes**.

Teste específico: `tests/defaults-v30.test.js`.
