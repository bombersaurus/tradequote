import { formatCurrency, lineItemTotal } from "@/lib/calculations";
import type { Quote, QuoteTotals } from "@/lib/types";

type QuotePreviewProps = {
  quote: Quote;
  totals: QuoteTotals;
  paidUnlocked: boolean;
};

export function QuotePreview({ quote, totals, paidUnlocked }: QuotePreviewProps) {
  return (
    <section className="quote-preview" aria-labelledby="preview-heading">
      <div className="preview-paper">
        <header className="preview-header">
          <div>
            <p className="preview-kicker">Quote</p>
            <h2 id="preview-heading">{quote.title || "Untitled quote"}</h2>
            <p>{quote.quoteNumber}</p>
          </div>
          <div className="business-block">
            <strong>{quote.business.name}</strong>
            <span>{quote.business.registration}</span>
            <span>{quote.business.email}</span>
            <span>{quote.business.phone}</span>
          </div>
        </header>

        <div className="preview-meta">
          <div>
            <span>Prepared for</span>
            <strong>{quote.customer.name || "Customer name"}</strong>
            <p>{quote.customer.email}</p>
            <p>{quote.customer.phone}</p>
          </div>
          <div>
            <span>Job address</span>
            <strong>{quote.jobAddress || "Job address"}</strong>
          </div>
          <div>
            <span>Issued</span>
            <strong>{formatDate(quote.issueDate)}</strong>
            <span>Valid until</span>
            <strong>{formatDate(quote.validUntil)}</strong>
          </div>
        </div>

        <div className="preview-lines">
          <div className="preview-line preview-line-header">
            <span>Description</span>
            <span>Qty</span>
            <span>Unit price</span>
            <span>Total</span>
          </div>
          {quote.lineItems.map((item) => (
            <div className="preview-line" key={item.id}>
              <span>
                <strong>{item.description || "Line item"}</strong>
                <small>{item.category}</small>
              </span>
              <span>
                {item.quantity} {item.unit}
              </span>
              <span>{formatCurrency(item.unitPrice)}</span>
              <span>{formatCurrency(lineItemTotal(item))}</span>
            </div>
          ))}
        </div>

        <div className="preview-bottom">
          <div>
            <span>Notes</span>
            <p>{quote.notes}</p>
          </div>
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatCurrency(totals.subtotal)}</dd>
            </div>
            <div>
              <dt>VAT</dt>
              <dd>{formatCurrency(totals.tax)}</dd>
            </div>
            <div className="grand-total">
              <dt>Total</dt>
              <dd>{formatCurrency(totals.total)}</dd>
            </div>
            <div>
              <dt>Deposit due</dt>
              <dd>{formatCurrency(totals.deposit)}</dd>
            </div>
          </dl>
        </div>

        {quote.includeBranding || !paidUnlocked ? (
          <footer className="preview-branding">Prepared with TradeQuote</footer>
        ) : null}
      </div>
    </section>
  );
}

function formatDate(date: string): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(date));
}
