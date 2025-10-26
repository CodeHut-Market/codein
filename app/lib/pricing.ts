export const SIMILARITY_THRESHOLD = 0.4;

const ONE_TENTH_PERCENT = 0.001;

export function getPriceCapForSimilarity(similarity: number | null): number {
  if (similarity === null || similarity <= 0) {
    return 1000;
  }

  if (similarity > SIMILARITY_THRESHOLD) {
    return 0;
  }

  if (similarity >= 0.3) {
    return 10;
  }

  if (similarity >= 0.2) {
    return 50;
  }

  if (similarity >= 0.1) {
    return 100;
  }

  if (similarity >= ONE_TENTH_PERCENT) {
    return 500;
  }

  return 1000;
}

export function normalizePriceInput(value: number, cap: number): number {
  const safeCap = Math.max(0, cap);
  const rounded = Math.round(value * 100) / 100;
  if (!Number.isFinite(rounded)) {
    return 0;
  }
  return Math.min(Math.max(0, rounded), safeCap);
}

export function formatPrice(value: number): string {
  const normalized = Math.round(value * 100) / 100;
  if (!Number.isFinite(normalized)) {
    return '0';
  }
  return Number.isInteger(normalized)
    ? normalized.toString()
    : normalized.toFixed(2).replace(/\.00$/, '');
}

export function formatPriceCap(cap: number): string {
  return cap.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
