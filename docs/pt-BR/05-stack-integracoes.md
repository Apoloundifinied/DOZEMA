# 05 · Stack e integrações (100% detalhado)

## Stack
| Camada | Escolha | Motivo |
|---|---|---|
| Framework | **Next.js** (App Router) + **TypeScript strict** | Um app só, bom para IA gerar |
| UI | **Tailwind CSS** + componentes próprios | Controle total do visual "caderno" |
| i18n | **next-intl** (`/pt-BR`, `/en`) | Bilíngue desde o dia 1 |
| Banco/Auth | **Supabase** (Postgres, Auth Google, RLS, RPC) | Barato, rápido, sem backend próprio |
| Validação | **Zod** | Toda borda validada |
| E-mail | **Resend** | Transacional simples |
| Anti-spam | **Cloudflare Turnstile** | Gratuito |
| Hospedagem | **Vercel** | Deploy do Next.js |
| Agendador | **GitHub Actions** (cron) chamando `/api/cron/rounds` | Gratuito; alternativa: Vercel Cron ou `pg_cron` (verificar limites atuais do plano) |
| Testes | **Vitest** (unit), **Playwright** (1 E2E) | Mínimo necessário |
| CI | **GitHub Actions** | lint + typecheck + test |
| Analytics (opcional) | Plausible ou PostHog | Só métricas agregadas; precisa de ADR |

## Integrações
| Integração | Para quê | Observação |
|---|---|---|
| Google OAuth (via Supabase) | Login | Criar OAuth client no Google Cloud; redirect = callback do Supabase |
| Google Play (links) | Entrega do teste | **Sem API**: só validação de formato do link; opt-in é feito pelo tester no Google Play |
| Google Groups (links) | Lista de testers do dev | Sem API; o dev gerencia o grupo |
| Resend | E-mails | Verificar domínio (SPF/DKIM) |
| Turnstile | Fila, cadastro de app, denúncia | Chave no ambiente |
| GitHub | Repositório, CI, Discussions | Comunidade |

**Não existe API do Google que confirme quem é tester.** Por isso a prova é check-in + feedback.

## Dependências permitidas no início
`next`, `react`, `typescript`, `tailwindcss`, `next-intl`, `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `resend`, `vitest`, `@playwright/test`. Qualquer outra → ADR (ex.: `roughjs` para o traço à mão).

## Variáveis de ambiente
Ver `.env.example`.

## Custos (verificar planos atuais)
Todos os serviços têm plano gratuito suficiente para o início. Ponto de atenção: limites de e-mail e de agendamento. Domínio próprio é o único custo quase certo.
