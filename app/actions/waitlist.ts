"use server";

import { waitlistSchema, type WaitlistInput } from "@/lib/validation/waitlist";
import { verifyTurnstile } from "@/lib/turnstile";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { sendWaitlistConfirmation } from "@/lib/notify/email";

type WaitlistResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function joinWaitlist(input: WaitlistInput): Promise<WaitlistResult> {
  // 1. Validação com Zod (e-mail + token do Turnstile)
  const parsed = waitlistSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Dados inválidos." };
  }

  const { email, turnstileToken, locale } = parsed.data;

  // 2. Verificação anti-bot (Cloudflare Turnstile)
  const isHuman = await verifyTurnstile(turnstileToken);
  if (!isHuman) {
    return { success: false, error: "Falha na verificação. Tente novamente." };
  }

  // 3. Insert na tabela waitlist (service role; a tabela tem RLS sem read)
  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("waitlist").insert({ email: email.toLowerCase().trim() });

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Este e-mail já está na lista de espera." };
      }
      return { success: false, error: "Erro ao salvar. Tente novamente mais tarde." };
    }
  } catch {
    return { success: false, error: "Serviço indisponível. Tente novamente mais tarde." };
  }

  // 4. Confirmação por e-mail (não bloqueia: falha não reprova a inscrição)
  await sendWaitlistConfirmation(email.toLowerCase().trim(), locale);

  return {
    success: true,
    message: "Você entrou na lista! Vamos te avisar quando a primeira rodada abrir.",
  };
}
