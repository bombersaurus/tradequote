export type Unit = "item" | "hour" | "day" | "metre" | "point" | "circuit" | "certificate";

export type LineItemCategory =
  | "Labour"
  | "Materials"
  | "Certification"
  | "Testing"
  | "Consumables"
  | "Access"
  | "Other";

export type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
};

export type BusinessDetails = {
  name: string;
  email: string;
  phone: string;
  registration: string;
  address: string;
};

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unit: Unit;
  unitPrice: number;
  taxable: boolean;
  category: LineItemCategory;
};

export type Quote = {
  id: string;
  quoteNumber: string;
  title: string;
  customer: CustomerDetails;
  jobAddress: string;
  validUntil: string;
  issueDate: string;
  vatRate: number;
  depositPercent: number;
  notes: string;
  includeBranding: boolean;
  business: BusinessDetails;
  lineItems: LineItem[];
};

export type QuoteTemplate = {
  id: string;
  name: string;
  description: string;
  title: string;
  depositPercent: number;
  notes: string;
  lineItems: Omit<LineItem, "id">[];
};

export type QuoteTotals = {
  subtotal: number;
  taxableSubtotal: number;
  tax: number;
  total: number;
  deposit: number;
};

export type QuoteDisplayOptions = {
  showCustomerContact: boolean;
  showJobAddress: boolean;
  showUnitPrices: boolean;
  showVatBreakdown: boolean;
  showDeposit: boolean;
  showNotes: boolean;
  showBranding: boolean;
};

export type PreviewMode = "quote" | "acceptance" | "pdf";

export type ValidationErrors = Record<string, string>;
