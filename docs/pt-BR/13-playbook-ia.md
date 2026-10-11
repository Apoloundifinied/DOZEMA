# 13 · Playbook para o Kimi K3 (ou qualquer agente)

## Como iniciar toda sessão
Cole `AGENTS.md` + `CONTEXT.md` e dê **uma** tarefa:
```
Leia AGENTS.md e CONTEXT.md abaixo. Tarefa: <uma tarefa>.
Escopo: apenas P0 (ou a prioridade atual). Se faltar informação, pergunte antes de codar.
Para tarefas com mais de 3 arquivos, mostre o plano primeiro.
Ao final: liste arquivos alterados, o que NÃO foi feito, e atualize "Estado atual" no CONTEXT.md.
[colar arquivos]
```

## Sequência de prompts (uma por sessão)
1. **Setup:** Next.js (TS strict), Tailwind, next-intl (`pt-BR`/`en`), lint, vitest, estrutura de pastas, `lib/config.ts` com os parâmetros.
2. **Banco:** aplicar a migration; gerar tipos; seed mínimo.
3. **Auth e perfil:** login Google, onboarding (handle, país, idioma, needs_rule).
4. **App do dev:** formulário + Zod + regex dos links + página "meu app".
5. **Fila:** entrar/sair da fila (owner/helper) com Turnstile.
6. **`planRound`:** função pura + testes listados em `04-arquitetura.md` §4.
7. **Job:** `/api/cron/rounds` (formação, avanço de fases, encerramento), idempotente, protegido por `CRON_SECRET`.
8. **Rodada (tester):** lista de apps com 3 passos, `confirm_step`, `check_in`, `submit_feedback`.
9. **Meu app (dono):** contagem de testers ativos e feedbacks.
10. **E-mails** bilíngues e **rankings**.
11. **Denúncia** + landing bilíngue + design "caderno".
12. **Deploy** conforme `12-deploy.md`.
13. **(P1/P2)** lembretes, substituição de desistentes, depois o painel admin.

## Dicas
- Sessões curtas e focadas rendem mais que prompts gigantes.
- Se o agente "se perder", **reinicie** com o `CONTEXT.md` atualizado em vez de estender o chat.
- Revise todo diff que mexe em RLS, RPC e `planRound`; rode os testes você mesmo.
- Não deixe o agente adicionar dependência, tabela ou tela fora do escopo.
- Peça sempre PT-BR e EN juntos.

## Prompt de revisão (antes de cada merge)
```
Revise este diff contra AGENTS.md e CONTEXT.md. Aponte: escopo extra, dependência nova,
falta de teste, risco de segurança (RLS, links, vazamento de dados), strings fora do i18n
ou só em um idioma. Seja objetivo.
```
