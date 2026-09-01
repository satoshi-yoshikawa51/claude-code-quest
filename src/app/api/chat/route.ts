import { NextRequest, NextResponse } from "next/server";

// Model is pinned server-side. It used to be sent from the browser, which
// meant (a) anyone could call this endpoint with any model / max_tokens and
// (b) a model retirement required a client change. claude-sonnet-4-20250514
// was retired on 2026-06-15 and every AI call had been failing silently
// (the game fell back to canned hints). Next retirement is a 1-line fix here.
const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 1000;

export async function POST(req: NextRequest) {
  const { messages, system } = await req.json();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: MODEL, messages, system, max_tokens: MAX_TOKENS }),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
