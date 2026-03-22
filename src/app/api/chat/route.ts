import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { model, messages, system, max_tokens } = await req.json();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model, messages, system, max_tokens }),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
