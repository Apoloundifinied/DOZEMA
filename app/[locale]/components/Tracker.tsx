"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

// Analítico próprio (Fase 0): registra page_view na montagem.
// Sem cookies, sem fingerprint, sem IP salvo — referrer vindo do document.referrer.
export function Tracker() {
  const locale = useLocale() as "pt-BR" | "en";

  useEffect(() => {
    const payload = JSON.stringify({
      type: "page_view",
      locale,
      path: window.location.pathname,
      referrer: document.referrer || undefined,
    });
    // sendBeacon sobrevive a fechamento/aba em background; fallback fetch
    const sent = navigator.sendBeacon(
      "/api/track",
      new Blob([payload], { type: "application/json" })
    );
    if (!sent) {
      fetch("/api/track", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  }, [locale]);

  return null;
}
