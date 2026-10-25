# V39 — Diferença de workload entre Essencial e Premium

Data: 25/10/2026  
Issue: #55

## Problema

Essencial e Premium estavam usando o mesmo conjunto de atividades `adminManages=true`, o que fazia ambos aparecerem com 1 h/mês de trabalho do proprietário.

## Correção

### Essencial

A administradora continua gerenciando:
- marketing/comercial;
- reservas/pré-venda;
- atendimento ao hóspede;
- suporte local;
- check-in/check-out;
- PMS/software;
- pricing.

O proprietário continua gerenciando:
- limpeza;
- lavanderia;
- amenidades/consumíveis.

### Premium

Todas as atividades acima, inclusive limpeza, lavanderia e amenidades, ficam marcadas como gerenciadas pela administradora.

## Resultado default

Imóvel próprio:
- Essencial: aproximadamente **13,86 h/mês**;
- Premium: **1,00 h/mês**.

A diferença vem das horas por reserva das tarefas operacionais mantidas no Essencial.

## Compatibilidade

A migração V38 → V39 só altera perfis Essencial legados que ainda reproduzem exatamente o antigo preset indiferenciado. Se o usuário já customizou a distribuição de tarefas, o perfil é preservado.

## Verificação

Suíte completa: **36/36 testes**.

Teste específico: `tests/admin-workload-v39.test.js`.
