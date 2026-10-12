# 14 · Brainstorm, concorrência e riscos

## Como chegamos aqui
1. Ponto de partida: Hypo, marketplace simples de duas pontas que já faturou mais de R$ 1.000.
2. Primeiro rascunho: marketplace de prestadores de eventos → descartado por ser complexo (cold start por cidade, pagamentos recorrentes, jurídico).
3. Variante dev/design/vibecoders a R$ 20 → preço baixo e concorrência forte (Workana, 99Freelas, Fiverr).
4. **Decisão:** resolver um problema do próprio meio, com fluxo de dois lados simples e funil de conteúdo → troca de testers para a regra 12/14 do Google Play.

## Concorrência (pesquisa de out/2026; reconferir)
| Quem | Como funciona | Limite |
|---|---|---|
| Grupos gratuitos (ex.: comunidade com 20 mil+ devs) | Dev entra no grupo e troca testes por conta própria | Sem rodada sincronizada, abandono alto, sem prova de uso |
| Serviços pagos de testers | Pagam por ~25 testers durante os 14 dias | Custo, qualidade variável, risco de teste "artificial" |
| Threads em fóruns (Reddit, Indie Hackers) | Troca manual | Manual e dispersa |
| **Testers Community** (testerscommunity.com) — referência detalhada 2026-10-12, vinda de comentário no r/FlutterDev | Pago: R$75–125/app, rede de "testers profissionais" em 6h, "100% production access guarantee" (que é só reembolso — o Google não dá garantia a ninguém). Tier grátis existe, mas exige acumular testes pra ganhar testers | Fechado; testers anônimos pagos (padrão que a regra 12/14 tenta frustrar); promessa inflada; desincronizado |

## Diferenciais da Dozena
Rodadas sincronizadas (todos precisam da mesma janela) · prova de uso (check-ins + feedback) · reputação e ranking · bilíngue · open source · gratuito.

### Diferenciais vs. Testers Community (especificamente)
| | Testers Community | Dozena |
|---|---|---|
| Preço | R$75–125/app; "grátis" só com trabalho acumulado | Grátis no MVP |
| Quem testa | Rede anônima de testers pagos | Devs com o mesmo problema, na mesma janela |
| Promessa | "100% garantia" (na prática: reembolso) | Nenhuma promessa de aprovação; só organiza a troca |
| Código | Fechado | AGPL-3.0, auditável |
| Provável vida útil com quebra da regra | Acaba | Pivotável (ver Alternativas) |

## Riscos
| Risco | Impacto | Mitigação |
|---|---|---|
| **Google muda ou acaba com a regra** | Produto perde razão de ser | Plano B: troca de feedback geral entre makers (mesma mecânica); monitorar a doc oficial |
| **Dor de uso único** (o dev some depois de passar) | Retenção baixa | Ranking, comunidade, apps que voltam a cada novo app; aceitar que é isca de audiência |
| **Concorrência gratuita forte** | Pouca tração | Diferenciais acima; foco em conteúdo e comunidade |
| **Abandono no meio da rodada** | Rodada quebra | Margem (15 owners), folga de 2 dias, reputação, substituição (P1) |
| **Testers "de fachada"** | Google pode rejeitar | Check-ins em dias distintos + feedback; orientação clara de uso real |
| **Abuso (apps maliciosos, spam)** | Dano à comunidade | Só links do Google Play, denúncia, admin |
| **Cold start (primeira rodada)** | Nada acontece | Lista de espera e piloto manual antes de programar |
| **Código aberto copiado** | Clone | Licença AGPL, marca e comunidade como diferenciais |

## Critério de parada
Ver ADR-013.

## Alternativas guardadas
Troca de feedback de produto entre makers · feedback de UI ↔ revisão de código · resgate de apps feitos com IA (mais complexo, marketplace).

## Perguntas ainda abertas (com padrão adotado)
| Pergunta | Padrão atual |
|---|---|
| Nome definitivo/domínio | Dozena, a conferir |
| Licença | AGPL-3.0 recomendada |
| Tamanho da rodada | 13–16 owners |
| Monetização | Decidir depois; MVP grátis |
| iOS | Fora do MVP |
