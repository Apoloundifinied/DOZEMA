"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations("landing.footer");

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-4 sm:px-6 lg:px-8" role="contentinfo">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <p>{t("openSource")}</p>
        <nav aria-label="Footer links" className="flex gap-6">
          <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            {t("privacy")}
          </Link>
          <Link href="/contact" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            {t("contact")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}