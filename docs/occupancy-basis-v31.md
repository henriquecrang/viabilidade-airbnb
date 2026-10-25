# V31 — Ocupação bidirecional e delta de gestão calibrável

Data: 25/10/2026  
Issue: #48

## Problema

A ocupação sazonal era implicitamente tratada como autogestão e o ganho de gestão estava embutido no perfil da administradora. Isso tornava ambíguo usar dados observados já sob gestão profissional e podia duplicar o +20 p.p. entre a base e o preset.

## Modelo V31

O usuário escolhe se os percentuais visíveis representam:
- `self`: autogestão / sem administradora;
- `admin`: operação com administradora.

`airbnb.managementOccupancyDeltaPp` representa a diferença esperada trazida pela gestão profissional. Default: **20 p.p.**

### Armazenamento canônico

`seasons[].occupancyPct` continua armazenando **autogestão**. A base escolhida é apenas uma lente de entrada e exibição. Isso torna a troca reversível mesmo quando a ocupação administrada satura em 100%.

### Conversão

- autogestão → admin: `min(100, self + delta)`;
- entrada já administrada → autogestão canônica: `max(0, admin informado - delta)`.

Trocar a lente não altera o valor canônico nem a economia do cenário.

## Perfis Essencial/Premium

Os campos de impacto de ocupação do perfil continuam disponíveis como **ajustes adicionais**. O preset oficial começa em 0 p.p. adicional, porque o default +20 p.p. já está na camada global.

## Migração V30 → V31

A migração cria a base `self`, move o impacto total antigo para o delta global quando necessário e transforma impactos de perfil em diferenças adicionais, evitando duplicar presets V30 já configurados.

## Interface

A tabela sazonal passa a exibir:
- ocupação informada, com sua base no cabeçalho;
- ocupação derivada no outro regime;
- receita de diárias da autogestão, que continua sendo a base canônica.

Teste específico: `tests/occupancy-basis-v31.test.js`.
