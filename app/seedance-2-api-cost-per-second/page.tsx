import type { Metadata } from "next";
import Link from "next/link";

import {
  formatUsd,
  getCostForVideos,
  getCostPerHour,
  getCostPerMinute,
  getPriceRange,
  getRowsByResolution,
  sortRowsByPrice,
} from "@/lib/pricing-calculations";
import type { PricingRow } from "@/lib/pricing";
import pricingData from "@/pricing-data.json";

export const dynamic = "force-static";

const pageTitle =
  "Seedance 2.0 API Cost Per Second: 720p Price per Output Second";
const pageDescription =
  "Compare Seedance 2.0 API pricing normalized to USD per output second. Estimate any 720p video generation volume using video count × seconds × price per second.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/seedance-2-api-cost-per-second",
  },
};

const pricingRows = pricingData.pricingRows as PricingRow[];
const defaultResolution = "720p";
const rows720p = sortRowsByPrice(
  getRowsByResolution(pricingRows, defaultResolution),
);
const priceRange = getPriceRange(rows720p);
const lowestRow = priceRange?.lowest ?? null;
const highestRow = priceRange?.highest ?? null;

const displayDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
}).format(new Date(`${pricingData.lastUpdated}T00:00:00Z`));

const exampleVideoCount = pricingData.defaultInputs.videosPerMonth;
const exampleSecondsPerVideo = pricingData.defaultInputs.secondsPerVideo;
const exampleTotalSeconds = exampleVideoCount * exampleSecondsPerVideo;
const exampleLowestCost = lowestRow
  ? getCostForVideos(
      lowestRow.pricePerSecond,
      exampleVideoCount,
      exampleSecondsPerVideo,
    )
  : null;

function formatMoney(value: number | null, maximumFractionDigits = 2) {
  return value === null
    ? "Not available"
    : (formatUsd(value, maximumFractionDigits) ?? "Not available");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getSourceRel(row: PricingRow) {
  if (row.provider === "Kie.ai") {
    return "sponsored nofollow noreferrer";
  }

  return "noreferrer";
}

export default function SeedanceTwoApiCostPerSecondPage() {
  return (
    <div className="shell page-section">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/video-generation-api-pricing">Video API pricing</Link>
        <span aria-hidden="true">/</span>
        <span>Seedance 2.0 cost per second</span>
      </nav>

      <section className="page-heading">
        <p className="eyebrow">Cost per output second</p>
        <h1>Seedance 2.0 API Cost Per Second</h1>
        <p>
          Compare Seedance 2.0 listed public API pricing normalized to USD per
          output second, with a default focus on 720p rows so routes are
          compared at the same output resolution.
        </p>
      </section>

      <section className="quick-answer-card" aria-labelledby="quick-answer">
        <h2 id="quick-answer">Quick Answer</h2>
        {lowestRow && highestRow && priceRange ? (
          <>
            <p className="quick-answer-intro">
              Based on listed public API prices, Seedance 2.0 720p prices in
              this dataset are normalized to USD per output second.
            </p>
            <ul className="quick-answer-list">
              <li>
                The lowest listed 720p route in this dataset is{" "}
                <strong>
                  {lowestRow.provider} {lowestRow.modelName} {lowestRow.mode}
                </strong>
                .
              </li>
              <li>
                Lowest listed 720p price per output second:{" "}
                <strong>{formatMoney(lowestRow.pricePerSecond, 4)}</strong>.
              </li>
              <li>
                Listed 720p price range:{" "}
                <strong>
                  {formatMoney(priceRange.minPricePerSecond, 4)} to{" "}
                  {formatMoney(priceRange.maxPricePerSecond, 4)}
                </strong>{" "}
                per output second.
              </li>
              <li>
                Formula: video count × seconds per video × price per output
                second.
              </li>
              <li>
                Pricing data last updated{" "}
                <time dateTime={pricingData.lastUpdated}>{displayDate}</time>.
              </li>
            </ul>
            <p className="trust-note">
              Estimated costs exclude taxes, discounts, retries, storage, and
              transfer fees. Verify the linked provider page before production
              use.
            </p>
          </>
        ) : (
          <p>No listed 720p Seedance 2.0 pricing rows are available yet.</p>
        )}
      </section>

      <section className="content-section" aria-labelledby="formula-title">
        <p className="eyebrow">Formula</p>
        <h2 id="formula-title">How to calculate Seedance 2.0 API cost</h2>
        <div className="quick-answer-formula">
          <p className="quick-answer-formula-title">
            Per-output-second estimate
          </p>
          <code className="quick-answer-formula-code">
            total output seconds = number of videos × seconds per video
            <br />
            estimated cost = total output seconds × price per output second
          </code>
        </div>
        {lowestRow ? (
          <p>
            Example: {formatNumber(exampleVideoCount)} videos ×{" "}
            {exampleSecondsPerVideo} seconds ={" "}
            {formatNumber(exampleTotalSeconds)} output seconds.{" "}
            {formatNumber(exampleTotalSeconds)} ×{" "}
            {formatMoney(lowestRow.pricePerSecond, 4)} ={" "}
            <strong>{formatMoney(exampleLowestCost, 2)}</strong> estimated
            lowest cost based on the lowest listed 720p route in this dataset.
          </p>
        ) : null}
      </section>

      <section
        className="static-comparison"
        aria-labelledby="pricing-table-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">720p normalized pricing</p>
            <h2 id="pricing-table-title">
              Seedance 2.0 720p price per output second
            </h2>
          </div>
          <p>Server-rendered from local pricing data</p>
        </div>
        <div className="table-wrap">
          <table className="pricing-table pricing-table-wide">
            <caption className="sr-only">
              Seedance 2.0 720p normalized price per output second table
            </caption>
            <thead>
              <tr>
                <th scope="col">Provider</th>
                <th scope="col">Model / Variant</th>
                <th scope="col">Mode</th>
                <th scope="col">Resolution</th>
                <th scope="col">Price per output second</th>
                <th scope="col">Cost per 8-second video</th>
                <th scope="col">Cost per minute</th>
                <th scope="col">Cost per hour</th>
                <th scope="col">Source</th>
                <th scope="col">Note</th>
              </tr>
            </thead>
            <tbody>
              {rows720p.length > 0 ? (
                rows720p.map((row) => {
                  const costPerEightSecondVideo = getCostForVideos(
                    row.pricePerSecond,
                    1,
                    8,
                  );
                  const costPerMinute = getCostPerMinute(row.pricePerSecond);
                  const costPerHour = getCostPerHour(row.pricePerSecond);

                  return (
                    <tr
                      key={`${row.provider}-${row.modelName}-${row.mode}-${row.resolution}`}
                    >
                      <th scope="row">{row.provider}</th>
                      <td>{row.modelName}</td>
                      <td>{row.mode}</td>
                      <td>{row.resolution}</td>
                      <td>
                        <span className="table-primary">
                          {formatMoney(row.pricePerSecond, 4)}
                        </span>
                        <small className="table-secondary">
                          {row.billingUnit}
                        </small>
                        {row.videoTokenPricePerMillion !== undefined ? (
                          <small className="table-secondary">
                            {formatMoney(row.videoTokenPricePerMillion, 2)} /M
                            video tokens
                          </small>
                        ) : null}
                      </td>
                      <td>{formatMoney(costPerEightSecondVideo, 4)}</td>
                      <td>{formatMoney(costPerMinute, 4)}</td>
                      <td>{formatMoney(costPerHour, 2)}</td>
                      <td className="source-cell">
                        <a
                          href={row.sourceUrl}
                          rel={getSourceRel(row)}
                          target="_blank"
                        >
                          {row.sourceLabel}
                          <span className="external-mark" aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      </td>
                      <td>{row.note}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="empty-state" colSpan={10}>
                    No listed providers for 720p yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-section" aria-labelledby="methodology-title">
        <p className="eyebrow">Source and methodology</p>
        <h2 id="methodology-title">How these per-second prices are normalized</h2>
        <p>
          Data comes from listed public pricing pages linked in the table.
          Prices are represented in USD per output second so 720p routes can be
          compared on the same billing unit.
        </p>
        <p>
          Estimates do not include taxes, discounts, retries, storage, transfer
          fees, account-specific pricing, or provider-specific production
          terms. If a row includes a provider note, it is shown in the table.
        </p>
      </section>

      <section className="content-section" aria-labelledby="next-steps-title">
        <p className="eyebrow">Next steps</p>
        <h2 id="next-steps-title">
          Compare seconds, minutes, providers, or monthly cost
        </h2>
        <p>
          Need a full monthly estimate? Use the{" "}
          <Link className="text-link" href="/seedance-2-pricing-calculator">
            Seedance 2.0 pricing calculator
          </Link>
          .
        </p>
        <p>
          Need a per-minute budget view? See{" "}
          <Link className="text-link" href="/seedance-2-cost-per-minute">
            Seedance 2 cost per minute
          </Link>
          .
        </p>
        <p>
          Comparing listed provider prices? See{" "}
          <Link className="text-link" href="/seedance-2-cheapest-api">
            cheapest Seedance 2 API providers
          </Link>
          .
        </p>
        <p>
          Tracking Seedance 2.5? See the{" "}
          <Link className="text-link" href="/seedance-2-5-pricing">
            Seedance 2.5 pricing tracker
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
