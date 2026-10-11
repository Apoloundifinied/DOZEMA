# 09 · Planejamento, validação e lançamento para a comunidade

**Premissa:** ~10–15 h/semana do Owner + agentes de IA. Se for menos, multiplique os prazos. Estimativas, não promessas.

## Fase 0 — Validação (semanas 0–2)
- Landing de **lista de espera** bilíngue (formulário: handle, país, idioma, "tenho app / só quero testar", "preciso da regra 12/14").
- Divulgação orgânica (Reddit/r/androiddev e similares — **ler as regras de cada comunidade**, Indie Hackers, X, TabNews, Dev.to, grupos de Telegram/Discord/WhatsApp de devs Android no Brasil).
- **Piloto manual** com 13 devs: planilha + grupo de WhatsApp, 1 rodada real.
- **Go:** ≥ 26 inscritos em 10 dias **e** ≥ 8 dos 13 do piloto completam. **Parar/pivotar** (ADR-013): < 15 inscritos em 10 dias, ou < 60% de conclusão.

## Fase 1 — MVP P0 (semanas 1–4, em paralelo ao piloto)
| Semana | Entrega |
|---|---|
| 1 | Projeto Next.js + Supabase, migrations, login Google, i18n, CI |
| 2 | Perfil, cadastro de app (validação de links), fila |
| 3 | `planRound` + testes, job, rodada (setup/teste), check-in, feedback |
| 4 | E-mails, rankings, denúncia, landing final, termos/privacidade, deploy |

## Fase 2 — Lançamento suave (semanas 5–6)
Primeira rodada real a partir da lista de espera. Acompanhar métricas diárias, corrigir o que mais dói, escrever o "diário de bordo" (conteúdo de funil).

## Fase 3 — P1 e P2 (a partir da semana 7)
Lembretes, substituição de desistentes, estatísticas do dev. **Depois**, o painel de administração (P2).

## Rituais semanais (30 min)
Métricas · feedback da comunidade · atualizar `ROADMAP.md` e `CONTEXT.md`.

## Métricas
| Métrica | Meta inicial |
|---|---|
| Inscritos na lista | ≥ 26 em 10 dias |
| Fila → rodada | ≥ 60% entram em até 7 dias |
| Conclusão (app com ≥ 12 testers ativos por 14 dias) | ≥ 70% |
| Desistência | ≤ 20% |
| Feedback médio por tester | ≥ 3 |
| **Estrela do norte:** apps que pediram acesso à produção | acompanhar |

## Plano de lançamento para a comunidade ("soltar")
1. Repositório público com README bilíngue, `CONTRIBUTING`, Issues com "good first issue" e Discussions.
2. Post de lançamento (PT-BR e EN): problema → solução → como entrar → link do repo. Modelo:
   - PT-BR: "Criei a Dozena: rodadas de 14 dias para devs Android testarem os apps uns dos outros e cumprirem a regra dos 12 testers. Grátis e open source. Entre na fila: <link>"
   - EN: "I built Dozena: 14-day rounds where Android devs test each other's apps to meet Google Play's 12-tester rule. Free and open source. Join the queue: <link>"
3. Thread no X contando o processo (build in public) + vídeo curto da tela de rodada.
4. Postar nas comunidades **só onde as regras permitirem**, uma por dia, respondendo comentários.
5. Mensalmente: "o que ouvimos e o que mudou" (changelog do roadmap).
6. Pedir feedback e traduções (PR de docs).
