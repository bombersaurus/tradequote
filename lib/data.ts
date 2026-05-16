import type { LineItem, Quote, QuoteTemplate } from "./types";

const today = new Date();
const validUntil = new Date(today);
validUntil.setDate(today.getDate() + 30);

export const defaultBusiness = {
  name: "TradeQuote Electrical",
  email: "quotes@tradequote.local",
  phone: "020 7946 0821",
  registration: "NICEIC Approved Contractor",
  address: "Unit 4, Riverside Works, London",
};

export const electricianTemplates: QuoteTemplate[] = [
  {
    id: "consumer-unit",
    name: "Consumer unit replacement",
    description: "Board change with testing, certification, and labelling.",
    title: "Consumer Unit Replacement",
    depositPercent: 35,
    notes:
      "Includes isolation, replacement consumer unit, circuit testing, labelling, and electrical installation certificate. Assumes accessible wiring and no remedial works beyond listed items.",
    lineItems: [
      { description: "Supply 18th Edition RCBO consumer unit", quantity: 1, unit: "item", unitPrice: 420, taxable: true, category: "Materials" },
      { description: "Remove existing board and install new unit", quantity: 1, unit: "day", unitPrice: 480, taxable: true, category: "Labour" },
      { description: "Circuit testing, labelling, and certification", quantity: 1, unit: "certificate", unitPrice: 180, taxable: true, category: "Certification" },
      { description: "Sundries, glands, tails, and fixings", quantity: 1, unit: "item", unitPrice: 65, taxable: true, category: "Consumables" },
    ],
  },
  {
    id: "ev-charger",
    name: "EV charger install",
    description: "Standard domestic wall charger installation.",
    title: "EV Charger Installation",
    depositPercent: 40,
    notes:
      "Includes standard installation up to 10 metres from consumer unit, commissioning, and notification. Additional trenching, data work, or DNO upgrades are excluded unless listed.",
    lineItems: [
      { description: "7kW smart EV charger unit", quantity: 1, unit: "item", unitPrice: 560, taxable: true, category: "Materials" },
      { description: "Dedicated EV circuit and protection", quantity: 1, unit: "circuit", unitPrice: 275, taxable: true, category: "Materials" },
      { description: "Installation, setup, and client handover", quantity: 1, unit: "day", unitPrice: 420, taxable: true, category: "Labour" },
      { description: "Testing, certification, and notification", quantity: 1, unit: "certificate", unitPrice: 95, taxable: true, category: "Certification" },
    ],
  },
  {
    id: "eicr",
    name: "EICR inspection",
    description: "Electrical installation condition report.",
    title: "EICR Inspection",
    depositPercent: 0,
    notes:
      "Includes inspection and report for accessible circuits. Remedial works, out-of-hours visits, and specialist access equipment are excluded.",
    lineItems: [
      { description: "EICR inspection first 8 circuits", quantity: 1, unit: "certificate", unitPrice: 180, taxable: true, category: "Testing" },
      { description: "Additional circuits", quantity: 4, unit: "circuit", unitPrice: 18, taxable: true, category: "Testing" },
      { description: "Digital report and recommendations", quantity: 1, unit: "item", unitPrice: 35, taxable: true, category: "Certification" },
    ],
  },
  {
    id: "lighting",
    name: "Lighting install",
    description: "Install downlights and switching in one room.",
    title: "Lighting Installation",
    depositPercent: 30,
    notes:
      "Includes installation of listed fittings into accessible ceiling voids. Making good, plastering, and decorative works are excluded.",
    lineItems: [
      { description: "LED fire-rated downlights", quantity: 8, unit: "item", unitPrice: 32, taxable: true, category: "Materials" },
      { description: "Install downlights and switching", quantity: 1, unit: "day", unitPrice: 360, taxable: true, category: "Labour" },
      { description: "Cable, connectors, and fixings", quantity: 1, unit: "item", unitPrice: 48, taxable: true, category: "Consumables" },
      { description: "Minor works certificate", quantity: 1, unit: "certificate", unitPrice: 45, taxable: true, category: "Certification" },
    ],
  },
  {
    id: "sockets",
    name: "Socket installation",
    description: "Additional sockets with testing and minor works certificate.",
    title: "Socket Installation",
    depositPercent: 25,
    notes:
      "Quote assumes floorboards or route are accessible and existing circuit capacity is suitable. Chasing, plastering, and decoration are excluded unless listed.",
    lineItems: [
      { description: "Twin switched socket outlets", quantity: 4, unit: "point", unitPrice: 38, taxable: true, category: "Materials" },
      { description: "Install additional socket points", quantity: 4, unit: "point", unitPrice: 72, taxable: true, category: "Labour" },
      { description: "Cable, back boxes, and fixings", quantity: 1, unit: "item", unitPrice: 55, taxable: true, category: "Consumables" },
      { description: "Testing and minor works certificate", quantity: 1, unit: "certificate", unitPrice: 55, taxable: true, category: "Certification" },
    ],
  },
];

export const commonLineItems: Omit<LineItem, "id">[] = [
  { description: "Qualified electrician labour", quantity: 1, unit: "hour", unitPrice: 65, taxable: true, category: "Labour" },
  { description: "Apprentice / mate labour", quantity: 1, unit: "hour", unitPrice: 38, taxable: true, category: "Labour" },
  { description: "Minor works certificate", quantity: 1, unit: "certificate", unitPrice: 55, taxable: true, category: "Certification" },
  { description: "Parking and congestion allowance", quantity: 1, unit: "item", unitPrice: 25, taxable: true, category: "Access" },
];

export const exampleQuotes: Quote[] = [
  {
    id: "example-ev",
    quoteNumber: "TQ-2026-014",
    title: "EV Charger Installation",
    customer: {
      name: "Morgan Patel",
      email: "morgan@example.com",
      phone: "07700 900321",
    },
    jobAddress: "42 Station Road, Bristol BS1 4AB",
    validUntil: validUntil.toISOString().slice(0, 10),
    issueDate: today.toISOString().slice(0, 10),
    vatRate: 20,
    depositPercent: 40,
    notes: electricianTemplates[1].notes,
    includeBranding: true,
    business: defaultBusiness,
    lineItems: electricianTemplates[1].lineItems.map((item, index) => ({
      ...item,
      id: `example-ev-${index}`,
    })),
  },
];

export function createBlankQuote(): Quote {
  return {
    id: crypto.randomUUID(),
    quoteNumber: `TQ-${today.getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
    title: "",
    customer: {
      name: "",
      email: "",
      phone: "",
    },
    jobAddress: "",
    validUntil: validUntil.toISOString().slice(0, 10),
    issueDate: today.toISOString().slice(0, 10),
    vatRate: 20,
    depositPercent: 30,
    notes: "Quote valid until the date shown. Work will be scheduled after deposit payment and written acceptance.",
    includeBranding: true,
    business: defaultBusiness,
    lineItems: [],
  };
}
