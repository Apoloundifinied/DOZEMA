# 04 · Arquitetura (detalhada)

## 1. Visão geral
```
 Dev (browser, PT-BR/EN)
        │ HTTPS
        ▼
 ┌──────────────── Next.js (Vercel) ────────────────┐
 │  app/[locale]/*  (páginas, Server Actions)       │
 │  app/api/cron/rounds  (job, protegido)           │
 │  lib/rounds (planRound pura) · lib/notify        │
 └───────┬──────────────────────┬───────────────────┘
         │                      │
   Supabase                  Resend
   Postgres + Auth(Google)   e-mails bilíngues
   RLS + RPC
         ▲
 GitHub Actions (agenda: chama /api/cron/rounds a cada hora)
```
Princípio: **um app, um banco, sem microserviços.** A lógica crítica é função pura testável.

## 2. Componentes
| Componente | Responsabilidade |
|---|---|
| `app/[locale]` | Telas e ações do servidor |
| `lib/rounds/planRound.ts` | Decide quem entra na rodada e quem testa quem |
| `lib/validation` | Zod + regex dos links |
| `lib/notify` | Templates e envio |
| `supabase/` | Tabelas, RLS, RPC |
| `/api/cron/rounds` | Forma rodadas, avança fases, encerra, envia lembretes |

## 3. Fluxos
**Cadastro:** login Google → trigger cria `profiles` → onboarding (handle, país, idioma, needs_rule).
**Fila:** insere em `queue_entries` (`waiting`), com Turnstile.
**Formação (job, de hora em hora):**
1. `waiting` → `planRound()`. Se retornar `null`, nada acontece.
2. Em uma transação com service role: cria `rounds` (`setup`), `round_participants`, `assignments`; marca `queue_entries` como `placed`; envia e-mails.
**Avanço de fases (mesmo job):** `setup → testing` quando `setup_ends_at` passa (quem não fez opt-in vira `dropped`); `testing → buffer`; `buffer → finished` (calcula reputação).
**Testing:** `confirm_step`, `check_in`, `submit_feedback` (RPCs).

## 4. Algoritmo `planRound` (pura, sem I/O)
Entrada: entradas `waiting` + config. Saída: plano ou `null`.
```ts
type Entry = { id: string; profileId: string; role: 'owner'|'helper'; appId?: string;
               needsRule: boolean; createdAt: Date };
type Plan = { owners: Entry[]; helpers: Entry[]; pairs: { testerId: string; appId: string }[] };

function planRound(waiting: Entry[], cfg: Config, seed: string): Plan | null {
  const byPriority = (a: Entry, b: Entry) =>
    Number(b.needsRule) - Number(a.needsRule) || a.createdAt.getTime() - b.createdAt.getTime();
  const owners = waiting.filter(e => e.role === 'owner').sort(byPriority);
  if (owners.length < cfg.roundMinOwners) return null;
  const chosen = owners.slice(0, cfg.roundMaxOwners);          // quem sobrar espera a próxima rodada
  const pairs = [];
  for (const t of chosen) for (const a of chosen) if (t.id !== a.id) pairs.push({ testerId: t.profileId, appId: a.appId! });
  const helpers = waiting.filter(e => e.role === 'helper').sort(byPriority);
  const counts = new Map(chosen.map(o => [o.appId!, chosen.length - 1]));
  for (const h of helpers) {                                      // cada helper pega os apps com menos testers
    const targets = [...counts.entries()].sort((x, y) => x[1] - y[1] || tieBreak(seed, x[0], y[0]))
                      .slice(0, cfg.helperMaxApps).map(([appId]) => appId);
    for (const appId of targets) { pairs.push({ testerId: h.profileId, appId }); counts.set(appId, counts.get(appId)! + 1); }
  }
  return { owners: chosen, helpers, pairs };
}
```
`tieBreak` usa hash determinístico do `seed` (id da rodada), para ser testável. Todo o código é público, então **não há segredo no algoritmo**; a justiça vem da regra clara (prioridade + ordem de chegada).
**Testes obrigatórios:** abaixo do mínimo → `null` · exatamente 13 · 20 na fila → 16 escolhidos e 4 esperam · prioridade `needsRule` · ninguém testa o próprio app · helpers equilibram contagem · determinismo com mesmo seed.

## 5. Ranking (SQL, no MVP)
- **Apps:** média das notas recebidas (mínimo 5 feedbacks), desempate por testes concluídos.
- **Testers:** `reliability`, desempate por rodadas concluídas.

## 6. Rotas principais
`/` landing · `/login` · `/onboarding` · `/app/new` · `/queue` · `/round/[id]` · `/round/[id]/app/[appId]` · `/rankings` · `/report` · `/admin` (P2).

## 7. Jobs e tolerância a falhas
O job é **idempotente**: reexecutar não duplica rodadas (restrições únicas + transação). Falha de e-mail não derruba o job (registra em `event_log`, tenta de novo na próxima hora).

## 8. Observabilidade
Logs estruturados sem dados pessoais · `event_log` para eventos de negócio · alerta por e-mail ao Owner se o job falhar 2 vezes seguidas.

## 9. Escala
Pensado para centenas de usuários. Só reavaliar com dor medida (job > 30 s, ou > 5.000 usuários).
