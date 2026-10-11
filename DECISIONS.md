# DECISIONS.md — Registro de decisões (ADR)

- **ADR-001 · 2026-10-11 · Produto:** troca de testers para a regra 12/14 do Google Play. Fluxo de dois lados simples, sem marketplace. Motivo: problema do próprio meio, fácil de construir, funil de conteúdo vende. Status: travada.
- **ADR-002 · 2026-10-11 · Nome:** "Dozena" (provisório). Checar domínio, redes e INPI antes de fixar. Status: PENDENTE.
- **ADR-003 · 2026-10-11 · Mecanismo:** **rodadas de 14 dias** como padrão (recomendação aceita). Créditos/fila contínua ficam como extra futuro. Motivo: todos precisam da mesma janela, o que resolve o abandono. Status: travada.
- **ADR-004 · 2026-10-11 · Código aberto:** open source completo. Licença **confirmada: AGPL-3.0-or-later** (impede clones fechados como serviço); alternativa avaliada: MIT. Arquivo `LICENSE` criado em 2026-10-13. Docs sob CC BY 4.0. Status: travada.
- **ADR-005 · 2026-10-11 · Idioma:** UI bilíngue PT-BR + EN desde o início; docs principais em EN também. Status: travada.
- **ADR-006 · 2026-10-11 · Quem entra:** qualquer pessoa; prioridade na fila a quem declara precisar da regra. Status: travada.
- **ADR-007 · 2026-10-11 · Monetização:** decidir depois. MVP 100% grátis, sem pagamento no código. Status: travada.
- **ADR-008 · 2026-10-11 · Entrega do app:** a Dozena nunca hospeda APK; só links do Google Play validados. Motivo: segurança (o Google verifica o app) e simplicidade. Status: travada.
- **ADR-009 · 2026-10-11 · Prova de teste:** check-in + feedback escrito (sem API do Google para confirmar testers). Status: travada.
- **ADR-010 · 2026-10-11 · Grupo de testers:** o dev usa um Google Group; a Dozena não coleta Gmail. Status: travada.
- **ADR-011 · 2026-10-11 · Stack:** Next.js + Supabase + Vercel + Resend + next-intl. Status: travada.
- **ADR-012 · 2026-10-11 · Admin:** painel de administração é P2, só depois do P0. Status: travada.
- **ADR-013 · 2026-10-11 · Critério de parada:** se a lista de espera < 15 em 10 dias ou o piloto completar < 60%, pivotar para troca de feedback geral (ou parar). Status: travada.
- **ADR-014 · 2026-10-13 · Bootstrap do MVP:** primeiro PR de código = scaffold do Next.js (App Router, TS strict, Tailwind) + landing de lista de espera (e-mail apenas). Dependências aprovadas: `next`, `react`, `react-dom`, `tailwindcss`, `next-intl`, `@supabase/supabase-js`, `zod`; dev: `typescript`, `eslint`, `vitest`. Motivo: a Fase 0 exige a waitlist no ar, e bootstrap+landing é o menor entregável útil. Qualquer dependência além desta lista exige ADR novo. Status: travada.
