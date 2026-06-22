"use client";

import { useMemo, useState } from "react";

type PricingRow = {
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

type PricingCalculatorProps = {
  currency: string;
  defaultVideosPerMonth: number;
  defaultSecondsPerVideo: number;
  pricingRows: PricingRow[];
};

const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export function PricingCalculator({
  currency,
  defaultVideosPerMonth,
  defaultSecondsPerVideo,
  pricingRows,
}: PricingCalculatorProps) {
  const [videosPerMonth, setVideosPerMonth] = useState(defaultVideosPerMonth);
  const [secondsPerVideo, setSecondsPerVideo] = useState(
    defaultSecondsPerVideo,
  );

  const comparison = useMemo(
    () =>
      pricingRows
        .map((row) => ({
          ...row,
          costPerVideo: row.pricePerSecond * secondsPerVideo,
          monthlyCost:
            row.pricePerSecond * secondsPerVideo * videosPerMonth,
        }))
        .sort((a, b) => a.monthlyCost - b.monthlyCost),
    [pricingRows, secondsPerVideo, videosPerMonth],
  );

  const generatedSeconds = videosPerMonth * secondsPerVideo;

  function normalizeValue(value: string, fallback: number, max: number) {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      return fallback;
    }

    return Math.min(max, Math.max(1, Math.round(parsed)));
  }

  return (
    <section className="calculator" aria-labelledby="calculator-title">
      <div className="calculator-header">
        <div>
          <p className="eyebrow">Monthly estimate</p>
          <h2 id="calculator-title">Calculate your Seedance 2 API costs</h2>
        </div>
        <p className="usage-summary" aria-live="polite">
          {integerFormatter.format(generatedSeconds)} generated seconds / month
        </p>
      </div>

      <div className="input-grid">
        <label>
          <span>Videos per month</span>
          <input
            inputMode="numeric"
            max="1000000"
            min="1"
            onChange={(event) =>
              setVideosPerMonth(
                normalizeValue(
                  event.target.value,
                  defaultVideosPerMonth,
                  1_000_000,
                ),
              )
            }
            type="number"
            value={videosPerMonth}
          />
        </label>
        <label>
          <span>Seconds per video</span>
          <input
            inputMode="numeric"
            max="600"
            min="1"
            onChange={(event) =>
              setSecondsPerVideo(
                normalizeValue(
                  event.target.value,
                  defaultSecondsPerVideo,
                  600,
                ),
              )
            }
            type="number"
            value={secondsPerVideo}
          />
        </label>
      </div>

      <div className="table-wrap">
        <table>
          <caption className="sr-only">
            Seedance 2 provider pricing comparison
          </caption>
          <thead>
            <tr>
              <th scope="col">Provider</th>
              <th scope="col">Model / mode</th>
              <th scope="col">Resolution</th>
              <th scope="col">Rate / second</th>
              <th scope="col">Cost / video</th>
              <th scope="col">Monthly total</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row, index) => (
              <tr
                key={`${row.provider}-${row.modelName}-${row.mode}-${row.resolution}`}
              >
                <th scope="row">
                  <span>{row.provider}</span>
                  {index === 0 ? <small>Lowest listed rate</small> : null}
                </th>
                <td>
                  <span className="table-primary">{row.modelName}</span>
                  <small className="table-secondary">{row.mode}</small>
                </td>
                <td>
                  <span className="table-primary">{row.resolution}</span>
                  {row.audioPricing ? (
                    <small className="table-secondary">
                      {row.audioPricing}
                    </small>
                  ) : null}
                </td>
                <td>
                  <span className="table-primary">
                    {formatCurrency(row.pricePerSecond, currency)}
                  </span>
                  {row.videoTokenPricePerMillion !== undefined ? (
                    <small className="table-secondary">
                      {formatCurrency(
                        row.videoTokenPricePerMillion,
                        currency,
                      )}{" "}
                      /M video tokens
                    </small>
                  ) : null}
                </td>
                <td>{formatCurrency(row.costPerVideo, currency)}</td>
                <td className="monthly-cost">
                  {formatCurrency(row.monthlyCost, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="calculator-note">
        Estimates use each row&apos;s public per-output-second rate. Taxes,
        credits, discounts, retries, storage, and transfer fees may change the
        final bill.
      </p>
    </section>
  );
}
