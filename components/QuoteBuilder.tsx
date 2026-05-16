"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Eye, RotateCcw, Save } from "lucide-react";
import { calculateQuoteTotals } from "@/lib/calculations";
import { createBlankQuote } from "@/lib/data";
import { exportQuotePdf } from "@/lib/pdf";
import {
  hasPaidUnlock,
  loadDraft,
  loadSavedItems,
  saveDraft,
  saveSavedItems,
  setPaidUnlock,
} from "@/lib/storage";
import { firstError, validateQuote } from "@/lib/validation";
import type { LineItem, PreviewMode, Quote, QuoteDisplayOptions, QuoteTemplate } from "@/lib/types";
import { CommonItemsPanel } from "./CommonItemsPanel";
import { LineItemTable } from "./LineItemTable";
import { QuoteForm } from "./QuoteForm";
import { QuoteOptionsPanel } from "./QuoteOptionsPanel";
import { QuotePreview } from "./QuotePreview";
import { TemplatePicker } from "./TemplatePicker";
import { TotalsPanel } from "./TotalsPanel";
import { UnlockPanel } from "./UnlockPanel";

const defaultDisplayOptions: QuoteDisplayOptions = {
  showCustomerContact: true,
  showJobAddress: true,
  showUnitPrices: true,
  showVatBreakdown: true,
  showDeposit: true,
  showNotes: true,
  showBranding: true,
};

const previewModes: Array<{ id: PreviewMode; label: string }> = [
  { id: "quote", label: "Quote preview" },
  { id: "acceptance", label: "Acceptance link" },
  { id: "pdf", label: "Quote PDF" },
];

export function QuoteBuilder() {
  const [quote, setQuote] = useState<Quote>(() => createBlankQuote());
  const [savedItems, setSavedItems] = useState<LineItem[]>([]);
  const [paidUnlocked, setPaidUnlockedState] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("quote");
  const [displayOptions, setDisplayOptions] = useState<QuoteDisplayOptions>(defaultDisplayOptions);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    setSavedItems(loadSavedItems());
    setPaidUnlockedState(hasPaidUnlock());
  }, []);

  useEffect(() => {
    saveDraft(quote);
  }, [quote]);

  const totals = useMemo(() => calculateQuoteTotals(quote), [quote]);
  const errors = useMemo(() => validateQuote(quote), [quote]);
  const hasErrors = Object.keys(errors).length > 0;

  const applyTemplate = (template: QuoteTemplate) => {
    setQuote((current) => ({
      ...current,
      title: template.title,
      depositPercent: template.depositPercent,
      notes: template.notes,
      lineItems: template.lineItems.map((item) => ({ ...item, id: crypto.randomUUID() })),
    }));
    setNotice(`${template.name} template applied.`);
  };

  const saveItem = (item: LineItem) => {
    const reusable = { ...item, id: crypto.randomUUID() };
    const next = [reusable, ...savedItems].slice(0, 16);
    setSavedItems(next);
    saveSavedItems(next);
    setNotice("Line item saved for reuse.");
  };

  const useSavedItem = (item: LineItem) => {
    setQuote((current) => ({
      ...current,
      lineItems: [...current.lineItems, { ...item, id: crypto.randomUUID() }],
    }));
  };

  const deleteSavedItem = (id: string) => {
    const next = savedItems.filter((item) => item.id !== id);
    setSavedItems(next);
    saveSavedItems(next);
  };

  const mockUnlock = () => {
    setPaidUnlock(true);
    setPaidUnlockedState(true);
    setQuote((current) => ({ ...current, includeBranding: false }));
    setNotice("Mock paid access enabled. PDF export and branding removal are available.");
  };

  const exportPdf = () => {
    if (hasErrors) {
      setShowErrors(true);
      setNotice(firstError(errors));
      return;
    }

    exportQuotePdf(quote, paidUnlocked, displayOptions);
  };

  return (
    <div className="builder-layout">
      <section className="workspace">
        <div className="workspace-toolbar">
          <div>
            <p className="eyebrow">Quote editor</p>
            <h1>Electrical quote</h1>
          </div>
          <div className="toolbar-actions">
            <button type="button" className="secondary-button" onClick={() => setPreviewOpen((value) => !value)}>
              <Eye size={16} />
              {previewOpen ? "Hide preview" : "Show preview"}
            </button>
            <button type="button" className="secondary-button" onClick={() => setQuote(createBlankQuote())}>
              <RotateCcw size={16} />
              New
            </button>
            <button type="button" className="primary-button" onClick={exportPdf}>
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>

        {notice ? (
          <div className="notice" role="status">
            <Save size={16} />
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss notice">
              Dismiss
            </button>
          </div>
        ) : null}

        <TemplatePicker onApplyTemplate={applyTemplate} onLoadExample={setQuote} />
        <QuoteForm quote={quote} errors={showErrors ? errors : {}} onChange={setQuote} />
        <QuoteOptionsPanel options={displayOptions} onChange={setDisplayOptions} />
        <LineItemTable
          items={quote.lineItems}
          savedItems={savedItems}
          errors={showErrors ? errors : {}}
          onChange={(lineItems) => setQuote({ ...quote, lineItems })}
          onSaveItem={saveItem}
        />
      </section>

      <aside className="sidebar">
        <TotalsPanel totals={totals} vatRate={quote.vatRate} depositPercent={quote.depositPercent} />
        <UnlockPanel paidUnlocked={paidUnlocked} contactEmail={process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@tradequote.app"} onMockUnlock={mockUnlock} />
        <CommonItemsPanel savedItems={savedItems} onUseItem={useSavedItem} onDeleteItem={deleteSavedItem} />
        {paidUnlocked ? (
          <section className="panel branding-panel">
            <label className="switch-line">
              <span>
                <strong>Show TradeQuote branding</strong>
                <small>Paid users can remove this from PDF and preview.</small>
              </span>
              <input
                type="checkbox"
                checked={quote.includeBranding}
                onChange={(event) => setQuote({ ...quote, includeBranding: event.target.checked })}
              />
            </label>
          </section>
        ) : null}
      </aside>

      {previewOpen ? (
        <div className="preview-column">
          <div className="preview-switch" aria-label="Preview mode">
            {previewModes.map((mode) => (
              <button
                className={previewMode === mode.id ? "active" : ""}
                type="button"
                key={mode.id}
                onClick={() => setPreviewMode(mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <QuotePreview
            mode={previewMode}
            quote={quote}
            totals={totals}
            displayOptions={displayOptions}
            paidUnlocked={paidUnlocked}
          />
        </div>
      ) : null}
    </div>
  );
}
