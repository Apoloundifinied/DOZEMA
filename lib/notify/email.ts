// Envio de e-mails via Resend (API REST pura — sem dependência nova, ver ADR-014).
// Sem RESEND_API_KEY configurada (dev), o envio é ignorado silenciosamente.
// Fase 0: remetente gratuito onboarding@resend.dev funciona sem domínio próprio.

const RESEND_URL = "https://api.resend.com/emails";

type Locale = "pt-BR" | "en";

const APP_URL = () => process.env.APP_URL ?? "https://dozema-nkdq.vercel.app";

const TEMPLATES: Record<Locale, { subject: string; html: (home: string) => string }> = {
  "pt-BR": {
    subject: "Você está na lista da Dozena ✅",
    html: (home) => `
      <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:520px;margin:auto;color:#14130F">
        <h1 style="font-size:22px">Você entrou na lista! 🎉</h1>
        <p>Somos uma dúzia de devs testando os apps uns dos outros por 14 dias para cumprir a regra 12/14 do Google Play — todo mundo passa.</p>
        <p>Quando fecharmos a primeira rodada (precisamos de ~13 devs), você recebe o convite aqui neste e-mail.</p>
        <p>Enquanto isso, ajuda a fechar a turma mais rápido: <a href="${home}">compartilhe a Dozena</a> com um dev que publica app no Google Play.</p>
        <p style="color:#6F6C60;font-size:13px">Dozena — open source (AGPL-3.0), grátis no MVP. Você recebeu este e-mail porque se inscreveu em ${home}.</p>
      </div>`,
  },
  en: {
    subject: "You're on the Dozena waitlist ✅",
    html: (home) => `
      <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:520px;margin:auto;color:#14130F">
        <h1 style="font-size:22px">You're on the list! 🎉</h1>
        <p>We're a dozen devs testing each other's apps for 14 days to meet Google Play's 12/14 rule — everyone gets through.</p>
        <p>As soon as the first round is full (~13 devs), you'll get your invite right here.</p>
        <p>Meanwhile, help us fill the round faster: <a href="${home}">share Dozena</a> with a dev who ships to Google Play.</p>
        <p style="color:#6F6C60;font-size:13px">Dozena — open source (AGPL-3.0), free during the MVP. You got this email because you signed up at ${home}.</p>
      </div>`,
  },
};

interface ResendResponse {
  id?: string;
  message?: string;
}

// Envia o e-mail de confirmação da waitlist. Nunca lança exceção:
// falha no e-mail não pode reprovar a inscrição (já gravada no banco).
export async function sendWaitlistConfirmation(email: string, locale: Locale): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // dev sem Resend configurado

  const from = process.env.EMAIL_FROM ?? "Dozena <onboarding@resend.dev>";
  const home = `${APP_URL()}/${locale}`;
  const t = TEMPLATES[locale] ?? TEMPLATES["pt-BR"];

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [email], subject: t.subject, html: t.html(home) }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as ResendResponse;
      console.error("[notify] Resend falhou:", res.status, data.message ?? "");
    }
  } catch (err) {
    console.error("[notify] Erro de rede ao enviar e-mail:", err);
  }
}
