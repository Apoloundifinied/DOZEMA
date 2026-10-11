"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { joinWaitlist } from "@/app/actions/waitlist";

// Dispara evento do analítico próprio (Fase 0); falhas nunca bloqueiam o envio
function track(type: "cta_click", locale: string) {
  const payload = JSON.stringify({ type, locale, path: window.location.pathname });
  const sent = navigator.sendBeacon(
    "/api/track",
    new Blob([payload], { type: "application/json" })
  );
  if (!sent) {
    fetch("/api/track", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
  }
}

interface WaitlistFormProps {
  siteKey: string;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function WaitlistForm({ siteKey, onSuccess }: WaitlistFormProps) {
  const t = useTranslations("landing.form");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const turnstileTokenRef = useRef("");
  const widgetIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [captchaReady, setCaptchaReady] = useState(false);

  // Injeta o script do Turnstile e renderiza o widget (se houver site key)
  useEffect(() => {
    if (!siteKey) return; // dev sem Turnstile configurado

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          turnstileTokenRef.current = token;
          setCaptchaReady(true);
        },
        "expired-callback": () => {
          turnstileTokenRef.current = "";
          setCaptchaReady(false);
        },
        "error-callback": () => {
          turnstileTokenRef.current = "";
          setCaptchaReady(false);
        },
      });
    };

    let script: HTMLScriptElement | null = null;
    if (window.turnstile) {
      renderWidget();
    } else {
      // reaproveita o script se ele já foi inserido (evita duplicar em StrictMode/HMR)
      script = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
      if (!script) {
        script = document.createElement("script");
        script.src = TURNSTILE_SRC;
        script.async = true;
        script.defer = true;
        script.dataset.turnstile = "1";
        document.head.appendChild(script);
      }
      script.addEventListener("load", renderWidget);
    }

    return () => {
      script?.removeEventListener("load", renderWidget);
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    track("cta_click", locale);
    setStatus("submitting");
    setMessage("");

    const result = await joinWaitlist({
      email,
      turnstileToken: turnstileTokenRef.current || "dev-bypass",
    });

    if (result.success) {
      setStatus("success");
      setMessage(result.message ?? "");
      setEmail("");
      turnstileTokenRef.current = "";
      setCaptchaReady(false);
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
      onSuccess?.();
    } else {
      setStatus("error");
      setMessage(result.error ?? t("error"));
    }
  };

  const submitting = status === "submitting";
  const done = status === "success";
  const waitingCaptcha = Boolean(siteKey) && !captchaReady;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3" noValidate>
      <label htmlFor="email" className="block text-sm font-medium">
        {t("emailLabel")}
      </label>

      <div className="flex flex-wrap gap-2.5">
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting || done}
          required
          aria-invalid={status === "error"}
          className="min-h-[52px] flex-[1_1_230px] rounded-xl border-2 border-[#E6E2D6] bg-white px-4 text-[17px] text-[#14130F] placeholder-[#8A877A] transition focus:border-[#F5B301] focus:outline-none focus:ring-4 focus:ring-[#F5B301]/25 disabled:opacity-60 aria-[invalid=true]:border-red-500 dark:border-[#2B2A22] dark:bg-[#1A1914] dark:text-[#F4F1E8] dark:placeholder-[#6F6C60] motion-reduce:transition-none"
        />
        <button
          type="submit"
          disabled={submitting || done || waitingCaptcha}
          className="inline-flex min-h-[52px] grow items-center justify-center rounded-xl bg-[#F5B301] px-7 font-bold text-[#14130F] transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFC933] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14130F] active:translate-y-0 active:bg-[#D99B00] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#F5B301] dark:focus-visible:outline-[#F4F1E8] sm:grow-0 motion-reduce:transition-none"
        >
          {submitting ? t("submitting") : done ? "✓" : t("submit")}
        </button>
      </div>

      {siteKey && <div ref={containerRef} className="min-h-[65px]" />}

      <div role="status" aria-live="polite">
        {message && (
          <p
            className={`rounded-xl px-4 py-3 text-[15px] ${
              status === "success"
                ? "border-2 border-[#F5B301] bg-[#F5B301]/25 text-[#14130F] dark:text-[#F4F1E8]"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
