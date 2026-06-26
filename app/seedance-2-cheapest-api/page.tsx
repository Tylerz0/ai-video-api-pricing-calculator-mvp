import type { Metadata } from "next";
import Link from "next/link";

import {
  formatUsd,
  getCostForVideos,
  getCostPerHour,
  getCostPerMinute,
  getHighestPriceRow,
  getLowestPriceRow,
  getPriceRange,
  getRowsByResolution,
  sortRowsByPrice,
} from "@/lib/pricing-calculations";
import type { PricingRow } from "@/lib/pricing";
import pricingData from "@/pricing-data.json";

export const dynamic = "force-static";

const pageTitle = "Cheapest Seedance 2.0 API: Compare 720p Provider Pricing";
const pageDescription =
  "Find the lowest listed Seedance 2.0 720p API price across providers. Compare price per output second, 8-second video cost, per-minute cost, and provider sources.";
const pageUrl = "https://videoapicost.com/seedance-2-cheapest-api";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: "Video API Cost",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: pageDescription,
  },
};

const pricingRows = pricingData.pricingRows as PricingRow[];
const defaultResolution = "720p";
const rows720p = sortRowsByPrice(
  getRowsByResolution(pricingRows, defaultResolution),
);
const lowestRow = getLowestPriceRow(rows720p);
const highestRow = getHighestPriceRow(rows720p);
const priceRange = getPriceRange(rows720p);

const displayDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
}).format(new Date(`${pricingData.lastUpdated}T00:00:00Z`));

const exampleVideoCount = pricingData.defaultInputs.videosPerMonth;
const exampleSecondsPerVideo = pricingData.defaultInputs.secondsPerVideo;
const lowestEightSecondCost = lowestRow
  ? getCostForVideos(lowestRow.pricePerSecond, 1, exampleSecondsPerVideo)
  : null;
const lowestDefaultScenarioCost = lowestRow
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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${pageUrl}#breadcrumbs`,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://videoapicost.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Video Generation API Pricing",
      item: "https://videoapicost.com/video-generation-api-pricing",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Cheapest Seedance 2.0 API",
      item: pageUrl,
    },
  ],
};

export default function SeedanceTwoCheapestApiPage() {
  return (
    <div className="shell page-section">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/video-generation-api-pricing">Video API pricing</Link>
        <span aria-hidden="true">/</span>
        <span>Cheapest Seedance 2.0 API</span>
      </nav>

      <section className="page-heading">
        <p className="eyebrow">Cheapest listed 720p route</p>
        <h1>Cheapest Seedance 2.0 API</h1>
        <p>
          Compare listed public Seedance 2.0 API prices at 720p, sorted by
          normalized USD per output second so providers are compared at the same
          output resolution.
        </p>
      </section>

      <section className="quick-answer-card" aria-labelledby="quick-answer">
        <h2 id="quick-answer">Quick Answer</h2>
        {lowestRow && highestRow && priceRange ? (
          <>
            <p className="quick-answer-intro">
              Based on listed public API prices, the lowest listed 720p
              Seedance 2.0 route in this dataset is{" "}
              <strong>
                {lowestRow.provider} {lowestRow.modelName} {lowestRow.mode}
              </strong>
              .
            </p>
            <ul className="quick-answer-list">
              <li>
                Lowest listed 720p price per output second:{" "}
                <strong>{formatMoney(lowestRow.pricePerSecond, 4)}</strong>.
              </li>
              <li>
                Lowest estimated cost for an {exampleSecondsPerVideo}-second
                video: <strong>{formatMoney(lowestEightSecondCost, 4)}</strong>
                .
              </li>
              <li>
                Lowest estimated cost for {formatNumber(exampleVideoCount)} ×{" "}
                {exampleSecondsPerVideo}-second videos:{" "}
                <strong>{formatMoney(lowestDefaultScenarioCost, 2)}</strong>.
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

      <section className="content-section" aria-labelledby="why-title">
        <p className="eyebrow">Methodology</p>
        <h2 id="why-title">Why this route is listed as cheapest</h2>
        <p>
          The ranking uses normalized price per output second and only compares
          rows with the same output resolution: 720p. This keeps the default
          comparison from mixing cheaper low-resolution routes with more
          expensive higher-resolution routes.
        </p>
        <p>
          Final billing can still vary by input type, video input duration,
          audio mode, token-based billing, account terms, and provider-specific
          production behavior. This ranking is a listed-price comparison, not a
          billing guarantee.
        </p>
      </section>

      <section
        className="static-comparison"
        aria-labelledby="pricing-table-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">720p provider ranking</p>
            <h2 id="pricing-table-title">
              Cheapest 720p Seedance 2.0 providers
            </h2>
          </div>
          <p>Sorted by normalized price per output second</p>
        </div>
        <div className="table-wrap">
          <table className="pricing-table pricing-table-wide">
            <caption className="sr-only">
              Cheapest 720p Seedance 2.0 provider ranking table
            </caption>
            <thead>
              <tr>
                <th scope="col">Rank</th>
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
                rows720p.map((row, index) => {
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
                      <th scope="row">#{index + 1}</th>
                      <td>{row.provider}</td>
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
                  <td className="empty-state" colSpan={11}>
                    No listed providers for 720p yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-section" aria-labelledby="not-cheapest-title">
        <p className="eyebrow">Buying guidance</p>
        <h2 id="not-cheapest-title">When not to use the cheapest route</h2>
        <p>
          The lowest listed price is not always the best production choice. Use
          a different route if you need higher stability, a specific API
          feature, image-to-video or video-input support, enterprise SLA terms,
          regional availability, or official billing support.
        </p>
      </section>

      <section className="content-section" aria-labelledby="next-steps-title">
        <p className="eyebrow">Next steps</p>
        <h2 id="next-steps-title">Compare cost by seconds, minutes, or volume</h2>
        <p>
          Need a full monthly estimate? Use the{" "}
          <Link className="text-link" href="/seedance-2-pricing-calculator">
            Seedance 2.0 pricing calculator
          </Link>
          .
        </p>
        <p>
          Need the base per-second reference? See{" "}
          <Link className="text-link" href="/seedance-2-api-cost-per-second">
            Seedance 2.0 API cost per second
          </Link>
          .
        </p>
        <p>
          Comparing longer output durations? See{" "}
          <Link className="text-link" href="/seedance-2-cost-per-minute">
            Seedance 2.0 cost per minute
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
