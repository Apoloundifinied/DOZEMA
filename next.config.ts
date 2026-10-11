import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Aliases amigáveis: /pt → /pt-BR (quem divulga erra fácil no locale)
  async redirects() {
    return [
      { source: "/pt", destination: "/pt-BR", permanent: false },
      { source: "/pt/:path*", destination: "/pt-BR/:path*", permanent: false },
    ];
  },
  /* config options here */
  turbopack: {
    // Alias do config do next-intl (o plugin depende do webpack path no Next 16)
    resolveAlias: {
      "next-intl/config": "./i18n/request.ts",
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
