import type { LineItem, Quote, QuoteTotals } from "./types";

export function lineItemTotal(item: LineItem): number {
  return safeNumber(item.quantity) * safeNumber(item.unitPrice);
}

export function calculateQuoteTotals(quote: Quote): QuoteTotals {
  const subtotal = quote.lineItems.reduce((sum, item) => sum + lineItemTotal(item), 0);
  const taxableSubtotal = quote.lineItems
    .filter((item) => item.taxable)
    .reduce((sum, item) => sum + lineItemTotal(item), 0);
  const tax = taxableSubtotal * (safeNumber(quote.vatRate) / 100);
  const total = subtotal + tax;
  const deposit = total * (safeNumber(quote.depositPercent) / 100);

  return {
    subtotal,
    taxableSubtotal,
    tax,
    total,
    deposit,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function safeNumber(value: number | string): number {
  const parsed = typeof value === "string" ? Number.parseFloat(value) : value;
  return Number.isFinite(parsed) ? parsed : 0;
}
