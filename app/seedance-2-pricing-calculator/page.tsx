import type { Metadata } from "next";
import Link from "next/link";

import { PricingCalculator } from "@/components/pricing-calculator";
import { siteConfig } from "@/lib/site";
import pricingData from "@/pricing-data.json";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Seedance 2 Pricing Calculator: Cost per Video Across API Providers",
  description:
    "Calculate Seedance 2 API cost per video and compare public pricing across fal.ai, PiAPI, OpenRouter and EvoLink.",
  alternates: {
    canonical: "/seedance-2-pricing-calculator",
  },
};

const displayDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
}).format(new Date(`${pricingData.lastUpdated}T00:00:00Z`));

const defaultComparison = pricingData.pricingRows
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
const siteUrl = siteConfig.url.replace(/\/$/, "");
const pageUrl = `${siteUrl}/seedance-2-pricing-calculator`;

function formatCurrency(value: number, maximumFractionDigits = 4) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: pricingData.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value);
}

const faqItems = [
  {
    question: "How much does Seedance 2 cost per 8-second video?",
    answer: `In the default 720p comparison, an 8-second video ranges from ${formatCurrency(cheapestPriceRow.costPerVideo, 5)} for ${cheapestPriceRow.provider} ${cheapestPriceRow.mode} to ${formatCurrency(highestPriceRow.costPerVideo, 4)} for ${highestPriceRow.provider} ${highestPriceRow.mode}. Final pricing depends on the provider, model mode, resolution, and settings.`,
  },
  {
    question: "Which Seedance 2 API provider is cheapest?",
    answer: `${cheapestPriceRow.provider} offers ${cheapestPriceRow.modelName} in ${cheapestPriceRow.mode} mode at ${cheapestPriceRow.resolution} for the lowest listed rate in the default 720p comparison: ${formatCurrency(cheapestPriceRow.pricePerSecond)} per output second. OpenRouter and other provider-routed prices should be verified on the linked provider page before production use.`,
  },
  {
    question: "How much does it cost to generate 1,000 Seedance 2 videos?",
    answer: `For 1,000 720p videos at 8 seconds each, the listed estimates range from ${formatCurrency(cheapestPriceRow.monthlyCost, 2)} for ${cheapestPriceRow.provider} ${cheapestPriceRow.mode} to ${formatCurrency(highestPriceRow.monthlyCost, 2)} for ${highestPriceRow.provider} ${highestPriceRow.mode}. The calculator lets you change volume, duration, and resolution.`,
  },
  {
    question: "Is Seedance 2 Fast cheaper than standard Seedance 2?",
    answer: `Yes in the listed same-provider comparisons. fal.ai Fast is ${formatCurrency(0.2419)} per second versus ${formatCurrency(0.3034)} for Standard, while PiAPI Fast is ${formatCurrency(0.16)} versus ${formatCurrency(0.2)} for Pro at 720p. On OpenRouter, Fast versus Standard is ${formatCurrency(0.0538)} versus ${formatCurrency(0.06726)} at 480p, ${formatCurrency(0.121)} versus ${formatCurrency(0.1512)} at 720p, and ${formatCurrency(0.2722)} versus ${formatCurrency(0.3402)} at 1080p.`,
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${pageUrl}#software-application`,
      name: "Seedance 2 API Pricing Calculator",
      description:
        "A web calculator for estimating Seedance 2 API cost per video and comparing public provider rates at the same output resolution.",
      url: pageUrl,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      featureList: [
        "Compare public Seedance 2 API pricing by provider",
        "Filter provider rates by output resolution",
        "Estimate cost per video",
        "Estimate monthly generation cost",
      ],
    },
    {
      "@type": "Dataset",
      "@id": `${pageUrl}#dataset`,
      name: "Seedance 2 public API pricing comparison",
      description:
        "Public Seedance 2 provider pricing manually collected from linked provider pages and normalized to USD per output second.",
      url: pageUrl,
      dateModified: pricingData.lastUpdated,
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
        new Set(pricingData.pricingRows.map((row) => row.sourceUrl)),
      ),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumbs`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Video Generation API Pricing",
          item: `${siteUrl}/video-generation-api-pricing`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Seedance 2 API Pricing Calculator",
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
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

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
        <span>Seedance 2</span>
      </nav>

      <section className="page-heading calculator-page-heading">
        <p className="eyebrow">Provider comparison</p>
        <h1>Seedance 2 API Pricing Calculator</h1>
        <p>
          Compare public Seedance 2 provider pricing and estimate cost per
          video. The default scenario is 1,000 videos per month at 8 seconds
          per video. Compare providers at the same selected resolution.
        </p>
        <p className="updated-date">
          Pricing data last updated{" "}
          <time dateTime={pricingData.lastUpdated}>{displayDate}</time>
        </p>
      </section>

      <section className="cost-summary" aria-labelledby="cost-summary-title">
        <p className="eyebrow">Cost summary</p>
        <h2 id="cost-summary-title">Seedance 2 720p cost summary</h2>
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
            <strong>Formula:</strong> monthly cost = videos × seconds × price per
            second.
          </p>
        </div>
        <p className="cost-summary-note">
          These estimates are based on public prices as of {displayDate}, not
          billing guarantees. Verify the linked provider page before production
          use.
        </p>
      </section>

      <section
        className="static-comparison"
        aria-labelledby="default-comparison-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Default comparison</p>
            <h2 id="default-comparison-title">
              Seedance 2 720p cost for 1,000 eight-second videos
            </h2>
          </div>
          <p>Server-rendered from local pricing data</p>
        </div>
        <div className="table-wrap">
          <table className="pricing-table pricing-table-wide">
            <caption className="sr-only">
              Static Seedance 2 720p pricing comparison for 1,000 videos at 8
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
                  key={`${row.provider}-${row.modelName}-${row.mode}-${row.resolution}`}
                >
                  <th scope="row">
                    <span>{row.provider}</span>
                    {index === 0 ? (
                      <small>Lowest listed 720p rate</small>
                    ) : null}
                  </th>
                  <td>
                    <span className="table-primary">{row.modelName}</span>
                    <small className="table-secondary">{row.mode}</small>
                  </td>
                  <td>
                    <span className="table-primary">{row.resolution}</span>
                    {"audioPricing" in row &&
                    typeof row.audioPricing === "string" ? (
                      <small className="table-secondary">
                        {row.audioPricing}
                      </small>
                    ) : null}
                  </td>
                  <td>
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
                  <td>{formatCurrency(row.costPerVideo, 5)}</td>
                  <td className="monthly-cost">
                    {formatCurrency(row.monthlyCost, 2)}
                  </td>
                  <td className="source-cell">
                    <a
                      href={row.sourceUrl}
                      rel="noreferrer"
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

      <PricingCalculator
        currency={pricingData.currency}
        defaultSecondsPerVideo={pricingData.defaultInputs.secondsPerVideo}
        defaultVideosPerMonth={pricingData.defaultInputs.videosPerMonth}
        pricingRows={pricingData.pricingRows}
      />

      <section className="content-section methodology" aria-labelledby="methodology-title">
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
            uses 720p.
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
        </ul>
        <p>
          The pricing dataset was last updated on{" "}
          <time dateTime={pricingData.lastUpdated}>{displayDate}</time>.
        </p>
      </section>

      <section className="content-section" aria-labelledby="sources-title">
        <h2 id="sources-title">Pricing sources</h2>
        <p>
          Each comparison row links to the public page used for its listed
          rate. Rates are normalized to US dollars per output second so the
          scenarios are comparable; provider-specific model modes and billing
          details are identified in the table.
        </p>
        <ul className="source-list">
          {Array.from(
            new Map(
              pricingData.pricingRows.map((row) => [row.sourceUrl, row]),
            ).values(),
          ).map((row) => (
            <li key={row.sourceUrl}>
              <a href={row.sourceUrl} rel="noreferrer" target="_blank">
                {row.sourceLabel}
                <span className="external-mark" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="content-section faq" aria-labelledby="faq-title">
        <h2 id="faq-title">Frequently asked questions</h2>
        {faqItems.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>

      <aside className="back-link">
        <Link href="/video-generation-api-pricing">
          <span aria-hidden="true">←</span>
          Browse all video API calculators
        </Link>
      </aside>
    </div>
  );
}
