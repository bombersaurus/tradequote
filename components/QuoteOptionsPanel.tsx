import type { QuoteDisplayOptions } from "@/lib/types";

type QuoteOptionsPanelProps = {
  options: QuoteDisplayOptions;
  onChange: (options: QuoteDisplayOptions) => void;
};

const optionRows: Array<{ key: keyof QuoteDisplayOptions; title: string; detail: string }> = [
  {
    key: "showCustomerContact",
    title: "Customer contact",
    detail: "Show email and phone on the quote.",
  },
  {
    key: "showJobAddress",
    title: "Job address",
    detail: "Include the site address.",
  },
  {
    key: "showUnitPrices",
    title: "Unit prices",
    detail: "Show rate per item, day, circuit, or certificate.",
  },
  {
    key: "showVatBreakdown",
    title: "VAT breakdown",
    detail: "Show subtotal and VAT separately.",
  },
  {
    key: "showDeposit",
    title: "Deposit due",
    detail: "Show the required deposit amount.",
  },
  {
    key: "showNotes",
    title: "Terms and notes",
    detail: "Include exclusions and job assumptions.",
  },
  {
    key: "showBranding",
    title: "TradeQuote branding",
    detail: "Show the small prepared-with footer.",
  },
];

export function QuoteOptionsPanel({ options, onChange }: QuoteOptionsPanelProps) {
  return (
    <section className="panel quote-options-panel" aria-labelledby="quote-options-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Final quote</p>
          <h2 id="quote-options-heading">Show or hide sections</h2>
        </div>
      </div>

      <div className="option-list">
        {optionRows.map((row) => (
          <label className="switch-line option-row" key={row.key}>
            <span>
              <strong>{row.title}</strong>
              <small>{row.detail}</small>
            </span>
            <input
              type="checkbox"
              checked={options[row.key]}
              onChange={(event) => onChange({ ...options, [row.key]: event.target.checked })}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
