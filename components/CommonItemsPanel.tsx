import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/calculations";
import type { LineItem } from "@/lib/types";

type CommonItemsPanelProps = {
  savedItems: LineItem[];
  onUseItem: (item: LineItem) => void;
  onDeleteItem: (id: string) => void;
};

export function CommonItemsPanel({ savedItems, onUseItem, onDeleteItem }: CommonItemsPanelProps) {
  return (
    <section className="panel" aria-labelledby="saved-items-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Reusable</p>
          <h2 id="saved-items-heading">Saved line items</h2>
        </div>
      </div>

      {savedItems.length === 0 ? (
        <div className="empty-state">
          <strong>No saved items yet</strong>
          <p>Use the bookmark button on any quote line to reuse it later.</p>
        </div>
      ) : (
        <div className="saved-list">
          {savedItems.map((item) => (
            <div className="saved-item" key={item.id}>
              <button type="button" onClick={() => onUseItem(item)}>
                <strong>{item.description}</strong>
                <span>
                  {item.quantity} {item.unit} at {formatCurrency(item.unitPrice)}
                </span>
              </button>
              <button type="button" title="Delete saved item" className="icon-button danger" onClick={() => onDeleteItem(item.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
