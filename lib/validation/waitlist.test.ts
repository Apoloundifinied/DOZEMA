import { describe, it, expect } from "vitest";
import { waitlistSchema } from "./waitlist";

describe("waitlistSchema", () => {
  it("aceita e-mail válido com token", () => {
    const result = waitlistSchema.safeParse({
      email: "dev@exemplo.com",
      turnstileToken: "token-qualquer",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita e-mail inválido", () => {
    const result = waitlistSchema.safeParse({
      email: "nao-e-email",
      turnstileToken: "token",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita token vazio", () => {
    const result = waitlistSchema.safeParse({
      email: "dev@exemplo.com",
      turnstileToken: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita e-mail acima de 254 caracteres", () => {
    const result = waitlistSchema.safeParse({
      email: `${"a".repeat(246)}@exemplo.com`,
      turnstileToken: "token",
    });
    expect(result.success).toBe(false);
  });

  it("aplica locale pt-BR por padrão e aceita en", () => {
    const padrao = waitlistSchema.safeParse({ email: "dev@exemplo.com", turnstileToken: "t" });
    const en = waitlistSchema.safeParse({ email: "dev@exemplo.com", turnstileToken: "t", locale: "en" });
    expect(padrao.success && padrao.data.locale).toBe("pt-BR");
    expect(en.success && en.data.locale).toBe("en");
  });

  it("rejeita locale desconhecido", () => {
    const result = waitlistSchema.safeParse({
      email: "dev@exemplo.com",
      turnstileToken: "token",
      locale: "fr",
    });
    expect(result.success).toBe(false);
  });
});
