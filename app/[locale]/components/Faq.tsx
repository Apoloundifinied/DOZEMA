"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";

type QA = { q: string; a: string };

function FaqItem({ qa, index }: { qa: QA; index: number }) {
  const [open, setOpen] = useState(index === 0); // primeira pergunta aberta por padrão
  const btnId = `faq-btn-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <li className="rounded-2xl border border-[#E6E2D6] bg-white transition-colors dark:border-[#2B2A22] dark:bg-[#1A1914]">
      <h3>
        <button
          id={btnId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left text-[16px] font-bold transition-colors hover:text-[#D99B00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current motion-reduce:transition-none"
        >
          {qa.q}
          <span
            aria-hidden="true"
            className={`font-mono text-xl text-[#F5B301] transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-45" : ""}`}
          >
            +
          </span>
        </button>
      </h3>
      {open && (
        <div id={panelId} role="region" aria-labelledby={btnId} className="px-6 pb-6">
          <p className="text-[15px] leading-relaxed text-[#5B5950] dark:text-[#A8A596]">{qa.a}</p>
        </div>
      )}
    </li>
  );
}

export function Faq() {
  const t = useTranslations("landing.faq");
  const items = t.raw("items") as QA[];
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="faq"
      aria-labelledby="faq-heading"
      className={`bg-[#FBFAF7] py-24 text-[#14130F] transition-opacity duration-700 motion-reduce:transition-none motion-reduce:opacity-100 dark:bg-[#0F0E0B] dark:text-[#F4F1E8] ${on ? "opacity-100" : "opacity-0"}`}
    >
      <div className="mx-auto max-w-[820px] px-6 sm:px-8">
        <h2 id="faq-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>
        <ul className="mt-10 flex flex-col gap-3">
          {items.map((qa, i) => (
            <FaqItem key={i} qa={qa} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
