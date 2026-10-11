# 08 · Design

## Conceito: "caderno do dev"
Minimalista e **desenhado à mão**: papel off-white, traço fino de caneta, um único acento de marca-texto. O elemento central da identidade é o contador **12 testers · 14 dias**: 12 bolinhas (testers) e 14 marquinhas de calendário (dias), que se preenchem conforme a rodada avança.

## Tokens
| Token | Claro | Escuro ("quadro-negro") |
|---|---|---|
| Papel (fundo) | `#FBF8F1` | `#151515` |
| Tinta (texto/traço) | `#1B1B1B` | `#F3EFE6` |
| Tinta suave | `#5C5A55` | `#A8A49B` |
| Marca-texto (acento) | `#FFD84D` | `#FFD84D` |
| Sucesso / Erro | `#2F7D4F` / `#B3382C` | `#6FCF97` / `#FF8A7A` |
| Traço | 1.5 px | 1.5 px |
| Raio | 10 px | 10 px |
| Sombra | deslocada 3 px, sem blur, cor da tinta | idem |
| Espaçamento | escala de 4 px | idem |
Declarar como variáveis CSS; usar **só** elas. No máximo 1 acento por tela.

## Tipografia
Títulos: serifa com personalidade (ex.: **Fraunces**) · Texto: **Inter** (fallback system-ui) · Números/contadores: **JetBrains Mono**. Tamanhos: 14 / 16 / 20 / 28 / 40. Carregar fontes com `font-display: swap`.

## Ilustração e "mão livre"
- Ícones e desenhos em **traço contínuo** (SVG, stroke 1.5, cantos arredondados).
- Efeito de mão: pequena irregularidade nos contornos via SVG (`feTurbulence` + `feDisplacementMap` sutil) ou `roughjs` (exige ADR). Nunca exagerar: o conteúdo vem primeiro.
- Rabiscos permitidos: sublinhado de marca-texto sob palavras-chave, setinhas, risquinhos de "contagem" (llll).

## Componentes mínimos
`DotsCounter` (12 bolinhas) · `CalendarStrip` (14 marcas) · `Card` (borda 1.5 px + sombra deslocada) · `Button` (primário = marca-texto com borda; secundário = só borda) · `Input`/`Select`/`Textarea` · `Badge` de status · `Toast` · `EmptyState` com desenho · `Skeleton` · `StepList` (os 3 passos por app).

## Telas-chave
1. **Landing:** headline, contador animado de exemplo, "como funciona" em 3 passos desenhados, botão "Entrar na fila".
2. **Fila:** posição estimada, "preciso da regra 12/14", seu app.
3. **Rodada:** `CalendarStrip` no topo; lista de apps com 3 passos cada; botão de check-in.
4. **Meu app:** `DotsCounter` mostrando testers ativos (x/12) e feedbacks.
5. **Rankings:** duas listas simples.

## Regras
- Mobile-first (360 px). Alvos de toque ≥ 44 px. Contraste AA. Foco visível. Respeitar `prefers-reduced-motion`.
- Todo componente tem estados: normal, carregando, erro, vazio, desabilitado.
- Movimento só para dar sentido (bolinha preenchendo ao check-in). Nada de popups agressivos.
- Texto de interface sempre via i18n e testado nos dois idiomas (EN costuma ser mais curto; PT-BR precisa de espaço).

## Voz
Direta, humana, um pouco bem-humorada. Verbos de ação: "Entrar na fila", "Marcar check-in". Nunca promete o que não controla ("você vai ser aprovado"). Exemplos: PT-BR "Falta 1 passo no app da Ana" · EN "1 step left on Ana's app".

## Checklist visual antes de lançar
Dark mode ok · 360 px ok · EN e PT-BR ok · contraste AA · nenhum texto em imagem · favicon e imagem social (Open Graph) feitos.
