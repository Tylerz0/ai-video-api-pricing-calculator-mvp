import type { Metadata } from "next";
import Link from "next/link";

import { PricingCalculator } from "@/components/pricing-calculator";
import type { PricingRow } from "@/lib/pricing";
import pricingData from "@/pricing-data.json";

export const dynamic = "force-static";

const pageTitle =
  "Seedance 2.0 API Pricing Calculator: Fast, Mini & Standard Costs | Video API Cost";
const pageDescription =
  "Compare Seedance 2.0 Standard, Fast, and Mini API pricing across providers. Estimate cost per 8-second video and monthly generation costs.";
const siteUrl = "https://videoapicost.com";
const pageUrl = `${siteUrl}/seedance-2-pricing-calculator`;

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

const displayDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
}).format(new Date(`${pricingData.lastUpdated}T00:00:00Z`));

const pricingRows = pricingData.pricingRows as PricingRow[];

const defaultComparison = pricingRows
  .filter((row) => row.resolution === "720p")
  .map((row) => ({
    ...row,
    costPerVideo:
      row.pricePerSecond * pricingData.defaultInputs.secondsPerVideo,
    monthlyCost:
      row.pricePerSecond *
      pricingData.defaultInputs.secondsPerVideo *
      pricingData.defaultInputs.videosPerMonth,
  }))
  .sort((a, b) => a.monthlyCost - b.monthlyCost);

const cheapestPriceRow = defaultComparison[0];
const highestPriceRow = defaultComparison[defaultComparison.length - 1];
const isKieSource = (row: PricingRow) =>
  new URL(row.sourceUrl).hostname === "kie.ai";

function formatCurrency(value: number, maximumFractionDigits = 4) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: pricingData.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value);
}

// ── Variant filtering helpers ──

const variantFilter = (row: PricingRow, keywords: string[]) =>
  keywords.some((kw) => row.mode.toLowerCase().includes(kw));

const fastRows = pricingRows.filter((row) =>
  variantFilter(row, ["fast"]),
);
const miniRows = pricingRows.filter((row) =>
  variantFilter(row, ["mini"]),
);
const standardRows = pricingRows.filter(
  (row) =>
    !variantFilter(row, ["fast", "mini"]) ||
    row.mode.toLowerCase().includes("standard"),
);

// ── Dynamic provider lists ──

const fast720Providers = [
  ...new Set(
    fastRows
      .filter((r) => r.resolution === "720p")
      .map((r) => r.provider),
  ),
];
const mini720Providers = [
  ...new Set(
    miniRows
      .filter((r) => r.resolution === "720p")
      .map((r) => r.provider),
  ),
];
const standard720Providers = [
  ...new Set(
    standardRows
      .filter((r) => r.resolution === "720p")
      .map((r) => r.provider),
  ),
];
const allProviders = [...new Set(pricingRows.map((r) => r.provider))];

// Fast vs Standard pairs for FAQ (same provider has both variants at 720p)
const fastVsStandardPairs = (() => {
  const fast720 = fastRows.filter((r) => r.resolution === "720p");
  const standard720 = standardRows.filter((r) => r.resolution === "720p");
  const pairs: { fast: PricingRow; standard: PricingRow }[] = [];
  for (const fastRow of fast720) {
    const stdRow = standard720.find((r) => r.provider === fastRow.provider);
    if (stdRow) pairs.push({ fast: fastRow, standard: stdRow });
  }
  return pairs.sort(
    (a, b) => a.fast.pricePerSecond - b.fast.pricePerSecond,
  );
})();

// ── Variant summary ──

interface VariantSummary {
  variant: string;
  lowestRate: number;
  costPerVideo: number;
  providers: string[];
  note: string;
}

function getLowest720p(rows: PricingRow[]): PricingRow | undefined {
  return rows
    .filter((r) => r.resolution === "720p")
    .sort((a, b) => a.pricePerSecond - b.pricePerSecond)[0];
}

function buildVariantSummary(
  variantName: string,
  rows: PricingRow[],
  note: string,
): VariantSummary {
  const lowest = getLowest720p(rows);
  const providers720p = [
    ...new Set(
      rows
        .filter((r) => r.resolution === "720p")
        .map((r) => r.provider),
    ),
  ];
  return {
    variant: variantName,
    lowestRate: lowest?.pricePerSecond ?? 0,
    costPerVideo:
      (lowest?.pricePerSecond ?? 0) * pricingData.defaultInputs.secondsPerVideo,
    providers: providers720p,
    note,
  };
}

const variantSummaries: VariantSummary[] = [
  buildVariantSummary(
    "Seedance 2.0 Fast",
    fastRows,
    "Fast mode is available across most providers and is typically 15–20% cheaper than Standard.",
  ),
  buildVariantSummary(
    "Seedance 2.0 Mini",
    miniRows,
    `Mini is the lowest-cost variant, offered by ${mini720Providers.join(" and ")} at 720p.`,
  ),
  buildVariantSummary(
    "Seedance 2.0 Standard",
    standardRows,
    "Standard is the most widely available variant across all listed providers.",
  ),
];

// ── FAQ ──

const cheapestFast = getLowest720p(fastRows);
const cheapestMini = getLowest720p(miniRows);

const faqItems = [
  {
    question: "How much does Seedance 2 cost per 8-second video?",
    answer: `In the default 720p comparison, an 8-second video ranges from ${formatCurrency(cheapestPriceRow.costPerVideo, 5)} for ${cheapestPriceRow.provider} ${cheapestPriceRow.mode} to ${formatCurrency(highestPriceRow.costPerVideo, 4)} for ${highestPriceRow.provider} ${highestPriceRow.mode}. Final pricing depends on the provider, model mode, resolution, and settings.`,
  },
  {
    question: "Which Seedance 2 provider has the lowest listed 720p rate?",
    answer: `In the current listed 720p comparison, the lowest listed rate is ${cheapestPriceRow.provider} ${cheapestPriceRow.modelName} ${cheapestPriceRow.mode} at ${formatCurrency(cheapestPriceRow.pricePerSecond)} per output second. This is a price-only comparison, not a provider recommendation. Referral links, where used, do not affect pricing data, calculations, or ranking.`,
  },
  {
    question: "How much does it cost to generate 1,000 Seedance 2 videos?",
    answer: `For 1,000 720p videos at 8 seconds each, the listed estimates range from ${formatCurrency(cheapestPriceRow.monthlyCost, 2)} for ${cheapestPriceRow.provider} ${cheapestPriceRow.mode} to ${formatCurrency(highestPriceRow.monthlyCost, 2)} for ${highestPriceRow.provider} ${highestPriceRow.mode}. The calculator lets you change volume, duration, and resolution.`,
  },
  {
    question: "Is Seedance 2 Fast cheaper than standard Seedance 2?",
    answer:
      fastVsStandardPairs.length > 0
        ? `Yes in the current listed same-provider 720p comparisons. ${fastVsStandardPairs
            .map(
              ({ fast, standard }) =>
                `${fast.provider} ${fast.mode} is ${formatCurrency(fast.pricePerSecond)} per second versus ${standard.mode} at ${formatCurrency(standard.pricePerSecond)}`,
            )
            .join(". ")}.`
        : "Based on current listed rates, Fast variants are generally priced lower than Standard variants at the same resolution, but availability and pricing vary by provider.",
  },
  {
    question: "How much does Seedance 2.0 Fast cost?",
    answer: cheapestFast
      ? `The lowest listed 720p Fast rate is ${formatCurrency(cheapestFast.pricePerSecond)} per second from ${cheapestFast.provider} (${cheapestFast.mode}), which equals about ${formatCurrency(cheapestFast.pricePerSecond * 8)} per 8-second video. Fast pricing varies by provider and resolution — use the calculator to compare options.`
      : "Seedance 2.0 Fast pricing varies by provider. Use the calculator to filter Fast rows and compare per-second rates.",
  },
  {
    question: "How much does Seedance 2.0 Mini cost?",
    answer: cheapestMini
      ? `The lowest listed 720p Mini rate is ${formatCurrency(cheapestMini.pricePerSecond)} per second from ${cheapestMini.provider} (${cheapestMini.mode}), which equals about ${formatCurrency(cheapestMini.pricePerSecond * 8)} per 8-second video. Mini is the lowest-cost variant in the current dataset, but availability is limited to fewer providers.`
      : "Seedance 2.0 Mini pricing varies by provider. Mini is typically the lowest-cost variant but is offered by fewer providers.",
  },
  {
    question: "Is Seedance 2.0 Mini cheaper than Seedance 2.0 Fast?",
    answer:
      cheapestMini && cheapestFast
        ? `Yes, based on current listed 720p rates. The lowest Mini rate (${cheapestMini.provider}: ${formatCurrency(cheapestMini.pricePerSecond)}/sec) is cheaper than the lowest Fast rate (${cheapestFast.provider}: ${formatCurrency(cheapestFast.pricePerSecond)}/sec). However, Mini has fewer provider options and may have different quality, resolution support, or availability. Always verify current pricing and availability on the provider's page.`
        : "Based on current listed rates, Mini variants tend to be priced lower than Fast variants, but availability and supported resolutions vary by provider.",
  },
  {
    question:
      "What is the difference between Seedance 2.0 Standard, Fast, and Mini?",
    answer:
      "Seedance 2.0 variants differ by speed, quality, and pricing. Fast mode reduces generation time at a lower per-second cost compared to Standard, making it suitable for high-volume or rapid-iteration workflows. Mini is a lighter, lower-cost variant for budget-conscious use cases, though it may have fewer resolution options and is offered by fewer providers. Standard mode provides full-quality generation and is the most widely available variant across providers. Final choice depends on resolution needs, generation volume, acceptable quality, and provider availability.",
  },
];

// ── Structured data ──

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["WebApplication", "SoftwareApplication"],
      "@id": `${pageUrl}#software-application`,
      name: "Seedance 2.0 API Pricing Calculator",
      description:
        "A neutral calculator for estimating Seedance 2.0 API cost per video across Standard, Fast, and Mini variants. Compares public provider rates by selected resolution. Provider ranking is price-only and referral links do not affect pricing data, calculations, or ranking.",
      url: pageUrl,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      featureList: [
        "Compare public Seedance 2.0 API pricing by provider and variant",
        "Filter provider rates by output resolution",
        "Estimate cost per video for Standard, Fast, and Mini modes",
        "Estimate monthly generation cost",
      ],
    },
    {
      "@type": "Dataset",
      "@id": `${pageUrl}#dataset`,
      name: "Seedance 2.0 public API pricing comparison",
      description:
        "Public Seedance 2.0 provider pricing manually collected from linked provider pages and normalized to USD per output second where possible. Covers Standard, Fast, Mini, and provider-specific modes. Provider ranking is price-only for the selected resolution, and referral links do not affect calculations or ranking.",
      url: pageUrl,
      dateModified: pricingData.lastUpdated,
      license: `${siteUrl}/seedance-2-pricing-calculator`,
      creator: {
        "@type": "Organization",
        name: "Video API Cost",
        url: siteUrl,
      },
      variableMeasured: [
        "Provider",
        "Model and mode",
        "Output resolution",
        "Price per output second",
        "Estimated cost per video",
        "Estimated monthly cost",
      ],
      measurementTechnique:
        "Manual collection from linked public provider pricing pages, normalization to USD per output second, and comparison within the same output resolution.",
      isBasedOn: Array.from(
        new Set(pricingRows.map((row) => row.sourceUrl)),
      ),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Video Generation API Pricing",
          item: `${siteUrl}/video-generation-api-pricing`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Seedance 2.0 API Pricing Calculator",
          item: pageUrl,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

// ── Variant section table component ──

function VariantTable({
  rows,
  caption,
}: {
  rows: PricingRow[];
  caption: string;
}) {
  const variantRows = rows
    .filter((r) => r.resolution === "720p")
    .map((r) => ({
      ...r,
      costPerVideo:
        r.pricePerSecond * pricingData.defaultInputs.secondsPerVideo,
    }))
    .sort((a, b) => a.pricePerSecond - b.pricePerSecond);

  if (variantRows.length === 0) return <p>No 720p rows found for this variant.</p>;

  return (
    <div className="table-wrap" style={{ marginTop: 20 }}>
      <table className="pricing-table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Provider</th>
            <th scope="col">Model / Mode</th>
            <th scope="col">Resolution</th>
            <th scope="col">Price per second</th>
            <th scope="col">8-second video</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          {variantRows.map((row) => (
            <tr
              key={`${row.provider}-${row.modelName}-${row.mode}-${row.resolution}`}
            >
              <th scope="row">{row.provider}</th>
              <td>
                <span className="table-primary">{row.modelName}</span>
                <small className="table-secondary">{row.mode}</small>
              </td>
              <td>{row.resolution}</td>
              <td>{formatCurrency(row.pricePerSecond, 5)}</td>
              <td>{formatCurrency(row.costPerVideo, 5)}</td>
              <td className="source-cell">
                <a
                  href={row.sourceUrl}
                  rel={
                    isKieSource(row)
                      ? "sponsored nofollow noreferrer"
                      : "noreferrer"
                  }
                  target="_blank"
                >
                  {row.sourceLabel}
                  <span className="external-mark" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Page ──

export default function SeedancePricingCalculatorPage() {
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
        <span>Seedance 2.0</span>
      </nav>

      {/* ── 1. Hero ── */}
      <section className="calculator-hero">
        <div className="page-heading calculator-page-heading">
          <p className="eyebrow">Provider comparison</p>
          <h1>Seedance 2.0 API Pricing Calculator</h1>
          <p>
            Compare Seedance 2.0 Standard, Fast, and Mini API pricing across
            providers. The default scenario is 1,000 videos per month at 8
            seconds per video. Compare providers at the same selected resolution.
          </p>
          <p>
            Some providers refer to this model family as Seedance 2, while others
            list it as Seedance 2.0. This page compares Seedance 2.0 Standard,
            Fast, Mini, and provider-specific modes across public API providers.
          </p>
          <p className="updated-date">
            Pricing data last updated{" "}
            <time dateTime={pricingData.lastUpdated}>{displayDate}</time>
          </p>
          <ul className="hero-trust-list" aria-label="Pricing comparison notes">
            <li>Same-resolution comparison</li>
            <li>Local pricing data</li>
            <li>Provider source links</li>
          </ul>
        </div>

        <aside className="hero-summary-card" aria-label="Seedance 2.0 pricing summary">
          <p className="summary-badge">Lowest listed 720p route</p>
          <h2>
            {cheapestPriceRow.provider}
            <span>{cheapestPriceRow.modelName}</span>
          </h2>
          <p className="hero-summary-mode">{cheapestPriceRow.mode}</p>
          <p className="hero-summary-price">
            {formatCurrency(cheapestPriceRow.pricePerSecond, 5)}
            <span>per output second</span>
          </p>
          <div className="hero-summary-grid">
            <div>
              <span>Default scenario</span>
              <strong>
                {pricingData.defaultInputs.videosPerMonth.toLocaleString(
                  "en-US",
                )}{" "}
                videos × {pricingData.defaultInputs.secondsPerVideo}s
              </strong>
            </div>
            <div>
              <span>Estimated monthly cost</span>
              <strong>{formatCurrency(cheapestPriceRow.monthlyCost, 2)}</strong>
            </div>
          </div>
          <p className="hero-summary-note">
            Same-resolution comparison at 720p. Last updated{" "}
            <time dateTime={pricingData.lastUpdated}>{displayDate}</time>.
          </p>
        </aside>
      </section>

      {/* ── 2. Interactive calculator ── */}
      <PricingCalculator
        currency={pricingData.currency}
        defaultSecondsPerVideo={pricingData.defaultInputs.secondsPerVideo}
        defaultVideosPerMonth={pricingData.defaultInputs.videosPerMonth}
        pricingRows={pricingRows}
      />

      {/* ── 3. Cost summary ── */}
      <section className="cost-summary" aria-labelledby="cost-summary-title">
        <p className="eyebrow">Cost summary</p>
        <h2 id="cost-summary-title">Seedance 2.0 720p cost summary</h2>
        <p className="cost-summary-scenario">
          <strong>Default scenario:</strong>{" "}
          {pricingData.defaultInputs.videosPerMonth.toLocaleString("en-US")}{" "}
          videos/month <span aria-hidden="true">·</span>{" "}
          {pricingData.defaultInputs.secondsPerVideo} seconds/video{" "}
          <span aria-hidden="true">·</span> 720p
        </p>
        <div className="cost-summary-details">
          <p>
            Listed 720p estimates range from{" "}
            <strong>{formatCurrency(cheapestPriceRow.costPerVideo, 5)}</strong>{" "}
            to{" "}
            <strong>{formatCurrency(highestPriceRow.costPerVideo, 4)}</strong>{" "}
            per video.
          </p>
          <p>
            For{" "}
            {pricingData.defaultInputs.videosPerMonth.toLocaleString("en-US")}{" "}
            videos per month, that equals about{" "}
            <strong>{formatCurrency(cheapestPriceRow.monthlyCost, 2)}</strong>{" "}
            to{" "}
            <strong>{formatCurrency(highestPriceRow.monthlyCost, 2)}</strong>.
          </p>
          <p>
            <strong>Lowest listed 720p route:</strong>{" "}
            {cheapestPriceRow.provider} {cheapestPriceRow.modelName}{" "}
            {cheapestPriceRow.mode} at{" "}
            {formatCurrency(cheapestPriceRow.pricePerSecond)} per output second.
          </p>
          <p>
            <strong>Formula:</strong> monthly cost = videos × seconds × price
            per second.
          </p>
        </div>
        <p className="cost-summary-note">
          These estimates are based on public prices as of {displayDate}, not
          billing guarantees. Verify the linked provider page before production
          use.
        </p>
      </section>

      {/* ── 4. Default 720p comparison table ── */}
      <section
        className="static-comparison"
        aria-labelledby="default-comparison-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Default comparison</p>
            <h2 id="default-comparison-title">
              Seedance 2.0 720p cost for 1,000 eight-second videos
            </h2>
          </div>
          <p>Server-rendered from local pricing data</p>
        </div>
        <div className="table-wrap">
          <table className="pricing-table pricing-table-wide">
            <caption className="sr-only">
              Static Seedance 2.0 720p pricing comparison for 1,000 videos at 8
              seconds each, comparing providers at the same resolution
            </caption>
            <thead>
              <tr>
                <th scope="col">Provider</th>
                <th scope="col">Model / Mode</th>
                <th scope="col">Resolution</th>
                <th scope="col">Price per second</th>
                <th scope="col">Cost per 8-second video</th>
                <th scope="col">Cost for 1,000 videos</th>
                <th scope="col">Source</th>
              </tr>
            </thead>
            <tbody>
              {defaultComparison.map((row, index) => (
                <tr
                  className={index === 0 ? "is-lowest-row" : undefined}
                  key={`${row.provider}-${row.modelName}-${row.mode}-${row.resolution}`}
                >
                  <th scope="row">
                    <span>{row.provider}</span>
                    {index === 0 ? (
                      <small className="lowest-rate-badge">
                        Lowest listed 720p rate
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
                    {"audioPricing" in row &&
                    typeof row.audioPricing === "string" ? (
                      <small className="table-secondary">
                        {row.audioPricing}
                      </small>
                    ) : null}
                  </td>
                  <td className="numeric-cell">
                    <span className="table-primary">
                      {formatCurrency(row.pricePerSecond, 5)}
                    </span>
                    <small className="table-secondary">{row.billingUnit}</small>
                    {"videoTokenPricePerMillion" in row &&
                    typeof row.videoTokenPricePerMillion === "number" ? (
                      <small className="table-secondary">
                        {formatCurrency(row.videoTokenPricePerMillion, 2)} /M
                        video tokens
                      </small>
                    ) : null}
                  </td>
                  <td className="numeric-cell">
                    {formatCurrency(row.costPerVideo, 5)}
                  </td>
                  <td className="monthly-cost numeric-cell">
                    {formatCurrency(row.monthlyCost, 2)}
                  </td>
                  <td className="source-cell">
                    <a
                      href={row.sourceUrl}
                      rel={
                        isKieSource(row)
                          ? "sponsored nofollow noreferrer"
                          : "noreferrer"
                      }
                      target="_blank"
                    >
                      {row.sourceLabel}
                      <span className="external-mark" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                    <small>{row.note}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="trust-note">
          The default comparison uses 720p rows only so providers are compared
          at the same output resolution. Other resolutions may have different
          pricing and availability.{" "}
          Prices are based on public provider pricing pages as of{" "}
          {pricingData.lastUpdated}. Always verify pricing and availability
          with the provider before production use.
        </p>
      </section>

      <section className="trust-strip" aria-label="Pricing calculator trust notes">
        <article>
          <span aria-hidden="true">◎</span>
          <h3>Same selected resolution</h3>
          <p>Default rows compare 720p routes only.</p>
        </article>
        <article>
          <span aria-hidden="true">↻</span>
          <h3>Real-time calculation</h3>
          <p>Costs update when volume, duration, or resolution changes.</p>
        </article>
        <article>
          <span aria-hidden="true">◇</span>
          <h3>Multiple modes</h3>
          <p>Standard, Fast, Mini, and provider-specific rows are included.</p>
        </article>
        <article>
          <span aria-hidden="true">✓</span>
          <h3>Transparent pricing</h3>
          <p>Each row links back to its listed provider source.</p>
        </article>
      </section>

      <section
        className="content-section"
        aria-labelledby="related-cost-guides-title"
      >
        <p className="eyebrow">Related guides</p>
        <h2 id="related-cost-guides-title">
          Related Seedance 2 cost guides
        </h2>
        <p>
          Use these companion pages when you need a simpler reference for
          listed public API prices, normalized cost units, or future Seedance
          pricing status.
        </p>
        <ul className="quick-answer-list">
          <li>
            <Link
              className="text-link"
              href="/seedance-2-api-cost-per-second"
            >
              Seedance 2 API cost per second
            </Link>{" "}
            for normalized per-output-second pricing.
          </li>
          <li>
            <Link className="text-link" href="/seedance-2-cost-per-minute">
              Seedance 2 cost per minute
            </Link>{" "}
            for per-minute and per-hour estimated cost.
          </li>
          <li>
            <Link className="text-link" href="/seedance-2-cheapest-api">
              Cheapest Seedance 2 API providers
            </Link>{" "}
            for a price-only 720p provider ranking.
          </li>
          <li>
            <Link className="text-link" href="/seedance-2-5-pricing">
              Seedance 2.5 pricing tracker
            </Link>{" "}
            for monitoring pricing availability beyond Seedance 2.0.
          </li>
        </ul>
      </section>

      {/* ── 2. Variant navigation ── */}
      <section className="variant-nav" aria-labelledby="variant-nav-title">
        <h2 id="variant-nav-title">Seedance 2.0 variants covered</h2>
        <ul className="variant-nav-list">
          <li>
            <a href="#fast-pricing">Seedance 2.0 Fast</a>
          </li>
          <li>
            <a href="#mini-pricing">Seedance 2.0 Mini</a>
          </li>
          <li>
            <a href="#standard-pricing">Seedance 2.0 Standard</a>
          </li>
          <li>
            <span>Provider-specific Pro and no-video-input routes</span>
          </li>
        </ul>
      </section>

      {/* ── 5. Variant summary ── */}
      <section
        className="content-section"
        aria-labelledby="variant-summary-title"
      >
        <h2 id="variant-summary-title">
          Seedance 2.0 Standard vs Fast vs Mini Pricing
        </h2>
        <p>
          The table below summarizes the lowest listed 720p rate for each
          Seedance 2.0 variant across currently tracked providers. Use this as
          a quick comparison, then check the variant-specific sections for
          detailed provider rows.
        </p>
        <div className="table-wrap" style={{ marginTop: 20 }}>
          <table className="variant-summary-table">
            <caption className="sr-only">
              Seedance 2.0 variant pricing summary — Standard vs Fast vs Mini
            </caption>
            <thead>
              <tr>
                <th scope="col">Variant</th>
                <th scope="col">Lowest listed 720p rate</th>
                <th scope="col">8-second video cost</th>
                <th scope="col">Providers found</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {variantSummaries.map((vs) => (
                <tr key={vs.variant}>
                  <th scope="row">{vs.variant}</th>
                  <td>
                    {vs.lowestRate > 0
                      ? formatCurrency(vs.lowestRate)
                      : "N/A"}
                  </td>
                  <td>
                    {vs.costPerVideo > 0
                      ? formatCurrency(vs.costPerVideo)
                      : "N/A"}
                  </td>
                  <td>
                    {vs.providers.length > 0
                      ? vs.providers.join(", ")
                      : "None listed"}
                  </td>
                  <td>{vs.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 7. Fast pricing ── */}
      <section className="content-section" aria-labelledby="fast-pricing">
        <h2 id="fast-pricing">Seedance 2.0 Fast API Pricing</h2>
        <p>
          Seedance 2.0 Fast is a lower-latency variant designed for rapid
          iteration and high-volume workflows. Fast mode typically costs 15–20%
          less than Standard at the same resolution, making it a common choice
          for prototyping, A/B testing, and batch video generation.
        </p>
        <p>
          Fast rows are available from {fast720Providers.join(", ")} at 720p.
          Availability at other resolutions varies by provider.
        </p>
        <VariantTable
          caption="Seedance 2.0 Fast 720p pricing rows across providers"
          rows={fastRows}
        />
      </section>

      {/* ── 8. Mini pricing ── */}
      <section className="content-section" aria-labelledby="mini-pricing">
        <h2 id="mini-pricing">Seedance 2.0 Mini API Pricing</h2>
        <p>
          Seedance 2.0 Mini is the lightest and lowest-cost variant in the
          Seedance 2.0 family. It is priced below Fast and Standard at the same
          resolution, but provider availability is more limited — currently
          listed by {mini720Providers.join(", ")} at 720p.
        </p>
        <p>
          BytePlus publishes pricing examples for Dreamina Seedance 2.0 Mini,
          but Mini rows are excluded from the provider ranking until production
          API availability is confirmed.
        </p>
        <VariantTable
          caption="Seedance 2.0 Mini 720p pricing rows across providers"
          rows={miniRows}
        />
      </section>

      {/* ── 9. Standard pricing ── */}
      <section className="content-section" aria-labelledby="standard-pricing">
        <h2 id="standard-pricing">Seedance 2.0 Standard API Pricing</h2>
        <p>
          Seedance 2.0 Standard is the full-quality generation mode and the most
          broadly available variant across all tracked providers. It offers the
          widest resolution support — from 480p up to 4K on select providers —
          and covers text-to-video, image-to-video, and no-video-input
          workflows.
        </p>
        <p>
          Standard pricing is available from {standard720Providers.join(", ")}{" "}
          at multiple resolutions. Use the interactive calculator above to
          filter by resolution and provider.
        </p>
        <VariantTable
          caption="Seedance 2.0 Standard 720p pricing rows across providers"
          rows={standardRows}
        />
      </section>

      {/* ── 10. Methodology ── */}
      <section
        className="content-section methodology"
        aria-labelledby="methodology-title"
      >
        <h2 id="methodology-title">Methodology</h2>
        <p>
          This calculator uses a small, manually maintained dataset designed
          for transparent, like-for-like price estimates.
        </p>
        <ul>
          <li>
            <strong>Collection:</strong> Rates are transcribed from the public
            provider pages linked in the comparison table.
          </li>
          <li>
            <strong>Normalization:</strong> Listed rates are represented in US
            dollars per output second.
          </li>
          <li>
            <strong>Fair comparison:</strong> Providers are compared only
            within the selected output resolution; the server-rendered default
            uses 720p. Kie.ai and BytePlus official rows use no-video-input
            scenarios.
          </li>
          <li>
            <strong>Calculation:</strong> Monthly cost equals videos per month ×
            seconds per video × provider price per second.
          </li>
          <li>
            <strong>Exclusions:</strong> Estimates do not include taxes,
            credits, volume discounts, retries, storage, transfer fees, or
            provider-specific account terms.
          </li>
          <li>
            <strong>BytePlus official pricing:</strong> BytePlus bills by video
            tokens. Its rows are normalized from the official 5-second, 16:9,
            no-video-input examples by dividing the listed per-video estimate
            by five. Actual charges depend on token consumption returned by the
            API.
          </li>
          <li>
            <strong>BytePlus Mini availability:</strong> BytePlus publishes
            pricing examples for Dreamina Seedance 2.0 Mini, but API
            availability and production access should be verified in the
            official BytePlus documentation before use. Mini rows are excluded
            from the provider ranking until production API availability is
            confirmed in this dataset.
          </li>
        </ul>
        <p>
          The pricing dataset was last updated on{" "}
          <time dateTime={pricingData.lastUpdated}>{displayDate}</time>.
        </p>
      </section>

      {/* ── 11. Pricing sources ── */}
      <section className="content-section" aria-labelledby="sources-title">
        <h2 id="sources-title">Pricing sources</h2>
        <p>
          Each comparison row links to the public page used for its listed
          rate. Rates are normalized to US dollars per output second so the
          scenarios are comparable; provider-specific model modes and billing
          details are identified in the table.
        </p>
        <p>
          Kie.ai outbound links use a referral URL. Referral links do not
          affect pricing data, calculations, or provider ranking.
        </p>
        <ul className="source-list">
          {Array.from(
            new Map(
              pricingRows.map((row) => [row.sourceUrl, row]),
            ).values(),
          ).map((row) => (
            <li key={row.sourceUrl}>
              <a
                href={row.sourceUrl}
                rel={
                  isKieSource(row)
                    ? "sponsored nofollow noreferrer"
                    : "noreferrer"
                }
                target="_blank"
              >
                {row.sourceLabel}
                <span className="external-mark" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 12. About Seedance 2.0 ── */}
      <section className="content-section" aria-labelledby="about-seedance-20">
        <h2 id="about-seedance-20">About Seedance 2.0</h2>
        <p>
          Seedance 2.0 is a video generation model used for short AI video
          workflows, including product demos, social clips, creative tests, ad
          concepts, and automated video production pipelines.
        </p>

        <div className="version-comparison">
          <article>
            <p className="directory-card-label">Pricing unit</p>
            <h3>Output-second cost</h3>
            <p>
              The calculator normalizes provider prices into practical cost
              terms: price per output second, cost per generated video, and
              estimated monthly cost.
            </p>
          </article>
          <article>
            <p className="directory-card-label">Default scenario</p>
            <h3>1,000 × 8 seconds</h3>
            <p>
              The baseline uses 1,000 videos per month at 8 seconds per video,
              giving a realistic comparison point before production setup.
            </p>
          </article>
          <article>
            <p className="directory-card-label">Default comparison</p>
            <h3>720p rows only</h3>
            <p>
              The default table compares 720p rows only, because 480p, 720p,
              and 1080p outputs have different quality and cost structures.
            </p>
          </article>
          <article>
            <p className="directory-card-label">Provider coverage</p>
            <h3>Public listed sources</h3>
            <p>
              Current data covers {allProviders.join(", ")} where public
              pricing is available.
            </p>
          </article>
        </div>

        <p>
          Seedance 2.0 pricing is not always listed in the same format across
          providers. Some providers show a simple per-second rate. BytePlus
          official examples use video-token based pricing, which is normalized
          here into an estimated USD per output second.
        </p>
        <p>
          Some routes may also use "from" pricing or provider-routed pricing,
          meaning the final cost can depend on the route, mode, account terms,
          or API behavior. Use the calculator to switch resolution and compare
          providers within the same output tier.
        </p>
      </section>

      {/* ── 13. Cost optimization tips ── */}
      <section
        className="content-section"
        aria-labelledby="seedance-2-cost-optimization-tips"
      >
        <h2 id="seedance-2-cost-optimization-tips">
          Seedance 2.0 Cost Optimization Tips
        </h2>
        <p>
          Use these checks to compare providers fairly and estimate the cost of
          usable finished videos, not just the lowest listed rate.
        </p>

        <div className="version-comparison">
          <article>
            <p className="directory-card-label">Tip 01</p>
            <h3>Compare the same resolution</h3>
            <p>
              A 480p route may look cheaper than 720p or 1080p, but that does
              not make it the best option for your workflow. Compare 720p with
              720p, or 1080p with 1080p, to avoid choosing based on a
              lower-quality output tier.
            </p>
          </article>
          <article>
            <p className="directory-card-label">Tip 02</p>
            <h3>Estimate finished-video cost</h3>
            <p>
              Price per output second is only the starting point. Use{" "}
              <strong>
                videos per month × seconds per video × price per output second
              </strong>
              ; for example, an 8-second video at $0.12/sec costs about $0.96,
              or about $960 for 1,000 generations before taxes, retries, failed
              generations, credits, storage, or provider-specific fees.
            </p>
          </article>
          <article>
            <p className="directory-card-label">Tip 03</p>
            <h3>Use 720p for early testing</h3>
            <p>
              720p is often enough to evaluate motion, framing, visual style,
              and prompt behavior while avoiding higher 1080p costs. Test
              prompts and scene ideas at 720p, then reserve higher-cost routes
              for clips that are ready for final use.
            </p>
          </article>
          <article>
            <p className="directory-card-label">Tip 04</p>
            <h3>Check routed and token pricing</h3>
            <p>
              Providers may use direct per-second pricing, "from" pricing,
              provider-routed pricing, or BytePlus-style video tokens. Treat
              normalized per-second estimates as comparison aids, then confirm
              the rate for your selected model, mode, resolution, and input
              type.
            </p>
          </article>
          <article>
            <p className="directory-card-label">Tip 05</p>
            <h3>Track retries and unused outputs</h3>
            <p>
              The lowest listed route is not always the lowest-cost real
              workflow. Track total generations, successful generations,
              accepted clips, retry rate, and average cost by provider and
              resolution to measure cost per usable finished video.
            </p>
          </article>
        </div>

        <p>
          Seedance 2.0 API pricing matters most when video generation becomes
          repeatable. For a few test clips, provider differences may be small;
          at hundreds or thousands of videos per month, small per-second
          differences can materially change the monthly budget.
        </p>
      </section>

      {/* ── 14. FAQ ── */}
      <section className="content-section faq" aria-labelledby="faq-title">
        <h2 id="faq-title">Frequently asked questions</h2>
        {faqItems.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>

      {/* ── 15. Related guide ── */}
      <aside className="related-guide">
        <p className="related-guide-title">Related guide</p>
        <p className="related-guide-body">
          Tracking Seedance 2.5 API pricing? Monitor official and provider
          pricing status until confirmed public rates become available.
        </p>
        <Link className="text-link" href="/seedance-2-5-pricing">
          Seedance 2.5 pricing tracker
          <span aria-hidden="true">→</span>
        </Link>
      </aside>
    </div>
  );
}
