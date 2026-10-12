import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Faq } from "./components/Faq";
import { Tracker } from "./components/Tracker";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.hero" });
  return {
    title: "Dozena",
    description: t("tagline"),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  return (
    <div className="flex-1 flex flex-col">
      <Tracker />
      <main className="flex-1 flex flex-col">
        <Hero siteKey={siteKey} />
        <Features />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
