# 07 · Engenharia de código

## Princípios
Chato é bom (tecnologia comum, poucas dependências) · funções pequenas e puras · tipos fortes · se mexe em RLS, RPC ou `planRound`, tem teste.

## Padrões
- **Pastas** como em `CONTEXT.md` §9; arquivo > 300 linhas = dividir.
- **Validação** com Zod em toda borda (formulário, query, cron).
- **Banco** só por migrations versionadas; tipos gerados do schema; sem SQL solto em componente.
- **Erros** no formato `{ ok: true, data } | { ok: false, code }`; mensagens ao usuário via i18n; detalhes só no log.
- **Server Components por padrão**; estado de cliente mínimo.
- **Nomes** em inglês e completos (`providerId`, nunca `pid`). Comentários explicam o porquê.
- **i18n:** toda string em `messages/*.json`; chave nova entra nos dois idiomas no mesmo PR.

## Git
Branch por tarefa (`feat/queue`) · Conventional Commits · DCO · PR < ~300 linhas · `main` sempre deployável · proteção de branch com CI verde.

## Testes (mínimo)
| O quê | Tipo |
|---|---|
| `planRound` (casos em `04-arquitetura.md` §4) | unitário |
| Regex dos links | unitário |
| RPCs `check_in`, `submit_feedback`, `confirm_step` | integração (Supabase local) |
| RLS: tester não lê link de app não atribuído; usuário comum não lê `reports` | integração |
| Fluxo: login → app → fila → rodada | 1 E2E |

## CI
Lint + typecheck + test + `npm audit` em todo PR; preview de deploy na Vercel.

## Checklist anti-complexidade
- [ ] Resolve algo do P0/P1/P2 atual?
- [ ] Dá para fazer com menos código/dependências?
- [ ] Outra pessoa/IA entende em 5 minutos?
- [ ] Tem teste (se tocar RLS/RPC/planRound)?
- [ ] PT-BR e EN completos? `CONTEXT.md` atualizado?

## Definição de pronto
Ver `AGENTS.md`.
