import type { PricingRow } from "@/lib/pricing";

export type PriceRange = {
  lowest: PricingRow;
  highest: PricingRow;
  minPricePerSecond: number;
  maxPricePerSecond: number;
};

function isValidNonNegativeNumber(value: number) {
  return Number.isFinite(value) && value >= 0;
}

export function getRowsByResolution(
  rows: readonly PricingRow[],
  resolution: string,
) {
  return rows.filter((row) => row.resolution === resolution);
}

export function getRowsByMode(rows: readonly PricingRow[], mode: string) {
  const normalizedMode = mode.trim().toLowerCase();

  if (!normalizedMode) {
    return [];
  }

  return rows.filter((row) =>
    row.mode.toLowerCase().includes(normalizedMode),
  );
}

export function sortRowsByPrice(rows: readonly PricingRow[]) {
  return [...rows].sort((a, b) => a.pricePerSecond - b.pricePerSecond);
}

export function getLowestPriceRow(rows: readonly PricingRow[]) {
  return sortRowsByPrice(rows)[0] ?? null;
}

export function getHighestPriceRow(rows: readonly PricingRow[]) {
  return sortRowsByPrice(rows).at(-1) ?? null;
}

export function getPriceRange(rows: readonly PricingRow[]): PriceRange | null {
  const lowest = getLowestPriceRow(rows);
  const highest = getHighestPriceRow(rows);

  if (!lowest || !highest) {
    return null;
  }

  return {
    lowest,
    highest,
    minPricePerSecond: lowest.pricePerSecond,
    maxPricePerSecond: highest.pricePerSecond,
  };
}

export function getCostForSeconds(
  pricePerSecond: number,
  totalSeconds: number,
) {
  if (
    !isValidNonNegativeNumber(pricePerSecond) ||
    !isValidNonNegativeNumber(totalSeconds)
  ) {
    return null;
  }

  return pricePerSecond * totalSeconds;
}

export function getCostPerMinute(pricePerSecond: number) {
  return getCostForSeconds(pricePerSecond, 60);
}

export function getCostPerHour(pricePerSecond: number) {
  return getCostForSeconds(pricePerSecond, 60 * 60);
}

export function getCostForVideos(
  pricePerSecond: number,
  videoCount: number,
  secondsPerVideo: number,
) {
  if (
    !isValidNonNegativeNumber(videoCount) ||
    !isValidNonNegativeNumber(secondsPerVideo)
  ) {
    return null;
  }

  return getCostForSeconds(pricePerSecond, videoCount * secondsPerVideo);
}

export function formatUsd(value: number, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) {
    return null;
  }

  const safeMaximumFractionDigits = Math.min(
    4,
    Math.max(2, Math.round(maximumFractionDigits)),
  );

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: safeMaximumFractionDigits,
  }).format(value);
}
