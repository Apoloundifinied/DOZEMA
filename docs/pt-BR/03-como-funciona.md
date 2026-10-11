# 03 · Como funciona (regras do jogo)

## Ciclo de uma rodada
| Fase | Duração | O que acontece |
|---|---|---|
| Fila | — | Dev entra com app (owner) ou sem app (helper) |
| Formação | instantânea | Job cria a rodada quando há ≥ 13 owners |
| Setup | 48 h | Todos entram nos grupos e fazem opt-in nos apps dos outros |
| Teste | 14 dias | Check-ins e feedback. O relógio do Google conta do opt-in contínuo |
| Folga | 2 dias | Margem para quem entrou tarde ou teve falha |
| Encerrado | — | Reputação atualizada; cada dev pede acesso à produção no Play Console |

## Passo a passo do dev (owner)
1. No Play Console, crie um **teste fechado** e copie o **link de opt-in**.
2. Crie um **Google Group** (quem pode entrar: qualquer pessoa/por solicitação) e adicione o endereço do grupo à lista de testers do teste fechado.
3. Cadastre o app na Dozena com os dois links e entre na fila.
4. Na rodada, aprove os pedidos de entrada no seu grupo e **teste os apps dos outros**.
5. Ao final, peça acesso à produção no Play Console.

## Passo a passo do tester (para cada app)
1. **Entrar no grupo** (link do Google Group).
2. **Opt-in** (link do teste fechado) e instalar pela Play Store.
3. **Usar** o app e fazer **check-in** em pelo menos 2 dias diferentes.
4. Escrever **feedback privado** (nota + texto) em pelo menos 3 apps.

## Regras
- Dono nunca testa o próprio app. Cada owner testa todos os outros apps da rodada.
- Helpers (só testam) recebem até 5 apps, os com menos testers.
- **Prioridade na fila:** quem marcou "preciso da regra 12/14", depois ordem de chegada. Owners antes de helpers.
- Desistência ou falta de opt-in até o fim do setup → participante marcado `dropped` e reputação cai.
- Denúncias de app suspeito removem o app da rodada até revisão.
- **Proibido:** pedir ou oferecer avaliação pública na Play Store, links fora do Google Play, apps maliciosos, contas falsas.

## Reputação (confiabilidade)
`reliability = apps_concluídos / apps_atribuídos`, mais um bônus por feedbacks. Aparece no ranking de testers e define prioridade em empates.

## O que a Dozena não controla
Aprovação do Google, critérios internos de engajamento e mudanças na regra. Sempre conferir a documentação oficial do Play Console.
