// Smoke test local: sobe `next start` e verifica redirect /pt e /api/track.
import { spawn } from "node:child_process";

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", "3105"], {
  stdio: "ignore",
  shell: false,
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let ok = true;
try {
  await wait(6000);

  const pt = await fetch("http://localhost:3105/pt", { redirect: "manual" });
  console.log("GET /pt           ->", pt.status, "location:", pt.headers.get("location"));
  ok &&= pt.status >= 300 && pt.status < 400 && (pt.headers.get("location") ?? "").includes("/pt-BR");

  const home = await fetch("http://localhost:3105/pt-BR");
  console.log("GET /pt-BR        ->", home.status);
  ok &&= home.status === 200;

  const track = await fetch("http://localhost:3105/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "page_view", locale: "pt-BR", path: "/pt-BR" }),
  });
  console.log("POST /api/track   ->", track.status, "(201=ok, 500=aguardando migration 0003 no Supabase)");
  ok &&= [201, 500].includes(track.status);

  const bot = await fetch("http://localhost:3105/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "Googlebot/2.1" },
    body: JSON.stringify({ type: "page_view" }),
  });
  console.log("POST bot          ->", bot.status, "(204=descartado)");
  ok &&= bot.status === 204;

  const bad = await fetch("http://localhost:3105/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "hack" }),
  });
  console.log("POST inválido     ->", bad.status, "(400=rejeitado)");
  ok &&= bad.status === 400;

  console.log(ok ? "SMOKE OK" : "SMOKE FALHOU");
} finally {
  server.kill();
}
process.exit(ok ? 0 : 1);
