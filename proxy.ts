import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16: o arquivo `proxy.ts` substitui `middleware.ts` (mesma semântica).
export default createMiddleware(routing);

export const config = {
  // Aplica a todas as rotas exceto api, _next e arquivos estáticos
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
