"use client";

import { useTranslations } from "next-intl";

export function Features() {
  const t = useTranslations("landing.features");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="features-heading">
      <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-12">
        {t("title")}
      </h2>
      <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <article
            key={index}
            className="p-6 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          >
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              {item.title}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {item.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}