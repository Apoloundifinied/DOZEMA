// Verifica produção (Vercel): redirect /pt, home e /api/track.
const base = "https://dozema-nkdq.vercel.app";
const pt = await fetch(`${base}/pt`, { redirect: "manual" });
console.log("/pt        ->", pt.status, "location:", pt.headers.get("location"));

const home = await fetch(`${base}/pt-BR`);
console.log("/pt-BR     ->", home.status);

const track = await fetch(`${base}/api/track`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ type: "page_view", locale: "pt-BR", path: "/pt-BR", referrer: "smoke-prod" }),
});
console.log("/api/track ->", track.status, track.status === 201 ? "(gravando ✓)" : "(500=falta migration 0003 no Supabase)");
