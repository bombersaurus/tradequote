import { formatCurrency } from "@/lib/calculations";
import type { QuoteTotals } from "@/lib/types";

type TotalsPanelProps = {
  totals: QuoteTotals;
  vatRate: number;
  depositPercent: number;
};

export function TotalsPanel({ totals, vatRate, depositPercent }: TotalsPanelProps) {
  return (
    <section className="panel totals-panel" aria-labelledby="totals-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Summary</p>
          <h2 id="totals-heading">Quote totals</h2>
        </div>
      </div>

      <dl className="totals-list">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatCurrency(totals.subtotal)}</dd>
        </div>
        <div>
          <dt>VAT at {vatRate}%</dt>
          <dd>{formatCurrency(totals.tax)}</dd>
        </div>
        <div className="grand-total">
          <dt>Total</dt>
          <dd>{formatCurrency(totals.total)}</dd>
        </div>
        <div>
          <dt>Required deposit at {depositPercent}%</dt>
          <dd>{formatCurrency(totals.deposit)}</dd>
        </div>
      </dl>
    </section>
  );
}
