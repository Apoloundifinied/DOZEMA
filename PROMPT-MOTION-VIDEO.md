# PROMPT PARA IA DE GERAÇÃO DE VÍDEO — Dozena (8s, motion design)

> **Como usar:** cole tudo abaixo da linha tracejada na IA de vídeo (Veo, Sora, Runway Gen-4, Kling, Pika…). Calibrado com a identidade real do produto (cores, tipografia e a metáfora visual que já existe na landing: o anel de 12 pontos).

---

## Brief: vídeo-motion de 8 segundos — "Dozena"

**Produto real:** Dozena — ferramenta gratuita e open source que forma **rodadas sincronizadas**: ~13 devs independentes testam os apps Android uns dos outros durante **14 dias** para cumprir a regra do Google Play (teste fechado com 12+ testers por 14 dias contínuos antes de liberar produção).

**O que o vídeo precisa comunicar em 8s (objetivamente e nesta ordem):**
1. O problema (dev solo precisa de 12 testers — impossível sozinho)
2. A mecânica (12 devs entram num círculo e testam todos juntos)
3. O prazo (14 dias, contagem visível)
4. O resultado (todos completam — check final)

**Estilo obrigatório ("motion design de ponta"):**
- Motion design gráfico 2D puro, flat/geométrico, estilo "explicador premium" (referência: reunions de marca tipo Vercel/Linear/Raycast — sóbrio, sem 3D, sem personagens, sem mãozinhas).
- **Identidade exata da marca:**
  - Acento: amarelo-ouro `#F5B301`
  - Tinta: quase-preto quente `#14130F`
  - Fundo: creme `#FBFAF7` (alterne com cena escura `#14130F` no clímax)
  - Tipografia: grotesca geométrica pesada (estilo Schibsted Grotesk), texto cinza `#A8A596` nos detalhes
- Um único elemento herói por cena. Entrada **desacelera** (ease-out brusco), saída **acelera** (ease-in cortando). Stagger de 50–70 ms entre elementos. Nada de bounce exagerado, nada linear.
- Movimento com *propósito*: pontos que se juntam = comunidade; arco que se preenche = os 14 dias passando.

**Storyboard (timing total = 8.0s):**

- **0.0–1.6s | A dor.** Tela creme. 1 ponto amarelo pequeno sozinho no centro, pulsando uma vez, sem companhia. Surgem 12 contornos vazios pontilhados ao redor, distantes, tremendo de leve ("quero, mas não alcanço"). Texto entra por baixo, subindo com stagger por palavra: **"12 testers."** depois **"14 dias."** — nada mais.
- **1.6–3.4s | A rodada se forma.** Corte com slide lateral acelerando. Os 12 pontos vazios *voam* para posições de um anel ao redor do ponto central, cada um aterrissando com stagger de 60ms e virando amarelo sólido ao encaixar (som seco de "tick" a cada encaixe, se houver áudio). No centro, surge a wordmark `dozena` em minúsculas.
- **3.4–6.0s | Os 14 dias.** Fundo inverte para `#14130F` (transição por máscara circular que se expande). O anel vira um **círculo de progresso**: um arco amarelo grosso (`stroke` arredondado) se desenha no sentido horário ao redor dos pontos enquanto um contador numérico no centro corre de `1` até `14` com `/14` pequeno embaixo, dígitos com tabular-nums. Os 12 pontos pulsam em sequência circular, uma onda única, sem loop.
- **6.0–7.4s | O resultado.** O arco fecha completo. Os 12 pontos fazem um micro-recuo (antecipação) e então um **check amarelo grosso é desenhado a traço único** no centro (stroke-dash). Texto entra: **"Todo mundo passa."**
- **7.4–8.0s | Assinatura.** Tudo assenta por 400ms (hold). Fade curto para a wordmark `dozena` isolada no creme, com micro-legenda cinza: `open source · gratuito · rodadas de 14 dias`. Fim.

**Regras negativas (importante):**
- Sem pessoas, mãos, rostos, mockups de celular genéricos com blur, sem 3D, sem partículas, sem gradiente roxo, sem glitch/flash (máx. 3 pulsações/s).
- Sem voz/narração. Se houver som: apenas foleys minimalistas (ticks suaves de interface) e um *whoosh* discreto na transição central — música atmosférica calma é opcional.
- Todo texto em português: apenas estas frases — **"12 testers."**, **"14 dias."**, **"Todo mundo passa."**, e a assinatura final. (Versão EN igual, trocando por **"12 testers." / "14 days." / "Everyone gets through."**)

**Entregáveis pedidos:** 16:9 (Reddit/landing) e 9:16 (WhatsApp/Stories/Shorts), 1080p, 8.0s exatos, loop limpo opcional cortando antes da assinatura.

Se a IA permitir imagem de referência: anexe uma captura do hero da landing (o anel de 12 pontos + wordmark dozena).
