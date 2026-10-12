// Verificação do Cloudflare Turnstile (anti-bot) — formato canônico do siteverify.
// Sem TURNSTILE_SECRET_KEY (dev local), aceita apenas o token "dev-bypass".
// Ação e hostname são validados contra envs (TURNSTILE_HOSTNAMES = produção, localhost só em dev).
export async function verifyTurnstile(
  token: string,
  opts?: { action?: string }
): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    return token === "dev-bypass";
  }

  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? process.env.APP_URL ?? "")
      .split(",")
      .map((h) => h.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, ""))
      .filter((h) => h && h !== "localhost" && h !== "127.0.0.1")
  );
  // Em dev, localhost é permitido; em produção a env TURNSTILE_HOSTNAMES não deve incluí-lo
  if (process.env.NODE_ENV !== "production") {
    expectedHostnames.add("localhost");
    expectedHostnames.add("127.0.0.1");
  }

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048 ||
    expectedHostnames.size === 0
  ) {
    return false;
  }

  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData }
    );
    const data = (await response.json()) as {
      success?: boolean;
      action?: string;
      hostname?: string;
    };
    if (data.success !== true) return false;
    if (opts?.action && data.action !== opts.action) return false;
    if (data.hostname && !expectedHostnames.has(data.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}
