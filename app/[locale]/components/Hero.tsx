"use client";

import { useTranslations } from "next-intl";
import { WaitlistForm } from "./WaitlistForm";

export function Hero({ siteKey }: { siteKey: string }) {
  const t = useTranslations("landing.hero");

  return (
    <header className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">
          {t("tagline")}
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          {t("subtitle")}
        </p>
        <div className="max-w-md mx-auto">
          <WaitlistForm siteKey={siteKey} />
        </div>
      </div>
    </header>
  );
}