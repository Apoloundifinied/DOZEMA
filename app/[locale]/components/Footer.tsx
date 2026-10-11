"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const linkClass =
  "rounded-sm underline-offset-4 transition-colors hover:text-[#14130F] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14130F] dark:hover:text-[#F4F1E8] dark:focus-visible:outline-[#F4F1E8] motion-reduce:transition-none";

export function Footer() {
  const t = useTranslations("landing.footer");

  return (
    <footer
      className="border-t border-[#E6E2D6] bg-[#FBFAF7] pb-11 pt-9 text-sm text-[#5B5950] dark:border-[#2B2A22] dark:bg-[#0F0E0B] dark:text-[#A8A596]"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-3 px-6 sm:flex-row sm:justify-between sm:px-8">
        <p>{t("openSource")}</p>
        <nav aria-label="Footer links" className="flex gap-6">
          <Link href="/privacy" className={linkClass}>
            {t("privacy")}
          </Link>
          <Link href="/contact" className={linkClass}>
            {t("contact")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
