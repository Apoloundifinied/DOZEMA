# 02 · MVP (escopo, histórias e critérios)

**Objetivo:** provar que devs completam uma rodada de 14 dias e valorizam isso. Nada além.

## P0 — obrigatório para lançar
| # | História | Critério de aceite |
|---|---|---|
| 1 | Como dev, entro com Google | Login/logout funcionam; perfil criado automaticamente |
| 2 | Defino perfil (handle, país, idioma, "preciso da regra 12/14") | Handle único; idioma salvo |
| 3 | Cadastro meu app (nome, pacote, link de opt-in, link do Google Group, descrição, o que testar) | Links validados por regex; rejeita links fora do padrão |
| 4 | Entro na fila como **owner** (com app) ou **helper** (só testo) | Uma entrada ativa por pessoa; mostra posição estimada |
| 5 | Sou colocado em uma rodada | Job cria rodada ≥ 13 owners; e-mail "sua rodada começou" |
| 6 | No setup (48 h), vejo cada app com 3 passos (entrar no grupo, fazer opt-in, instalar) e marco cada passo | Passos salvos; progresso visível |
| 7 | Durante 14 dias, faço check-in diário nos apps que usei | 1 check-in por app/dia; ≥ 2 dias = app concluído |
| 8 | Escrevo feedback privado (nota 1–5 + texto ≥ 80 caracteres) | Mínimo 3 feedbacks por tester |
| 9 | Como dono do app, vejo quantos testers estão ativos e leio os feedbacks | Contagem em tempo real |
| 10 | Vejo ranking de apps e de testers | Tabelas simples |
| 11 | Denuncio um app ou usuário | Cria registro em `reports` |
| 12 | Landing bilíngue explicando tudo | PT-BR/EN, mobile-first |
| 13 | E-mails essenciais (bilíngues) | rodada formada, lembrete de setup, lembrete de check-in, rodada encerrada |

## P1
Lembretes por inatividade · substituição de desistentes por helpers · página pública de cada rodada (sem dados pessoais) · estatísticas do dev.

## P2 — só depois do P0
**Painel de administração** (ver `11-admin.md`).

## Fora do MVP
Pagamentos · créditos · iOS · chat interno · upload de APK · app nativo · notificação push · integração com Play Console (não existe API para isso) · avaliações públicas.

## Definição de "MVP pronto"
Uma rodada real, com ≥ 13 devs, passa por setup, 14 dias e encerramento sem intervenção manual no banco, e o site está no ar em domínio próprio.
