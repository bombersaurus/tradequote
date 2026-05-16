import { formatCurrency, lineItemTotal } from "@/lib/calculations";
import type { PreviewMode, Quote, QuoteDisplayOptions, QuoteTotals } from "@/lib/types";

type QuotePreviewProps = {
  mode: PreviewMode;
  quote: Quote;
  totals: QuoteTotals;
  displayOptions: QuoteDisplayOptions;
  paidUnlocked: boolean;
};

export function QuotePreview({ mode, quote, totals, displayOptions, paidUnlocked }: QuotePreviewProps) {
  if (mode === "acceptance") {
    return <AcceptancePreview quote={quote} totals={totals} displayOptions={displayOptions} />;
  }

  return (
    <section className={mode === "pdf" ? "quote-preview pdf-preview" : "quote-preview"} aria-labelledby="preview-heading">
      {mode === "pdf" ? (
        <div className="preview-context">
          <strong>PDF export view</strong>
          <span>This is the customer document created by Export PDF.</span>
        </div>
      ) : null}
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
            {displayOptions.showCustomerContact ? (
              <>
                <p>{quote.customer.email}</p>
                <p>{quote.customer.phone}</p>
              </>
            ) : null}
          </div>
          {displayOptions.showJobAddress ? (
            <div>
              <span>Job address</span>
              <strong>{quote.jobAddress || "Job address"}</strong>
            </div>
          ) : null}
          <div>
            <span>Issued</span>
            <strong>{formatDate(quote.issueDate)}</strong>
            <span>Valid until</span>
            <strong>{formatDate(quote.validUntil)}</strong>
          </div>
        </div>

        <div className={displayOptions.showUnitPrices ? "preview-lines" : "preview-lines no-unit-prices"}>
          <div className="preview-line preview-line-header">
            <span>Description</span>
            <span>Qty</span>
            {displayOptions.showUnitPrices ? <span>Unit price</span> : null}
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
              {displayOptions.showUnitPrices ? <span>{formatCurrency(item.unitPrice)}</span> : null}
              <span>{formatCurrency(lineItemTotal(item))}</span>
            </div>
          ))}
        </div>

        <div className="preview-bottom">
          {displayOptions.showNotes ? (
            <div>
              <span>Notes</span>
              <p>{quote.notes}</p>
            </div>
          ) : null}
          <dl>
            {displayOptions.showVatBreakdown ? (
              <>
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatCurrency(totals.subtotal)}</dd>
                </div>
                <div>
                  <dt>VAT</dt>
                  <dd>{formatCurrency(totals.tax)}</dd>
                </div>
              </>
            ) : null}
            <div className="grand-total">
              <dt>Total</dt>
              <dd>{formatCurrency(totals.total)}</dd>
            </div>
            {displayOptions.showDeposit ? (
              <div>
                <dt>Deposit due</dt>
                <dd>{formatCurrency(totals.deposit)}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        {displayOptions.showBranding && (quote.includeBranding || !paidUnlocked) ? (
          <footer className="preview-branding">Prepared with TradeQuote</footer>
        ) : null}
      </div>
    </section>
  );
}

function AcceptancePreview({
  quote,
  totals,
  displayOptions,
}: {
  quote: Quote;
  totals: QuoteTotals;
  displayOptions: QuoteDisplayOptions;
}) {
  return (
    <section className="quote-preview acceptance-preview" aria-labelledby="acceptance-preview-heading">
      <div className="acceptance-card">
        <p className="preview-kicker">Acceptance link</p>
        <h2 id="acceptance-preview-heading">{quote.title || "Untitled quote"}</h2>
        <p className="acceptance-muted">A simple customer page for approving the quote.</p>

        <div className="acceptance-total">
          <span>Total quote</span>
          <strong>{formatCurrency(totals.total)}</strong>
          {displayOptions.showDeposit ? <small>Deposit due: {formatCurrency(totals.deposit)}</small> : null}
        </div>

        <div className="acceptance-summary">
          <div>
            <span>Customer</span>
            <strong>{quote.customer.name || "Customer name"}</strong>
          </div>
          {displayOptions.showJobAddress ? (
            <div>
              <span>Job address</span>
              <strong>{quote.jobAddress || "Job address"}</strong>
            </div>
          ) : null}
          <div>
            <span>Valid until</span>
            <strong>{formatDate(quote.validUntil)}</strong>
          </div>
        </div>

        <div className="acceptance-actions">
          <button type="button">Accept quote</button>
          <button type="button">Ask a question</button>
        </div>

        <p className="acceptance-footnote">This is a preview. Real acceptance tracking can be added after the first customer wants it.</p>
      </div>
    </section>
  );
}

function formatDate(date: string): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(date));
}
