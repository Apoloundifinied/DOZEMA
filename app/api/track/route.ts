import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { trackEventSchema } from "@/lib/validation/events";
import { createSupabaseAnonClient } from "@/lib/supabase/server";

// POST /api/track — analítico próprio da Fase 0 (page_view / cta_click).
// Usa o client anon: a RLS da tabela `events` permite insert, nunca read.
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const parsed = trackEventSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(null, { status: 400 });
  }

  // UA só server-side (coletado do request, não enviado pelo cliente)
  const headerList = await headers();
  const ua = headerList.get("user-agent")?.slice(0, 300);

  // Filtro simples de bots para não poluir o funil de validação
  if (ua && /bot|crawler|spider|headless|preview/i.test(ua)) {
    return new Response(null, { status: 204 });
  }

  try {
    const supabase = createSupabaseAnonClient();
    const { error } = await supabase.from("events").insert({ ...parsed.data, ua });
    if (error) {
      return new Response(null, { status: 500 });
    }
  } catch {
    return new Response(null, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
