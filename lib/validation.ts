import type { Quote, ValidationErrors } from "./types";

export function validateQuote(quote: Quote): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!quote.title.trim()) errors.title = "Quote title is required.";
  if (!quote.customer.name.trim()) errors.customerName = "Customer name is required.";
  if (!quote.jobAddress.trim()) errors.jobAddress = "Job address is required.";
  if (!quote.validUntil) errors.validUntil = "Validity date is required.";
  if (quote.vatRate < 0 || quote.vatRate > 100) errors.vatRate = "VAT must be between 0 and 100%.";
  if (quote.depositPercent < 0 || quote.depositPercent > 100) {
    errors.depositPercent = "Deposit must be between 0 and 100%.";
  }

  quote.lineItems.forEach((item, index) => {
    if (!item.description.trim()) errors[`item-${item.id}-description`] = `Line ${index + 1} needs a description.`;
    if (item.quantity <= 0) errors[`item-${item.id}-quantity`] = `Line ${index + 1} quantity must be above 0.`;
    if (item.unitPrice < 0) errors[`item-${item.id}-unitPrice`] = `Line ${index + 1} price cannot be negative.`;
  });

  return errors;
}

export function firstError(errors: ValidationErrors): string | null {
  return Object.values(errors)[0] ?? null;
}
