import jsPDF from "jspdf";
import { calculateQuoteTotals, formatCurrency, lineItemTotal } from "./calculations";
import type { Quote, QuoteDisplayOptions } from "./types";

const defaultDisplayOptions: QuoteDisplayOptions = {
  showCustomerContact: true,
  showJobAddress: true,
  showUnitPrices: true,
  showVatBreakdown: true,
  showDeposit: true,
  showNotes: true,
  showBranding: true,
};

export function exportQuotePdf(quote: Quote, paidUnlocked: boolean, options = defaultDisplayOptions): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const totals = calculateQuoteTotals(quote);
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 48;

  doc.setFillColor(16, 24, 40);
  doc.rect(0, 0, pageWidth, 92, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(quote.business.name, 48, 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${quote.business.email} | ${quote.business.phone}`, 48, 64);
  doc.text(quote.business.registration, 48, 80);

  y = 128;
  doc.setTextColor(16, 24, 40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Quote", 48, y);
  doc.setFontSize(12);
  doc.text(quote.quoteNumber, pageWidth - 48, y, { align: "right" });

  y += 32;
  doc.setFont("helvetica", "bold");
  doc.text(quote.title || "Untitled quote", 48, y);
  doc.setFont("helvetica", "normal");
  doc.text(`Issued: ${formatDate(quote.issueDate)}`, pageWidth - 48, y, { align: "right" });
  y += 18;
  doc.text(`Valid until: ${formatDate(quote.validUntil)}`, pageWidth - 48, y, { align: "right" });

  y += 32;
  doc.setFont("helvetica", "bold");
  doc.text("Customer", 48, y);
  if (options.showJobAddress) doc.text("Job address", 306, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  const customerLines = options.showCustomerContact
    ? [quote.customer.name, quote.customer.email, quote.customer.phone].filter(Boolean)
    : [quote.customer.name].filter(Boolean);
  doc.text(customerLines, 48, y);
  if (options.showJobAddress) doc.text(doc.splitTextToSize(quote.jobAddress, 230), 306, y);

  y += 74;
  doc.setDrawColor(214, 222, 232);
  doc.line(48, y, pageWidth - 48, y);
  y += 24;

  doc.setFont("helvetica", "bold");
  doc.text("Description", 48, y);
  doc.text("Qty", 324, y, { align: "right" });
  if (options.showUnitPrices) {
    doc.text("Unit", 366, y);
    doc.text("Price", 456, y, { align: "right" });
  }
  doc.text("Total", pageWidth - 48, y, { align: "right" });
  y += 14;
  doc.line(48, y, pageWidth - 48, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  quote.lineItems.forEach((item) => {
    const descriptionLines = doc.splitTextToSize(item.description || "Untitled item", 250);
    if (y > 704) {
      doc.addPage();
      y = 56;
    }
    doc.text(descriptionLines, 48, y);
    doc.text(String(item.quantity), 324, y, { align: "right" });
    if (options.showUnitPrices) {
      doc.text(item.unit, 366, y);
      doc.text(formatCurrency(item.unitPrice), 456, y, { align: "right" });
    }
    doc.text(formatCurrency(lineItemTotal(item)), pageWidth - 48, y, { align: "right" });
    y += Math.max(24, descriptionLines.length * 13 + 10);
  });

  y += 10;
  doc.line(306, y, pageWidth - 48, y);
  y += 22;
  if (options.showVatBreakdown) {
    totalRow(doc, "Subtotal", totals.subtotal, y, pageWidth);
    y += 18;
    totalRow(doc, `VAT (${quote.vatRate}%)`, totals.tax, y, pageWidth);
    y += 18;
  }
  doc.setFont("helvetica", "bold");
  totalRow(doc, "Total", totals.total, y, pageWidth);
  y += 18;
  if (options.showDeposit) totalRow(doc, `Deposit (${quote.depositPercent}%)`, totals.deposit, y, pageWidth);

  if (options.showNotes) {
    y += 38;
    doc.setFont("helvetica", "bold");
    doc.text("Notes", 48, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(quote.notes, pageWidth - 96), 48, y);
  }

  if (options.showBranding && (!paidUnlocked || quote.includeBranding)) {
    doc.setFontSize(9);
    doc.setTextColor(99, 112, 132);
    doc.text("Prepared with TradeQuote", pageWidth / 2, 806, { align: "center" });
  }

  doc.save(`${quote.quoteNumber || "tradequote"}-${slug(quote.title || "quote")}.pdf`);
}

function totalRow(doc: jsPDF, label: string, value: number, y: number, pageWidth: number): void {
  doc.text(label, 348, y);
  doc.text(formatCurrency(value), pageWidth - 48, y, { align: "right" });
}

function formatDate(date: string): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(date));
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
