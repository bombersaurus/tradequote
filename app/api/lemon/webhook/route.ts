import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  return NextResponse.json({
    received: true,
    mode: process.env.LEMONSQUEEZY_WEBHOOK_SECRET ? "placeholder-configured" : "mock",
    event: payload?.meta?.event_name ?? "unknown",
    message: "Lemon Squeezy webhook placeholder. Add signature verification and entitlement persistence in production.",
  });
}
