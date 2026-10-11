"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { joinWaitlist } from "@/app/actions/waitlist";

interface WaitlistFormProps {
  siteKey: string;
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

export function WaitlistForm({ siteKey }: WaitlistFormProps) {
  const t = useTranslations("landing.form");
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

    if (window.turnstile) {
      renderWidget();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = renderWidget;
    document.head.appendChild(script);

    return () => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
    } else {
      setStatus("error");
      setMessage(result.error ?? t("error"));
    }
  };

  const submitting = status === "submitting";
  const done = status === "success";
  const waitingCaptcha = Boolean(siteKey) && !captchaReady;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 text-left">
          {t("emailLabel")}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting || done}
          required
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-500 focus:border-transparent focus:outline-none disabled:opacity-60"
          aria-invalid={status === "error"}
        />
      </div>

      {siteKey && <div ref={containerRef} className="flex justify-center min-h-[65px]" />}

      <button
        type="submit"
        disabled={submitting || done || waitingCaptcha}
        className="w-full py-3 px-4 rounded-lg font-medium transition-colors bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? t("submitting") : done ? "✓" : t("submit")}
      </button>

      {message && (
        <p
          className={`text-center text-sm ${
            status === "success"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </form>
  );
}
