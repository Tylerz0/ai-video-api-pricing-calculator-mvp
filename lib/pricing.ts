export type PricingRow = {
  provider: string;
  modelName: string;
  mode: string;
  resolution: string;
  pricePerSecond: number;
  billingUnit: string;
  audioPricing?: string;
  videoTokenPricePerMillion?: number;
  sourceLabel: string;
  sourceUrl: string;
  note: string;
};
