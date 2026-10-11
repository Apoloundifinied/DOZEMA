# 11 · Painel de administração (P2 — só depois do P0 pronto)

## Objetivo
O Owner ver, num só lugar, quantos usuários existem, como as rodadas estão indo e agir sobre abusos.

## Acesso
Rota `/admin`. Só `profiles.role = 'admin'`. O papel é dado **manualmente** no banco (`update profiles set role='admin' where id = ...`). Toda ação gera linha em `event_log`.

## Métricas (cards)
Usuários (total, novos em 7 dias, com app) · fila (owners/helpers aguardando) · rodadas por status · apps cadastrados · taxa de conclusão das últimas rodadas · feedbacks enviados · denúncias abertas · reputação média.
Fonte: função `admin_stats()` (security definer, checa `is_admin()`).

## Tabelas
| Tabela | Colunas principais | Ações |
|---|---|---|
| Usuários | handle, país, idioma, criado em, reputação, banido | buscar, banir/desbanir |
| Rodadas | status, datas, nº de participantes, conclusão | ver detalhes, cancelar |
| Apps | nome, dono, ativo, denúncias | desativar |
| Denúncias | alvo, motivo, status | abrir, resolver, descartar |

## Fora do P2 inicial
Edição manual de check-ins · e-mail em massa · gráficos avançados · exportar CSV (P2.1).

## Critérios de aceite
Admin vê os números corretos conferidos contra SQL manual · usuário comum recebe 403 em `/admin` e nas funções admin · toda ação deixa rastro em `event_log`.
