"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { useTranslations } from "next-intl";

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sem IntersectionObserver: revela no próximo frame (setState dentro de um callback)
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setOn(true));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, on] as const;
}
type VisProps = { on: boolean };

// 1. Cadastre seu app: linhas de formulário (sem texto)
function FormVis(_: VisProps) {
  const widths = ["w-2/3", "w-3/4", "w-1/2", "w-3/5"];
  return (
    <div aria-hidden="true" className="mt-auto flex flex-col gap-1.5 pt-2">
      {widths.map((w) => (
        <div key={w} className="flex items-center gap-2 rounded-lg border border-[#34322A] px-2.5 py-2">
          <span className="h-1.5 w-8 rounded bg-[#F5B301]" />
          <span className={`h-1.5 rounded bg-[#34322A] ${w}`} />
        </div>
      ))}
    </div>
  );
}

// 2. Entre na fila: 12 vagas que vão se preenchendo
function QueueVis({ on }: VisProps) {
  return (
    <div aria-hidden="true" className="mt-auto grid grid-cols-6 gap-1.5 pt-2">
      {Array.from({ length: 12 }, (_, i) => (
        <i
          key={i}
          style={{ transitionDelay: `${i * 70}ms` }}
          className={`block aspect-square rounded-md transition-colors duration-500 motion-reduce:transition-none ${
            on && i < 9 ? "bg-[#F5B301]" : "bg-[#34322A]"
          }`}
        />
      ))}
    </div>
  );
}


// 3. Rodada de 14 dias: setup 2 + teste 14 + folga 2, em proporção
function TimelineVis() {
  const segs = [
    { id: "setup", flex: 2, color: "bg-[#A8A596]", delay: 0 },
    { id: "teste", flex: 14, color: "bg-[#F5B301]", delay: 300 },
    { id: "folga", flex: 2, color: "bg-[#34322A]", delay: 900 },
  ];
  return (
    <div aria-hidden="true" className="mt-auto pt-2">
      <div className="flex h-3.5 gap-1">
        {segs.map((s) => (
          <i
            key={s.id}
            style={{ flex: s.flex, transitionDelay: `${s.delay}ms` }}
            className={`origin-left scale-x-100 rounded-full transition-transform duration-1000 group-data-[reveal=hidden]/step:scale-x-0 motion-reduce:transition-none ${s.color}`}
          />
        ))}
      </div>
    </div>
  );
}

// 4. Todos passam: A testa B, B testa C, C testa A
function CycleVis(_: VisProps) {
  const arrow = "fill-none stroke-[#F5B301] stroke-2";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 92"
      className="mx-auto mt-auto block h-auto w-full max-w-[150px] pt-2"
    >
      <path className={arrow} strokeDasharray="4 4" strokeLinecap="round" d="M68 20Q96 38 98 60" />
      <path className={arrow} strokeDasharray="4 4" strokeLinecap="round" d="M90 78Q60 90 30 78" />
      <path className={arrow} strokeDasharray="4 4" strokeLinecap="round" d="M22 60Q24 38 52 20" />
      {[
        { x: 60, y: 14, l: "A" },
        { x: 102, y: 74, l: "B" },
        { x: 18, y: 74, l: "C" },
      ].map((n) => (
        <g key={n.l}>
          <circle cx={n.x} cy={n.y} r="11" className="fill-[#1D1C16] stroke-[#F5B301] stroke-2" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" className="fill-[#F4F1E8] font-mono text-[11px]">
            {n.l}
          </text>
        </g>
      ))}
    </svg>
  );
}

const VISUALS: ComponentType<VisProps>[] = [FormVis, QueueVis, TimelineVis, CycleVis];

function Step({ index, item }: { index: number; item: { title: string; desc: string } }) {
  const [ref, on] = useReveal<HTMLLIElement>();
  const Vis = VISUALS[index];
  return (
    <li
      ref={ref}
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`relative flex flex-col transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <span
        aria-hidden="true"
        className="relative z-10 mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F5B301] font-mono text-[15px] font-medium text-[#14130F]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <article className="flex flex-1 flex-col gap-3 rounded-2xl border border-[#34322A] bg-[#1D1C16] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#F5B301] motion-reduce:transition-none">
        <h3 className="text-lg font-bold">{item.title}</h3>
        <p className="text-[15px] leading-relaxed text-[#A8A596]">{item.desc}</p>
        {Vis ? <Vis on={on} /> : null}
      </article>
    </li>
  );
}

export function Features() {
  const t = useTranslations("landing.features");
  const items = t.raw("items") as { title: string; desc: string }[];
  const [lineRef, lineOn] = useReveal<HTMLDivElement>();

  return (
    <section id="como" className="bg-[#14130F] py-28 text-[#F4F1E8]" aria-labelledby="features-heading">
      <div className="mx-auto max-w-[1120px] px-6 sm:px-8">
        <h2 id="features-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          {t("title")}
        </h2>
        <div className="relative mt-16">
          <div
            ref={lineRef}
            aria-hidden="true"
            className="absolute left-[22px] right-[22px] top-[22px] hidden h-0.5 overflow-hidden bg-[#34322A] lg:block"
          >
            <i
              className={`block h-full origin-left bg-[#F5B301] transition-transform duration-[1600ms] ease-out motion-reduce:transition-none ${
                lineOn ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </div>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <Step key={index} index={index} item={item} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
