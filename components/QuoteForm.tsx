import type { Quote, ValidationErrors } from "@/lib/types";

type QuoteFormProps = {
  quote: Quote;
  errors: ValidationErrors;
  onChange: (quote: Quote) => void;
};

export function QuoteForm({ quote, errors, onChange }: QuoteFormProps) {
  return (
    <section className="panel form-panel" aria-labelledby="quote-details-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Quote setup</p>
          <h2 id="quote-details-heading">Job and customer details</h2>
        </div>
      </div>

      <div className="form-grid">
        <label className="field wide">
          <span>Quote title</span>
          <input
            value={quote.title}
            onChange={(event) => onChange({ ...quote, title: event.target.value })}
            placeholder="Consumer unit replacement"
          />
          {errors.title ? <small className="error-text">{errors.title}</small> : null}
        </label>

        <label className="field">
          <span>Quote number</span>
          <input
            value={quote.quoteNumber}
            onChange={(event) => onChange({ ...quote, quoteNumber: event.target.value })}
          />
        </label>

        <label className="field">
          <span>Valid until</span>
          <input
            type="date"
            value={quote.validUntil}
            onChange={(event) => onChange({ ...quote, validUntil: event.target.value })}
          />
          {errors.validUntil ? <small className="error-text">{errors.validUntil}</small> : null}
        </label>

        <label className="field">
          <span>Customer name</span>
          <input
            value={quote.customer.name}
            onChange={(event) =>
              onChange({ ...quote, customer: { ...quote.customer, name: event.target.value } })
            }
            placeholder="Alex Morgan"
          />
          {errors.customerName ? <small className="error-text">{errors.customerName}</small> : null}
        </label>

        <label className="field">
          <span>Customer email</span>
          <input
            type="email"
            value={quote.customer.email}
            onChange={(event) =>
              onChange({ ...quote, customer: { ...quote.customer, email: event.target.value } })
            }
            placeholder="alex@example.com"
          />
        </label>

        <label className="field">
          <span>Customer phone</span>
          <input
            value={quote.customer.phone}
            onChange={(event) =>
              onChange({ ...quote, customer: { ...quote.customer, phone: event.target.value } })
            }
            placeholder="07700 900000"
          />
        </label>

        <label className="field wide">
          <span>Job address</span>
          <textarea
            rows={3}
            value={quote.jobAddress}
            onChange={(event) => onChange({ ...quote, jobAddress: event.target.value })}
            placeholder="Flat 2, 14 High Street, Manchester M1 1AA"
          />
          {errors.jobAddress ? <small className="error-text">{errors.jobAddress}</small> : null}
        </label>

        <label className="field">
          <span>VAT rate (%)</span>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={quote.vatRate}
            onChange={(event) => onChange({ ...quote, vatRate: Number(event.target.value) })}
          />
          {errors.vatRate ? <small className="error-text">{errors.vatRate}</small> : null}
        </label>

        <label className="field">
          <span>Deposit (%)</span>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={quote.depositPercent}
            onChange={(event) => onChange({ ...quote, depositPercent: Number(event.target.value) })}
          />
          {errors.depositPercent ? <small className="error-text">{errors.depositPercent}</small> : null}
        </label>

        <label className="field wide">
          <span>Terms and notes</span>
          <textarea
            rows={4}
            value={quote.notes}
            onChange={(event) => onChange({ ...quote, notes: event.target.value })}
          />
        </label>
      </div>
    </section>
  );
}
