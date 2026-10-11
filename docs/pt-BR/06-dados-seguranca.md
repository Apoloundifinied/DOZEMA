# 06 · Dados, segurança e privacidade

## Modelo de dados (resumo; SQL em `supabase/migrations/0001_init.sql`)
`profiles` · `apps` · `queue_entries` · `rounds` · `round_participants` · `assignments` · `checkins` · `feedback` · `reports` · `event_log`.
Relações: `profiles` 1—N `apps`; `rounds` 1—N `round_participants`; `assignments` = (round, tester, app); `checkins` e `feedback` pertencem a `assignments`.

## Regras de acesso (RLS)
| Tabela | Quem lê | Quem escreve |
|---|---|---|
| `profiles` | usuários logados (campos públicos) | o próprio usuário (apenas colunas liberadas); `role`, `banned_at`, `reliability` só via servidor/admin |
| `apps` | dono, testers com atribuição, admin | dono |
| `queue_entries` | dono da entrada, admin | dono |
| `rounds` / `round_participants` | participantes, admin | só servidor (service role) |
| `assignments` | tester, dono do app, admin | só RPC |
| `checkins`, `feedback` | tester, dono do app, admin | só RPC |
| `reports` | admin | qualquer logado (insert) |
| `event_log` | admin | servidor |
**Links de opt-in e do grupo só aparecem para quem está atribuído**, para impedir coleta em massa.

## Validação de links (Zod)
- Opt-in: `^https://play\.google\.com/apps/testing/[A-Za-z0-9._]+$`
- Grupo: `^https://groups\.google\.com/(g|u/\d+/g)/[A-Za-z0-9._-]+$`
- Sem encurtadores, sem parâmetros extras, sem redirecionamento. Normalizar antes de salvar.
(Os formatos podem mudar; testar com links reais antes do lançamento.)

## Abuso e fraude
| Risco | Resposta |
|---|---|
| Apps maliciosos | Nunca hospedamos binário; só link do Google Play; denúncia retira o app |
| Testers "fantasma" (instalam e somem) | Check-ins em dias distintos + feedback mínimo + reputação |
| Contas falsas/spam | Login Google + Turnstile + limites por usuário/dia |
| Phishing via links | Regex estrita; links só visíveis para quem está atribuído |
| Coleta de e-mails | Dozena não expõe Gmail; o grupo cuida |
| Avaliações pagas/trocadas na Play Store | Proibido nas regras; feedback é privado |
Como o código é público, **nenhuma defesa depende de segredo**.

## Privacidade (LGPD e GDPR — não substitui advogado)
- Dados: e-mail (via Google), nome/handle, país, apps e links, check-ins, feedback.
- Minimização: sem telefone, sem endereço. Feedback é visível só para o dono do app e para admin.
- Base legal: consentimento no cadastro + execução do serviço. Política de privacidade e termos antes do lançamento.
- Direitos: apagar conta e dados por e-mail ou botão (P1). Retenção: apagar feedback e atribuições 12 meses após o fim da rodada.
- Admin é identificado por `profiles.role = 'admin'`, definido manualmente no banco. Nunca por UI pública.

## Segurança técnica
RLS em tudo · RPC `security definer` com `search_path` fixo · `service_role` só no servidor · cron protegido por `CRON_SECRET` · cabeçalhos de segurança (CSP, X-Frame-Options) · dependências com `npm audit` no CI · sem dados pessoais em log.

## Resposta a incidente
Detectar → conter (revogar chaves, desativar rota) → avaliar dados afetados → avisar usuários e a autoridade quando exigido → corrigir → registrar em `DECISIONS.md`.
