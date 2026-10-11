// Verificação do Cloudflare Turnstile (anti-bot).
// Sem TURNSTILE_SECRET_KEY (dev local), aceita apenas o token "dev-bypass".
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    return token === "dev-bypass";
  }

  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData }
    );
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
