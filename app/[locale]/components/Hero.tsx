"use client";

import { useEffect, useRef, useState } from "react"; // NOVO: useState
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { WaitlistForm } from "./WaitlistForm";

const KEYFRAMES = `
@keyframes dz-up{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
@keyframes dz-mark{from{background-size:0 100%}to{background-size:100% 100%}}
@keyframes dz-check{from{stroke-dashoffset:24}to{stroke-dashoffset:0}}
@keyframes dz-pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.22)}}
`;

const rise = "animate-[dz-up_.8s_ease_both] motion-reduce:animate-none";
const pulse =
  "origin-center [transform-box:fill-box] animate-[dz-pulse_3.6s_ease-in-out_infinite] motion-reduce:animate-none";

// 12 pontos em círculo (raio 140), começando no topo. Valores fixos para evitar diferença servidor/cliente.
const DOTS = [
  [0, -140], [70, -121.2], [121.2, -70], [140, 0], [121.2, 70], [70, 121.2],
  [0, 140], [-70, 121.2], [-121.2, 70], [-140, 0], [-121.2, -70], [-70, -121.2],
] as const;
const CIRC = 2 * Math.PI * 100;

function HeroRing({ joined = false }: { joined?: boolean }) {
  const arcRef = useRef<SVGCircleElement>(null);
  const dayRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const arc = arcRef.current;
    const day = dayRef.current;
    if (!arc || !day) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      arc.style.strokeDashoffset = "0";
      day.textContent = "14";
      return;
    }

    let raf = 0;
    let last = "";
    const frame = (t: number) => {
      const p = ((t / 1000) % 14) / 14;
      arc.style.strokeDashoffset = String(CIRC * (1 - p));
      const n = String(Math.floor(p * 14) + 1);
      if (n !== last) {
        day.textContent = n;
        last = n;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      aria-hidden="true"
      viewBox="-180 -180 360 360"
      className="h-auto w-full max-w-[440px] overflow-visible"
    >
      <circle r="170" className="fill-[#F5B301]/25 dark:fill-[#F5B301]/20" />
      <circle r="100" fill="none" strokeWidth={8} className="stroke-[#E6E2D6] dark:stroke-[#2B2A22]" />
      <circle
        ref={arcRef}
        r="100"
        fill="none"
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={CIRC}
        strokeDashoffset={CIRC}
        transform="rotate(-90)"
        className="stroke-[#F5B301]"
      />
      {DOTS.map(([x, y], i) => {
        if (i === 0) {
          return joined ? (
            <circle key={i} cx={x} cy={y} r={11} className={`fill-[#F5B301] ${pulse}`} />
          ) : (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={11}
              fill="none"
              strokeWidth={2}
              strokeDasharray="4 3"
              className="stroke-[#F5B301]"
            />
          );
        }
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={11}
            style={{ animationDelay: `${i * 0.3}s` }}
            className={`fill-[#F5B301] ${pulse}`}
          />
        );
      })}
      <text
        ref={dayRef}
        y="26"
        fontSize="72"
        fontWeight="800"
        textAnchor="middle"
        className="fill-[#14130F] dark:fill-[#F4F1E8]"
      >
        1
      </text>
      <text y="54" fontSize="16" textAnchor="middle" className="fill-[#5B5950] font-mono dark:fill-[#A8A596]">
        /14
      </text>
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-[0.08em] inline-block h-[0.7em] w-[0.7em] align-[-0.04em]">
      <path
        d="M4 12.5l5 5L20 6.5"
        fill="none"
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={24}
        style={{ animationDelay: "1.5s" }}
        className="stroke-[#F5B301] animate-[dz-check_.7s_ease_both] motion-reduce:animate-none"
      />
    </svg>
  );
}

export function Hero({ siteKey }: { siteKey: string }) {
  const t = useTranslations("landing.hero");
  const tf = useTranslations("landing.features");
  const [joined, setJoined] = useState(false); // NOVO

  // "A. B. C." vira três frases animadas; se o texto traduzido não tiver 3 frases, mostra normal.
  const parts = t("tagline").split(/(?<=[.!?])\s+/).filter(Boolean);
  const three = parts.length === 3;

  return (
    <header className="relative flex min-h-[min(100vh,880px)] flex-col overflow-hidden bg-[#FBFAF7] text-[#14130F] dark:bg-[#0F0E0B] dark:text-[#F4F1E8]">
      <style>{KEYFRAMES}</style>

      <div className="mx-auto flex h-20 w-full max-w-[1120px] items-center justify-between px-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
          <Image src="/logo_dozena.png" alt="Dozena" width={36} height={36} priority className="rounded-lg" />
          <span className="text-[22px] font-extrabold tracking-tight">dozena</span>
        </Link>
        <a
          href="#como"
          className="rounded-md text-[15px] text-[#5B5950] transition-colors hover:text-[#14130F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current dark:text-[#A8A596] dark:hover:text-[#F4F1E8] motion-reduce:transition-none"
        >
          {tf("title")}
        </a>
      </div>

      <div className="mx-auto flex w-full max-w-[1120px] flex-1 flex-wrap items-center gap-14 px-6 pb-24 sm:px-8">
        <div className="flex flex-1 basis-[460px] flex-col gap-6">
          <h1 className="text-[clamp(42px,6vw,72px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
            {three ? (
              <>
                <span className={`inline-block ${rise}`} style={{ animationDelay: "100ms" }}>
                  {parts[0]}
                </span>{" "}
                <span className={`inline-block ${rise}`} style={{ animationDelay: "280ms" }}>
                  <span
                    style={{ animationDelay: "900ms" }}
                    className="bg-[linear-gradient(transparent_62%,rgba(245,179,1,.28)_62%)] bg-no-repeat [background-size:100%_100%] animate-[dz-mark_.9s_ease_both] motion-reduce:animate-none"
                  >
                    {parts[1]}
                  </span>
                </span>{" "}
                <span className={`inline-block ${rise}`} style={{ animationDelay: "460ms" }}>
                  {parts[2]}
                  <Check />
                </span>
              </>
            ) : (
              t("tagline")
            )}
          </h1>
          <p
            className={`max-w-[500px] text-lg leading-relaxed text-[#5B5950] dark:text-[#A8A596] sm:text-xl ${rise}`}
            style={{ animationDelay: "700ms" }}
          >
            {t("subtitle")}
          </p>
          <p
            className={`max-w-[500px] font-mono text-[13px] text-[#8A877A] dark:text-[#6F6C60] ${rise}`}
            style={{ animationDelay: "800ms" }}
          >
            ⓘ {t("note")}
          </p>
          <div className={`w-full max-w-[520px] ${rise}`} style={{ animationDelay: "900ms" }}>
            <WaitlistForm siteKey={siteKey} onSuccess={() => setJoined(true)} /> {/* NOVO */}
          </div>
        </div>

        <div className={`flex flex-1 basis-[360px] justify-center ${rise}`} style={{ animationDelay: "460ms" }}>
          <HeroRing joined={joined} /> {/* NOVO */}
        </div>
      </div>
    </header>
  );
}
