import { z } from "zod";

// Evento de analítico próprio (Fase 0). Tipos mínimos: visita e clique no CTA.
export const trackEventSchema = z.object({
  type: z.enum(["page_view", "cta_click"]),
  locale: z.enum(["pt-BR", "en"]).optional(),
  path: z.string().max(200).startsWith("/").optional(),
  referrer: z.string().max(500).optional(),
});

export type TrackEventInput = z.infer<typeof trackEventSchema>;
