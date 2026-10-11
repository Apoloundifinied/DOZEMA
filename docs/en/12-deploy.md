# 12 · Deploy (EN)
1. **Supabase:** create project; run `supabase/migrations/0001_init.sql`; Auth → Providers → Google (enable, add Client ID/Secret); Auth → URL Configuration (Site URL + redirect URLs).
2. **Google Cloud:** OAuth consent screen; OAuth client (Web) with the Supabase callback URL as authorized redirect URI.
3. **Resend + Turnstile:** verify domain (SPF/DKIM), create API key; create a Turnstile widget.
4. **Vercel:** import the GitHub repo, set every variable from `.env.example`, point your domain, generate a long random `CRON_SECRET`.
5. **Scheduler:** GitHub Actions workflow hourly → `POST {APP_URL}/api/cron/rounds` with `Authorization: Bearer $CRON_SECRET` (alternatives: Vercel Cron or `pg_cron`; check current plan limits).
6. **First admin (when P2 exists):** log in once, then `update profiles set role='admin' where id='<your-uuid>';`
7. **Launch checklist:** Google login in prod and preview · real opt-in/group links accepted, bad ones rejected · emails arrive in both languages · RLS tested · job formed a round on test data · terms/privacy/security email published · DB backup enabled and restore tested once · public repo has the official `LICENSE`, README, CONTRIBUTING and a value-free `.env.example` · name/domain/trademark checked · no secrets committed.
