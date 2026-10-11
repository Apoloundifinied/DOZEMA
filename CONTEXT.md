# CONTEXT.md — Fonte única de contexto (leia primeiro / read first)

> Mantenha curto e atual. Se algo aqui conflitar com outro doc, **este vence** e você avisa o Owner.

## 1. Identidade
- **Produto:** Dozena (nome de trabalho; ADR-002). Projeto **open source**, gratuito no MVP.
- **Tagline:** "Uma dúzia de devs. Quatorze dias. Todo mundo passa." / "A dozen devs. Fourteen days. Everyone gets through."
- **Owner:** uma pessoa, construindo com agentes de IA (Kimi K3) e a comunidade.
- **Interface:** bilíngue (PT-BR + EN) desde o dia 1.

## 2. O problema
Contas pessoais novas do Google Play (criadas após 13/11/2023) precisam rodar um **teste fechado com ≥ 12 testers por 14 dias contínuos** antes de pedir acesso à produção. Devs solo e vibecoders travam nisso. Já existem grupos gratuitos e serviços pagos; o diferencial da Dozena está no **formato de rodadas sincronizadas**: todos precisam da mesma janela ao mesmo tempo, então ninguém abandona no meio.
> A regra do Google pode mudar. Verificar na documentação oficial do Play Console antes de cada release.

## 3. Como funciona (30 segundos)
1. Dev entra com Google, cadastra seu app (nome, pacote, link de opt-in do teste fechado, link do Google Group) e **entra na fila**.
2. Um job forma uma **rodada** com 13–16 devs (prioridade a quem precisa da regra).
3. **Setup (48 h):** cada participante entra no grupo e faz opt-in no app dos outros pelo Google Play.
4. **Teste (14 dias):** check-ins (usar o app ≥ 2 dias) e feedback escrito em alguns apps.
5. **Folga (2 dias)** e encerramento. Cada dev aplica ao acesso à produção no Play Console.
6. Ranking de confiabilidade e de apps.

## 4. A Dozena NUNCA
Hospeda APK · promete aprovação do Google · compra/vende testers · incentiva avaliação pública na Play Store · coleta o Gmail dos participantes (o dev usa Google Group).

## 5. Parâmetros (fonte: `lib/config.ts`, ajustáveis)
| Constante | Valor |
|---|---|
| `ROUND_MIN_OWNERS` | 13 (13 apps → 12 testers por app) |
| `ROUND_TARGET_OWNERS` | 15 (margem para 2 desistências) |
| `ROUND_MAX_OWNERS` | 16 |
| `SETUP_HOURS` | 48 |
| `TEST_DAYS` | 14 |
| `BUFFER_DAYS` | 2 |
| `MIN_CHECKINS_PER_APP` | 2 (dias distintos) |
| `MIN_FEEDBACKS_PER_TESTER` | 3 (≥ 80 caracteres cada) |
| `HELPER_MAX_APPS` | 5 |
| `MAX_ACTIVE_APPS_PER_USER` | 1 por rodada |

## 6. Decisões travadas (detalhe em `DECISIONS.md`)
Troca por **rodadas** (créditos só depois) · nome Dozena (provisório) · **open source completo** (licença recomendada AGPL-3.0, a confirmar) · UI PT-BR+EN · entra qualquer um, **prioridade a quem precisa da regra** · MVP **grátis**; monetização decidida depois · Admin é P2.

## 7. Prioridades
- **P0 (MVP, obrigatório):** login Google · perfil · cadastro de app · fila · formação de rodada · setup/opt-in · check-in · feedback · e-mails essenciais · landing bilíngue · ranking simples · denúncia.
- **P1:** lembretes, substituição de desistentes, página pública da rodada, estatísticas do dev.
- **P2:** **painel de administração** (usuários, rodadas, apps, denúncias, banir) · exportar CSV.
- **Depois:** créditos/fila contínua, monetização, iOS (TestFlight).

## 8. Stack
Next.js (App Router, TS strict) · Tailwind · next-intl · Supabase (Postgres, Auth Google, RLS, RPC) · Vercel · Resend · Cloudflare Turnstile · Zod · Vitest · Playwright · GitHub Actions (CI + agendador do job). Detalhes: `docs/pt-BR/05-stack-integracoes.md`.

## 9. Estrutura de pastas (alvo)
```
app/[locale]/        páginas (landing, login, perfil, app, fila, rodada, ranking, admin)
app/api/cron/        job de rodadas (protegido por CRON_SECRET)
lib/config.ts        parâmetros
lib/rounds/          planRound() pura + testes
lib/validation/      Zod + regex de links do Google Play
lib/notify/          e-mails (bilíngues)
messages/            pt-BR.json, en.json
supabase/migrations/ SQL
```

## 10. Glossário
**Rodada:** grupo de devs que testam uns aos outros por 14 dias. **Owner:** dev com app na rodada. **Helper:** só testa (sem app). **Opt-in:** passo de entrar no teste pelo link do Google Play. **Check-in:** marcar que usou o app no dia. **Atribuição (assignment):** par tester → app.

## 11. Mapa de docs
`AGENTS.md` · `DECISIONS.md` · `ROADMAP.md` · `docs/pt-BR/01…14` · `docs/en/` · `supabase/migrations/0001_init.sql`.

## 12. Estado atual (atualize ao fim de cada sessão)
- Fase: **0 — validação** (lista de espera + piloto).
- Código: **bootstrap + landing de waitlist bilíngue (pt-BR/en) concluídos** (ADR-014). Build e testes (vitest) verdes; i18n via next-intl com rota `[locale]`, proxy com roteamento de locale, server action com Zod + Turnstile, migration `0002_waitlist.sql` com RLS (só insert anon, sem read).
- Publicado: https://dozema-nkdq.vercel.app/pt-BR (redirect /pt → /pt-BR ativo). Supabase em produção com `waitlist` (3 inscritos) + tabelas do MVP.
- Analítico próprio (Fase 0): tabela `events` (page_view/cta_click, RLS insert-only, sem cookies) + `/api/track` + `Tracker` no cliente. Smoke test: `node scripts/smoke-track.mjs`.
- Próximo passo: **aplicar migration `0003_events.sql` no SQL Editor do Supabase** e recrutar ≥ 26 devs em 10 dias (meta ADR-013: pivota se < 15).
- Pendências: confirmar nome (checar domínio/INPI) · confirmar licença (criar `LICENSE`, recomendada AGPL-3.0) · e-mail de segurança no SECURITY.md · ativar Turnstile em produção (chaves comentadas no .env).
