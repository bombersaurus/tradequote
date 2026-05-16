import { NextResponse } from "next/server";

export async function POST() {
  const configured = Boolean(
    process.env.LEMONSQUEEZY_API_KEY &&
      process.env.LEMONSQUEEZY_STORE_ID &&
      process.env.LEMONSQUEEZY_VARIANT_ID,
  );

  return NextResponse.json({
    mode: configured ? "placeholder-configured" : "mock",
    checkoutUrl: configured ? null : "/?mockPaidUnlock=true",
    message:
      "Lemon Squeezy checkout placeholder. Replace this route with a checkout-session call when real keys are configured.",
  });
}
