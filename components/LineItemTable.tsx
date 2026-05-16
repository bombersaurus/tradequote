import { BookmarkPlus, Plus, Trash2 } from "lucide-react";
import { commonLineItems } from "@/lib/data";
import { formatCurrency, lineItemTotal } from "@/lib/calculations";
import type { LineItem, LineItemCategory, Unit, ValidationErrors } from "@/lib/types";

const units: Unit[] = ["item", "hour", "day", "metre", "point", "circuit", "certificate"];
const categories: LineItemCategory[] = [
  "Labour",
  "Materials",
  "Certification",
  "Testing",
  "Consumables",
  "Access",
  "Other",
];

type LineItemTableProps = {
  items: LineItem[];
  savedItems: LineItem[];
  errors: ValidationErrors;
  onChange: (items: LineItem[]) => void;
  onSaveItem: (item: LineItem) => void;
};

export function LineItemTable({ items, savedItems, errors, onChange, onSaveItem }: LineItemTableProps) {
  const addItem = (item?: Partial<LineItem>) => {
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        description: item?.description ?? "",
        quantity: item?.quantity ?? 1,
        unit: item?.unit ?? "item",
        unitPrice: item?.unitPrice ?? 0,
        taxable: item?.taxable ?? true,
        category: item?.category ?? "Materials",
      },
    ]);
  };

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <section className="panel" aria-labelledby="line-items-heading">
      <div className="panel-heading line-heading">
        <div>
          <p className="eyebrow">Pricing</p>
          <h2 id="line-items-heading">Line items</h2>
        </div>
        <div className="button-row">
          <select
            aria-label="Add saved line item"
            defaultValue=""
            onChange={(event) => {
              const selected = [...commonLineItems, ...savedItems].find(
                (item) => item.description === event.target.value,
              );
              if (selected) addItem(selected);
              event.target.value = "";
            }}
          >
            <option value="">Add saved item</option>
            <optgroup label="Starter items">
              {commonLineItems.map((item) => (
                <option key={item.description} value={item.description}>
                  {item.description}
                </option>
              ))}
            </optgroup>
            {savedItems.length > 0 ? (
              <optgroup label="Your saved items">
                {savedItems.map((item) => (
                  <option key={item.id} value={item.description}>
                    {item.description}
                  </option>
                ))}
              </optgroup>
            ) : null}
          </select>
          <button type="button" className="primary-button compact" onClick={() => addItem()}>
            <Plus size={16} />
            Add item
          </button>
        </div>
      </div>

      {errors.lineItems ? <small className="error-text">{errors.lineItems}</small> : null}

      <div className="line-table" aria-label="Quote line items">
        <div className="line-row line-header" role="row">
          <span>Description</span>
          <span>Qty</span>
          <span>Unit</span>
          <span>Unit price</span>
          <span>VAT</span>
          <span>Category</span>
          <span>Total</span>
          <span />
        </div>

        {items.length === 0 ? (
          <div className="line-row placeholder-line" aria-hidden="true">
            <label className="mobile-field line-description">
              <span>Description</span>
              <input disabled placeholder="Supply and install..." />
            </label>
            <label className="mobile-field line-qty">
              <span>Qty</span>
              <input disabled placeholder="1" />
            </label>
            <label className="mobile-field line-unit">
              <span>Unit</span>
              <select disabled defaultValue="item">
                <option>item</option>
              </select>
            </label>
            <label className="mobile-field line-price">
              <span>Unit price</span>
              <input disabled placeholder="0.00" />
            </label>
            <label className="switch-field line-vat">
              <span>VAT</span>
              <input disabled type="checkbox" />
            </label>
            <label className="mobile-field line-category">
              <span>Category</span>
              <select disabled defaultValue="Materials">
                <option>Materials</option>
              </select>
            </label>
            <strong className="line-total">£0.00</strong>
            <div className="icon-actions line-actions">
              <button type="button" disabled className="icon-button">
                <BookmarkPlus size={16} />
              </button>
              <button type="button" disabled className="icon-button danger">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : null}

        {items.map((item) => (
          <div className="line-row" key={item.id}>
            <label className="mobile-field line-description">
              <span>Description</span>
              <input
                value={item.description}
                onChange={(event) => updateItem(item.id, { description: event.target.value })}
                placeholder="Supply and install..."
              />
              {errors[`item-${item.id}-description`] ? (
                <small className="error-text">{errors[`item-${item.id}-description`]}</small>
              ) : null}
            </label>
            <label className="mobile-field line-qty">
              <span>Qty</span>
              <input
                type="number"
                min={0.01}
                step={0.01}
                value={item.quantity}
                onChange={(event) => updateItem(item.id, { quantity: Number(event.target.value) })}
              />
            </label>
            <label className="mobile-field line-unit">
              <span>Unit</span>
              <select value={item.unit} onChange={(event) => updateItem(item.id, { unit: event.target.value as Unit })}>
                {units.map((unit) => (
                  <option key={unit}>{unit}</option>
                ))}
              </select>
            </label>
            <label className="mobile-field line-price">
              <span>Unit price</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={item.unitPrice}
                onChange={(event) => updateItem(item.id, { unitPrice: Number(event.target.value) })}
              />
            </label>
            <label className="switch-field line-vat">
              <span>VAT</span>
              <input
                type="checkbox"
                checked={item.taxable}
                onChange={(event) => updateItem(item.id, { taxable: event.target.checked })}
              />
            </label>
            <label className="mobile-field line-category">
              <span>Category</span>
              <select
                value={item.category}
                onChange={(event) => updateItem(item.id, { category: event.target.value as LineItemCategory })}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <strong className="line-total">{formatCurrency(lineItemTotal(item))}</strong>
            <div className="icon-actions line-actions">
              <button type="button" title="Save line item" onClick={() => onSaveItem(item)} className="icon-button">
                <BookmarkPlus size={16} />
              </button>
              <button type="button" title="Remove line item" onClick={() => removeItem(item.id)} className="icon-button danger">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
