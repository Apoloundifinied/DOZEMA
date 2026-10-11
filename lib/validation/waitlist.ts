import { z } from "zod";

const emailSchema = z.string().email("E-mail inválido").max(254);
const turnstileTokenSchema = z.string().min(1, "Complete a verificação para continuar");

export const waitlistSchema = z.object({
  email: emailSchema,
  turnstileToken: turnstileTokenSchema,
  locale: z.enum(["pt-BR", "en"]).default("pt-BR"),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;