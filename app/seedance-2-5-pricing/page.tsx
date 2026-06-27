import type { Metadata } from "next";
import Link from "next/link";

import type { PricingRow } from "@/lib/pricing";
import pricingData from "@/pricing-data.json";

import { EmailCaptureForm } from "./email-capture-form";

export const dynamic = "force-static";

const pageTitle = "Seedance 2.5 API Pricing Tracker | Video API Cost";
const pageDescription =
  "Seedance 2.5 does not yet have a confirmed public API rate. Track Seedance 2.5 API pricing status, provider availability, and Seedance 2.0 baseline costs.";
const lastCheckedDate = "2026-06-27";
const lastCheckedDisplay = "June 27, 2026";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/seedance-2-5-pricing",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/seedance-2-5-pricing",
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

const baselineRows = pricingRows
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

const providerRows = [
  {
    provider: "Volcengine / ByteDance",
    apiStatus: "Not listed",
    pricingStatus: "Not published",
    source: "Official channels",
  },
  {
    provider: "BytePlus",
    apiStatus: "Not listed",
    pricingStatus: "Pending public pricing",
    source: "Provider listing",
  },
  {
    provider: "fal.ai",
    apiStatus: "Not listed",
    pricingStatus: "Monitoring",
    source: "Provider listing",
  },
  {
    provider: "PiAPI",
    apiStatus: "Not listed",
    pricingStatus: "Monitoring",
    source: "Provider listing",
  },
  {
    provider: "OpenRouter",
    apiStatus: "Not listed",
    pricingStatus: "Monitoring",
    source: "Provider listing",
  },
  {
    provider: "EvoLink",
    apiStatus: "Not listed",
    pricingStatus: "Monitoring",
    source: "Provider listing",
  },
  {
    provider: "Kie.ai",
    apiStatus: "Not listed",
    pricingStatus: "Monitoring",
    source: "Provider listing",
  },
];

const quickAnswerItems = [
  "Official Seedance 2.5 API pricing: Not published",
  "Third-party provider pricing: Not published",
  "Cost calculator: Pending until pricing is available",
  "Temporary baseline: Seedance 2.0 pricing",
  "This page will be updated when official or provider pricing becomes available.",
];

const faqItems = [
  {
    question: "Is Seedance 2.5 API pricing available?",
    answer:
      "No. Official Seedance 2.5 API pricing has not been publicly published yet. This page tracks official and third-party provider pricing as it becomes available.",
  },
  {
    question: "Can I estimate Seedance 2.5 cost using Seedance 2.0 pricing?",
    answer:
      "Seedance 2.0 pricing can be used as a temporary baseline for budget planning, but it should not be treated as a forecast for Seedance 2.5 pricing.",
  },
  {
    question: "When will this page be updated?",
    answer:
      "This page will be updated when official pricing or major provider listings become public. The provider tracker includes a last checked date for transparency.",
  },
  {
    question: "Which providers may list Seedance 2.5 API pricing?",
    answer:
      "This page monitors official and third-party provider listings, including Volcengine / ByteDance, BytePlus, fal.ai, PiAPI, OpenRouter, EvoLink, and Kie.ai.",
  },
  {
    question: "Will this page become a calculator after pricing is published?",
    answer:
      "Yes. Once public pricing is available, this tracker can be updated into a pricing comparison and cost calculator for common video generation scenarios.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: pageTitle,
      description: pageDescription,
      url: "https://videoapicost.com/seedance-2-5-pricing",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://videoapicost.com/seedance-2-5-pricing#breadcrumbs",
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
          name: "Seedance 2.5 API Pricing Tracker",
          item: "https://videoapicost.com/seedance-2-5-pricing",
        },
      ],
    },
    {
      "@type": "FAQPage",
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

function formatCurrency(value: number, maximumFractionDigits = 5) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: pricingData.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value);
}

function getPriceType(row: PricingRow) {
  if ("videoTokenPricePerMillion" in row) {
    return "Video-token estimate";
  }

  if (row.billingUnit.includes("estimated")) {
    return "Estimated per-second rate";
  }

  return "Public per-second rate";
}

function getProviderLinkRel(row: PricingRow) {
  if (row.provider === "Kie.ai") {
    return "sponsored nofollow noopener noreferrer";
  }

  return "noopener noreferrer";
}

export default function SeedanceTwoFivePricingPage() {
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
        <span>Seedance 2.5 pricing</span>
      </nav>

      <section className="page-heading tracker-page-heading">
        <p className="eyebrow">Pricing Tracker</p>
        <h1>Seedance 2.5 API Pricing Tracker</h1>
        <p>Seedance 2.5 API pricing is not officially published yet.</p>
        <p>
          Seedance 2.5 does not yet have a confirmed public API rate, so a fair
          price comparison is not possible. Until public pricing is available,
          Seedance 2.0 pricing is the best temporary baseline for API cost
          estimation.
        </p>
        <p className="tracker-status-line">
          <span className="status-dot" aria-hidden="true" />
          <span>Status: Actively monitoring</span>
          <span aria-hidden="true">·</span>
          <span>
            Last checked:{" "}
            <time dateTime={lastCheckedDate}>{lastCheckedDisplay}</time>
          </span>
        </p>
      </section>

      <section
        className="quick-answer-card tracker-quick-answer"
        aria-labelledby="quick-answer"
      >
        <h2 id="quick-answer">Quick Answer</h2>
        <ul className="quick-answer-list">
          {quickAnswerItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="content-section" aria-labelledby="what-is-title">
        <h2 id="what-is-title">What is Seedance 2.5?</h2>
        <p>
          Seedance 2.5 is the next version in ByteDance’s Seedance video
          generation model series. Public API pricing has not been confirmed
          yet, so this page tracks official pricing, third-party provider
          availability, and cost references as they become available.
        </p>
      </section>

      <section className="update-cta email-capture" aria-labelledby="email-cta">
        <div>
          <p className="eyebrow">Pricing update</p>
          <h2 id="email-cta">Get Seedance 2.5 pricing updates</h2>
          <p>
            Get notified when official or provider Seedance 2.5 API pricing
            becomes available. No spam — only pricing updates.
          </p>
        </div>
        <EmailCaptureForm />
      </section>

      <section
        className="static-comparison baseline-table"
        aria-labelledby="baseline-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Seedance 2.0 baseline</p>
            <h2 id="baseline-title">
              Estimated Cost Baseline Based on Seedance 2.0
            </h2>
          </div>
          <p>Temporary reference only</p>
        </div>
        <p className="baseline-copy">
          Seedance 2.5 pricing is not available yet. Seedance 2.0 pricing can
          be used only as a temporary reference baseline, not as a forecast for
          Seedance 2.5 pricing.
        </p>
        <div className="table-wrap">
          <table className="pricing-table-wide">
            <caption className="sr-only">
              Seedance 2.0 baseline pricing table for Seedance 2.5 API cost
              estimation
            </caption>
            <thead>
              <tr>
                <th scope="col">Provider</th>
                <th scope="col">Model / Mode</th>
                <th scope="col">Resolution</th>
                <th scope="col">Price per second</th>
                <th scope="col">8-second video</th>
                <th scope="col">1,000 × 8-second videos</th>
                <th scope="col">Price type</th>
                <th scope="col">Check provider</th>
              </tr>
            </thead>
            <tbody>
              {baselineRows.map((row) => (
                <tr
                  key={`${row.provider}-${row.modelName}-${row.mode}-${row.resolution}`}
                >
                  <th data-label="Provider" scope="row">
                    {row.provider}
                  </th>
                  <td data-label="Model / Mode">
                    <span className="table-primary">{row.modelName}</span>
                    <small className="table-secondary">{row.mode}</small>
                  </td>
                  <td data-label="Resolution">{row.resolution}</td>
                  <td data-label="Price per second">
                    {formatCurrency(row.pricePerSecond)}
                  </td>
                  <td data-label="8-second video">
                    {formatCurrency(row.costPerVideo)}
                  </td>
                  <td
                    className="monthly-cost"
                    data-label="1,000 × 8-second videos"
                  >
                    {formatCurrency(row.monthlyCost, 2)}
                  </td>
                  <td data-label="Price type">{getPriceType(row)}</td>
                  <td
                    className="provider-action-cell"
                    data-label="Check provider"
                  >
                    <a
                      className="provider-check-link"
                      href={row.sourceUrl}
                      rel={getProviderLinkRel(row)}
                      target="_blank"
                    >
                      Check provider
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
        <p className="trust-note">
          Some provider links may be affiliate links. Provider order and
          pricing notes are based on public listed pricing, not commission.
          Always verify current pricing on the provider’s official page before
          making production decisions.
        </p>
        <div className="baseline-footer">
          <Link className="text-link" href="/seedance-2-pricing-calculator">
            View full Seedance 2.0 pricing comparison
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section
        className="static-comparison tracker-table"
        aria-labelledby="provider-tracking-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Provider watchlist</p>
            <h2 id="provider-tracking-title">
              Seedance 2.5 Provider Pricing Tracker
            </h2>
          </div>
          <p>No confirmed public rates yet</p>
        </div>
        <p className="baseline-copy">
          The table below tracks whether major API providers have listed
          Seedance 2.5 and whether public pricing is available.
        </p>
        <div className="table-wrap">
          <table>
            <caption className="sr-only">
              Seedance 2.5 provider pricing tracker table
            </caption>
            <thead>
              <tr>
                <th scope="col">Provider</th>
                <th scope="col">Seedance 2.5 API status</th>
                <th scope="col">Pricing status</th>
                <th scope="col">Last checked</th>
                <th scope="col">Source</th>
              </tr>
            </thead>
            <tbody>
              {providerRows.map((provider) => (
                <tr key={provider.provider}>
                  <th scope="row">{provider.provider}</th>
                  <td>
                    <span className="status-badge">{provider.apiStatus}</span>
                  </td>
                  <td>{provider.pricingStatus}</td>
                  <td>
                    <time dateTime={lastCheckedDate}>
                      {lastCheckedDisplay}
                    </time>
                  </td>
                  <td>{provider.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="trust-note">
          A provider will be added to the price comparison only after its
          public rate, billing unit, model variant, and output resolution can be
          verified.
        </p>
        <p className="open-data-link">
          <a
            href="https://github.com/Tylerz0/seedance-2-5-api-pricing"
            rel="noopener noreferrer"
            target="_blank"
          >
            View open data repository on GitHub
            <span className="external-mark" aria-hidden="true">
              ↗
            </span>
          </a>
        </p>
      </section>

      <section className="content-section faq" aria-labelledby="faq-title">
        <p className="eyebrow">FAQ</p>
        <h2 id="faq-title">
          Frequently Asked Questions about Seedance 2.5 API Pricing
        </h2>
        {faqItems.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>

      <p className="back-link">
        <Link href="/video-generation-api-pricing">
          <span aria-hidden="true">←</span>
          Back to video generation API pricing
        </Link>
      </p>
    </div>
  );
}
