"use client";

import { useMemo, useState } from "react";

import type { PricingRow } from "@/lib/pricing";

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
  const resolutionOptions = useMemo(() => {
    const listedResolutions = new Set(
      pricingRows.map((row) => row.resolution),
    );
    const preferredOrder = [
      "480p",
      "720p",
      "1080p",
      "provider-dependent",
    ];
    const orderedResolutions = preferredOrder.filter((resolution) =>
      listedResolutions.delete(resolution),
    );

    return [...orderedResolutions, ...Array.from(listedResolutions).sort()];
  }, [pricingRows]);

  const [videosPerMonth, setVideosPerMonth] = useState(defaultVideosPerMonth);
  const [secondsPerVideo, setSecondsPerVideo] = useState(
    defaultSecondsPerVideo,
  );
  const [selectedResolution, setSelectedResolution] = useState(() =>
    resolutionOptions.includes("720p")
      ? "720p"
      : (resolutionOptions[0] ?? ""),
  );

  const comparison = useMemo(
    () =>
      pricingRows
        .filter((row) => row.resolution === selectedResolution)
        .map((row) => ({
          ...row,
          costPerVideo: row.pricePerSecond * secondsPerVideo,
          monthlyCost:
            row.pricePerSecond * secondsPerVideo * videosPerMonth,
        }))
        .sort((a, b) => a.monthlyCost - b.monthlyCost),
    [pricingRows, secondsPerVideo, selectedResolution, videosPerMonth],
  );

  const generatedSeconds = videosPerMonth * secondsPerVideo;
  const lowestEstimate = comparison[0]?.monthlyCost ?? null;
  const highestEstimate = comparison[comparison.length - 1]?.monthlyCost ?? null;

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
          <p className="calculator-copy">
            Compare providers at the same selected resolution.
          </p>
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
        <label>
          <span>Resolution</span>
          <select
            onChange={(event) => setSelectedResolution(event.target.value)}
            value={selectedResolution}
          >
            {resolutionOptions.map((resolution) => (
              <option key={resolution} value={resolution}>
                {resolution}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="estimate-grid" aria-live="polite">
        <article>
          <span>Total generated seconds</span>
          <strong>{integerFormatter.format(generatedSeconds)}</strong>
          <small>seconds / month</small>
        </article>
        <article>
          <span>Lowest estimate</span>
          <strong>
            {lowestEstimate === null
              ? "Not available"
              : formatCurrency(lowestEstimate, currency)}
          </strong>
          <small>per month</small>
        </article>
        <article>
          <span>Highest estimate</span>
          <strong>
            {highestEstimate === null
              ? "Not available"
              : formatCurrency(highestEstimate, currency)}
          </strong>
          <small>per month</small>
        </article>
        <article>
          <span>Selected resolution</span>
          <strong>{selectedResolution || "Not available"}</strong>
          <small>same-resolution rows only</small>
        </article>
      </div>

      <div className="table-wrap">
        <table className="pricing-table calculator-table">
          <caption className="sr-only">
            Seedance 2 provider pricing comparison for the selected{" "}
            {selectedResolution} resolution
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
            {comparison.length > 0 ? (
              comparison.map((row, index) => (
                <tr
                  className={index === 0 ? "is-lowest-row" : undefined}
                  key={`${row.provider}-${row.modelName}-${row.mode}-${row.resolution}`}
                >
                  <th scope="row">
                    <span>{row.provider}</span>
                    {index === 0 ? (
                      <small className="lowest-rate-badge">
                        Lowest rate for selected resolution
                      </small>
                    ) : null}
                  </th>
                  <td>
                    <span className="table-primary">{row.modelName}</span>
                    <small className="table-secondary">
                      <span className="table-badge">{row.mode}</span>
                    </small>
                  </td>
                  <td>
                    <span className="table-badge table-badge-neutral">
                      {row.resolution}
                    </span>
                    {row.audioPricing ? (
                      <small className="table-secondary">
                        {row.audioPricing}
                      </small>
                    ) : null}
                  </td>
                  <td className="numeric-cell">
                    <span className="table-primary">
                      {formatCurrency(row.pricePerSecond, currency)}
                    </span>
                    <small className="table-secondary">
                      {row.billingUnit}
                    </small>
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
                  <td className="numeric-cell">
                    {formatCurrency(row.costPerVideo, currency)}
                  </td>
                  <td className="monthly-cost numeric-cell">
                    {formatCurrency(row.monthlyCost, currency)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty-state" colSpan={6}>
                  No listed providers for this resolution yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="calculator-note">
        Rows are compared only within the selected resolution. Estimates use
        each row&apos;s public per-output-second rate. Taxes, credits,
        discounts, retries, storage, and transfer fees may change the final
        bill.
      </p>
    </section>
  );
}
