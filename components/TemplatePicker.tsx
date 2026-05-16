import { ClipboardList, Plus } from "lucide-react";
import { electricianTemplates, exampleQuotes } from "@/lib/data";
import type { Quote, QuoteTemplate } from "@/lib/types";

type TemplatePickerProps = {
  onApplyTemplate: (template: QuoteTemplate) => void;
  onLoadExample: (quote: Quote) => void;
};

export function TemplatePicker({ onApplyTemplate, onLoadExample }: TemplatePickerProps) {
  return (
    <section className="panel template-panel" aria-labelledby="templates-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Optional</p>
          <h2 id="templates-heading">Start from a template</h2>
        </div>
        <button className="text-button" type="button" onClick={() => onLoadExample(exampleQuotes[0])}>
          <ClipboardList size={16} />
          Example quote
        </button>
      </div>

      <div className="template-strip">
        {electricianTemplates.map((template) => (
          <button
            key={template.id}
            className="template-card"
            type="button"
            onClick={() => onApplyTemplate(template)}
          >
            <span>
              <strong>{template.name}</strong>
              <small>{template.description}</small>
            </span>
            <Plus size={16} aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
