# MONETIZAÇÃO.md — Documento vivo

> Nada aqui é decisão. **ADR-007 está travado: MVP 100% grátis, sem código de pagamento.**
> Este arquivo acumula evidências. A decisão sai depois do piloto, **com números e com a comunidade** (Fase 5 do Roadmap).

## 0. O que já é verdade (fontes)

| Fato | Fonte | Data |
|---|---|---|
| Devs pagam por isso: R$75–125 por app (Starter/Pro) | [testerscommunity.com/pricing](https://www.testerscommunity.com) | 2026-10-12 |
| O concorrente afirma 10.000+ apps publicados | Testers Community (marketing, não verificado) | 2026-10-12 |
| "100% production access guarantee" é na prática reembolso; o Google não garante nada | Doc oficial do Play Console | — |
| Tier grátis do concorrente exige acumular testes para ganhar testers | Comentário no r/FlutterDev | 2026-10-12 |

## 1. O ativo real

**Não é o código (AGPL — qualquer um pode copiar).** O ativo é a **rede de devs que repetidamente topa testar** e a **reputação ranqueada** dela. Os modelos abaixo são acessos a esse ativo, em níveis crescentes de risco comunitário.

## 2. Modelos em avaliação

| # | Modelo | Quem paga | Aderência ao open source | Risco principal |
|---|---|---|---|---|
| M1 | **Freemium de conforto** — troca grátis; paga quem quer: prioridade na fila, rodada garantida na próxima, substituição automática de desistente, stats avançadas, >1 app por ciclo | Devs com pressa | Alta (features de servidor/UX, não do protocolo) | Virar "pagar para testar primeiro" = concorrer com fila da comunidade |
| M2 | **Hospedagem gerenciada / white-label** — comunidades grandes (Discords, cursos) rodam rodadas privadas com suporte | Admins de comunidade | Alta (modelo open-core clássico: Ghost, Supabase, Plausible) | Demanda inexistente se ninguém self-hospedar |
| M3 | **Marketplace de helpers pagos** — dev compra testers extras que não precisam da regra; Dozena cura e fica com 15–30% | Devs com pressa | Média | **Maior risco:** se parecer venda de teste artificial, o Google rejeita e a comunidade abandona. Só com helpers reais ranqueados + transparência total |
| M4 | **Doações / sponsorship** (OpenCollective, GitHub Sponsors) | Comunidade | Total | Cobre infra, não renda; doações morrem com o tempo |

Leitura atual: **M1 é a frente-probável**, M2 é o fallback institucional, M3 só com dados de oferta de helpers, M4 roda em paralelo de graça.

## 3. Números que estamos coletando (e como)

| Métrica | Onde está | A partir de |
|---|---|---|
| Taxa de inscrição (waitlist / visitas) | `events` + `waitlist` (funil) | Agora |
| Canal que mais converte (referrer) | `events.referrer` | Agora |
| **Tempo até completar a 1ª rodada** | App (P0) | Pós-MVP |
| **Taxa de conclusão da rodada (meta: >60%, ADR-013)** | App (P0) | Piloto |
| Taxa de desistência por dia da rodada | App (P0) | Piloto |
| % que paga quando oferecido (teste de preço) | Pesquisa na comunidade | Fase 2 |

⚠️ Antes de precificar: precisamos saber **quanto tempo/estresse uma rodada grátis poupa** vs. R$75 do concorrente. Se nossa taxa de conclusão for < 60%, cobrar é delírio.

## 4. Estruturas de decisão

Quando chegar a hora (pós-piloto, dados na mesa), o ADR de monetização deve responder:

1. O que continua **gratuito para sempre**? (Resposta provável: rodadas padrão + ranking + código aberto)
2. O que a comunidade aceita pagar sem sentir traição? (Validar em discussão pública, não em pesquisa fechada)
3. O preço cobre infra + tempo do maintainer em quantos clientes? (Meta mínima: R$500/mês de infra+tempo em 6 meses de pago)
4. O modelo prejudica a promessa central ("todo mundo passa")? Se sim, descarta.

## 5. Linha do tempo (controle de expectativa)

```
Agora (Fase 0)        0 reais. Grátis. Foco: validação.
Fase 1–2 (P0–P1)      0 reais. Coleta de dados de uso.
Fase 3 (P2)           M4 (doações) pode ligar se tiver tração.
Fase 5                ADR de monetização com números reais.
                      Consulta pública antes de implementar qualquer cobrança.
```

## 6. Regras-invariantes (não mudam com a monetização)

- Código continua AGPL-3.0-or-later — sempre.
- Nunca prometer aprovação do Google (nem no plano pago).
- A troca manual de testers continua possível e simples.
- Dados pessoais não viram produto.

---
*Última atualização: 2026-10-12 · Antes de mudar qualquer ADR aqui, rodar pela comunidade (CONTRIBUTING.md).*
