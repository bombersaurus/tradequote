import type { LineItem, Quote } from "./types";

const draftKey = "tradequote:draft";
const savedItemsKey = "tradequote:saved-items";
const paidKey = "tradequote:paid-unlock";

export function loadDraft(): Quote | null {
  return readJson<Quote>(draftKey);
}

export function saveDraft(quote: Quote): void {
  writeJson(draftKey, quote);
}

export function loadSavedItems(): LineItem[] {
  return readJson<LineItem[]>(savedItemsKey) ?? [];
}

export function saveSavedItems(items: LineItem[]): void {
  writeJson(savedItemsKey, items);
}

export function hasPaidUnlock(): boolean {
  if (process.env.NEXT_PUBLIC_MOCK_PAID_UNLOCK === "true") {
    return true;
  }
  return window.localStorage.getItem(paidKey) === "true";
}

export function setPaidUnlock(value: boolean): void {
  window.localStorage.setItem(paidKey, String(value));
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}
