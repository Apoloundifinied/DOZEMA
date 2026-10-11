# 12 · Deploy (passo a passo)

## 1. Supabase
1. Criar projeto. Anotar URL, `anon key` e `service_role key`.
2. Rodar `supabase/migrations/0001_init.sql` (SQL Editor ou CLI `supabase db push`).
3. **Auth → Providers → Google:** ativar, colar Client ID e Secret.
4. **Auth → URL Configuration:** definir Site URL e Redirect URLs do domínio (e do preview da Vercel).

## 2. Google Cloud (login)
1. Criar projeto → **OAuth consent screen** (nome do app, e-mail, domínio).
2. **Credentials → OAuth client ID (Web):** em *Authorized redirect URIs*, colocar a URL de callback mostrada pelo Supabase no passo 1.3.

## 3. Resend e Turnstile
Criar conta Resend, verificar domínio (SPF/DKIM), gerar API key. Criar widget Turnstile e anotar site key e secret.

## 4. Vercel
Importar o repositório do GitHub, definir todas as variáveis do `.env.example`, apontar o domínio. Gerar `CRON_SECRET` aleatório longo.

## 5. Agendador (job das rodadas)
Workflow do GitHub Actions rodando a cada hora e chamando `POST {APP_URL}/api/cron/rounds` com `Authorization: Bearer $CRON_SECRET`. (Alternativas: Vercel Cron ou `pg_cron`; verificar limites do plano atual.)

## 6. Primeiro admin (quando o P2 existir)
Logar uma vez com seu Google; no SQL Editor: `update profiles set role='admin' where id = '<seu-uuid>';`

## 7. Checklist de lançamento
- [ ] Login Google funciona em produção e no preview
- [ ] Link de opt-in e de grupo aceitos/rejeitados corretamente (testar links reais)
- [ ] E-mails chegam (SPF/DKIM ok), nos dois idiomas
- [ ] RLS testado (usuário A não lê app/feedback de B sem atribuição)
- [ ] Job rodou manualmente com dados de teste e formou rodada
- [ ] Termos, privacidade e e-mail de segurança publicados
- [ ] Backup do banco habilitado e restauração testada uma vez
- [ ] Repositório público: `LICENSE` oficial, README, CONTRIBUTING, `.env.example` sem valores
- [ ] Nome/domínio/INPI conferidos (ADR-002)
- [ ] Segredos revisados: nada commitado
