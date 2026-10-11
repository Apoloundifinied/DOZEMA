// Validação da integração Supabase + waitlist (node scripts/verify-waitlist.mjs)
// Usa a secret key (bypassa RLS). Insere um e-mail de teste e remove depois.
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

const email = `teste-${Date.now()}@exemplo.com`;

async function main() {
  // 1. Insert
  const ins = await fetch(`${URL}/rest/v1/waitlist`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify({ email }),
  });
  const insBody = await ins.text();
  console.log("insert:", ins.status, insBody.slice(0, 200));
  if (!ins.ok) process.exit(1);

  // 2. Duplicata deve falhar (unique)
  const dup = await fetch(`${URL}/rest/v1/waitlist`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email }),
  });
  console.log("duplicata rejeitada:", dup.status === 409 ? "OK (409)" : `HTTP ${dup.status}`);

  // 3. Select (secret key bypassa RLS — anon não conseguiria ler)
  const sel = await fetch(`${URL}/rest/v1/waitlist?email=eq.${email}&select=email`, { headers });
  console.log("select (secret):", sel.status, await sel.text());

  // 4. Anon NÃO pode ler (RLS sem policy de select)
  const anon = await fetch(`${URL}/rest/v1/waitlist?select=email`, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
  });
  const anonBody = await anon.text();
  console.log("select (anon, deve vir vazio []):", anon.status, anonBody);

  // 5. Cleanup
  const del = await fetch(`${URL}/rest/v1/waitlist?email=eq.${email}`, { method: "DELETE", headers });
  console.log("cleanup:", del.status);
}

main().catch((e) => {
  console.error("ERRO:", e.message);
  process.exit(1);
});
