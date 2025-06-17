import { NextRequest, NextResponse } from "next/server";

// Simple mock persistence endpoint. In dev this just logs the incoming body.
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("[mock-settings-api] received settings", data);
    // TODO: persist to DB when backend ready
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[mock-settings-api] failed", err);
    return new NextResponse("Invalid payload", { status: 400 });
  }
}
