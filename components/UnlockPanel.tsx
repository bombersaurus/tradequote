import { Mail, Sparkles } from "lucide-react";

type UnlockPanelProps = {
  paidUnlocked: boolean;
  contactEmail: string;
  onMockUnlock: () => void;
};

export function UnlockPanel({ paidUnlocked, contactEmail, onMockUnlock }: UnlockPanelProps) {
  const subject = encodeURIComponent("TradeQuote early access");
  const body = encodeURIComponent("Hi, I want to try TradeQuote for my electrical quotes.");

  return (
    <section className="panel unlock-panel" aria-labelledby="unlock-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Founder plan</p>
          <h2 id="unlock-heading">Want this set up?</h2>
        </div>
        <span className="pill success">
          <Sparkles size={14} />
          £9/mo early users
        </span>
      </div>

      <div className="unlock-copy">
        <Mail size={18} />
        <p>
          {paidUnlocked
            ? "Pro controls are visible in this preview. Early users get help loading logo, quote wording, and common jobs."
            : "Get help loading your logo, quote wording, and common electrical jobs. PDF export works in this demo."}
        </p>
      </div>

      <div className="button-stack">
        <a className="primary-button" href={`mailto:${contactEmail}?subject=${subject}&body=${body}`}>
          <Mail size={16} />
          Request early access
        </a>
        <button className="text-button" type="button" onClick={onMockUnlock}>
          Preview pro branding controls
        </button>
      </div>
    </section>
  );
}
