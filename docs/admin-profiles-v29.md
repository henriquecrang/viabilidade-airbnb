# V29 — Perfis independentes Essencial × Premium

Data: 24/10/2026  
Issue: #45

## Objetivo

Permitir comparar os dois planos da administradora simultaneamente sem transformar Essencial/Premium em hard-code econômico separado do motor posse × gestão.

## Arquitetura

A V29 preserva o motor V27 e adiciona uma camada de **perfis de gestão**.

Perfis:
- `essential`;
- `premium`.

Cada perfil persiste independentemente:
- comissão;
- ajuste adicional de ocupação do perfil (delta em p.p. ou piso-alvo), separado do delta global de gestão da V31;
- impacto de diária;
- mensalidade e onboarding;
- supervisão residual;
- regra de limpeza e divisão;
- atividades gerenciadas;
- custos incluídos;
- manutenção;
- pagamento e titularidade de CAPEX.

## Compatibilidade

Premium preserva os IDs históricos:
- `airbnb-admin`;
- `airbnb-rented-admin`.

Essencial adiciona:
- `airbnb-admin-essential`;
- `airbnb-rented-admin-essential`.

Desde a V31, o delta global de gestão é aplicado independentemente do preset Essencial/Premium. O wizard de plano guarda apenas ajustes adicionais, evitando duplicar o default de +20 p.p.

Depois da configuração, a categoria “com administradora” do wizard principal se expande para as duas variantes de gestão.

## Edição

O plano atualmente ativo continua ligado aos controles detalhados do simulador. Se o usuário editar esses campos e depois trocar de plano no wizard, a configuração ativa é capturada antes da troca.

O outro plano usa seu perfil persistido; se nunca tiver sido personalizado, parte do preset oficial V28.

## Horizonte

As projeções de 1, 3 e 5 anos aplicam cada perfil antes da inflação anual e calculam os dois planos separadamente nos regimes próprio e alugado.

## Verificação

Suíte completa: **29/29 testes**.

Teste específico: `tests/admin-profiles-v29.test.js`.
