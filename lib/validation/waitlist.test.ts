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
});
