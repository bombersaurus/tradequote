import type { ReactNode } from "react";
import { Zap } from "lucide-react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@tradequote.app";
  const subject = encodeURIComponent("TradeQuote demo");
  const body = encodeURIComponent("Hi, I want to try TradeQuote for my electrical business.");

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Zap size={18} />
          </span>
          <div>
            <strong>TradeQuote</strong>
            <span>Electrical quotes and estimates</span>
          </div>
        </div>
        <div className="topbar-status">
          <span className="status-dot" aria-hidden="true" />
          Local draft saved
        </div>
        <a className="topbar-cta" href={`mailto:${contactEmail}?subject=${subject}&body=${body}`}>
          Request early access
        </a>
      </header>
      <main>{children}</main>
    </div>
  );
}
