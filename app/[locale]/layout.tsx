import { type Metadata } from "next";
import { Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";

// Mantive os nomes das variáveis CSS (--font-geist-*) de propósito: assim o que o globals.css
// já mapeia (font-sans, font-mono) passa a usar as fontes novas sem você editar mais nada.
const sans = Schibsted_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dozena",
  description: "Uma dúzia de devs. Quatorze dias. Todo mundo passa.",
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${mono.variable} h-full scroll-smooth antialiased motion-reduce:scroll-auto`}
    >
      <body className="flex min-h-full flex-col bg-[#FBFAF7] font-[family-name:var(--font-geist-sans)] text-[#14130F] dark:bg-[#0F0E0B] dark:text-[#F4F1E8]">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        {/* Analytics da Vercel: page views/visitantes no dashboard (ADR-016). Privacy-friendly, sem cookies. */}
        <Analytics />
      </body>
    </html>
  );
}
