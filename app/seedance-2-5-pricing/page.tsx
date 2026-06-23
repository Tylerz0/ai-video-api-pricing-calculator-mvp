import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Seedance 2.5 API Pricing Tracker: Release Date, Cost Updates and Provider Comparison",
  description:
    "Track Seedance 2.5 API pricing updates across official channels, BytePlus, fal.ai, PiAPI, and OpenRouter, with Seedance 2.0 pricing as the current baseline.",
  alternates: {
    canonical: "/seedance-2-5-pricing",
  },
};

const providers = [
  {
    name: "Official / Volcengine",
    status: "Not officially published",
    note: "Tracking official model release and pricing documentation.",
  },
  {
    name: "BytePlus",
    status: "Awaiting confirmed pricing",
    note: "Tracking public API availability and regional pricing details.",
  },
  {
    name: "fal.ai",
    status: "Awaiting confirmed pricing",
    note: "Tracking a public model listing and per-second rate.",
  },
  {
    name: "PiAPI",
    status: "Awaiting confirmed pricing",
    note: "Tracking a public model listing and supported output options.",
  },
  {
    name: "OpenRouter",
    status: "Awaiting confirmed pricing",
    note: "Tracking model and provider-route pricing if listed.",
  },
];

const faqItems = [
  {
    question: "Is Seedance 2.5 API pricing available?",
    answer:
      "No official Seedance 2.5 API pricing has been published yet. This page tracks official and third-party provider listings as public pricing becomes available.",
  },
  {
    question: "When will Seedance 2.5 pricing be updated?",
    answer:
      "The tracker will be updated after a provider publishes a verifiable public price, supported resolution, and billing unit. Always confirm the latest rate on the provider page before production use.",
  },
  {
    question: "How will Seedance 2.5 cost be calculated?",
    answer:
      "When providers publish per-second pricing, estimated cost will use the same transparent formula as the current calculator: videos per month × seconds per video × provider price per output second.",
  },
  {
    question: "Where can I compare Seedance 2.5 provider pricing?",
    answer:
      "This page will compare confirmed Seedance 2.5 rates across official channels and supported API providers. Until then, use the Seedance 2 Pricing Calculator as the current provider and resolution baseline.",
  },
];

export default function SeedanceTwoFivePricingPage() {
  return (
    <div className="shell page-section">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/video-generation-api-pricing">Video API pricing</Link>
        <span aria-hidden="true">/</span>
        <span>Seedance 2.5 pricing</span>
      </nav>

      <section className="page-heading tracker-page-heading">
        <p className="eyebrow">Pricing watch</p>
        <h1>Seedance 2.5 API Pricing Tracker</h1>
        <p>
          Seedance 2.5 API pricing is not officially published yet. This page
          tracks official release details and public provider pricing so costs
          can be compared once verifiable rates become available.
        </p>
      </section>

      <section
        className="static-comparison tracker-table"
        aria-labelledby="provider-tracking-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Provider watchlist</p>
            <h2 id="provider-tracking-title">
              Seedance 2.5 provider pricing status
            </h2>
          </div>
          <p>No confirmed public rates yet</p>
        </div>
        <div className="table-wrap">
          <table>
            <caption className="sr-only">
              Seedance 2.5 pricing publication status by provider
            </caption>
            <thead>
              <tr>
                <th scope="col">Provider</th>
                <th scope="col">Pricing status</th>
                <th scope="col">What we are tracking</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.name}>
                  <th scope="row">{provider.name}</th>
                  <td>
                    <span className="status-badge">{provider.status}</span>
                  </td>
                  <td>{provider.note}</td>
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
      </section>

      <section
        className="content-section"
        aria-labelledby="seedance-comparison-title"
      >
        <p className="eyebrow">Current baseline</p>
        <h2 id="seedance-comparison-title">
          Seedance 2.5 vs Seedance 2.0 Pricing
        </h2>
        <p>
          Seedance 2.5 does not yet have a confirmed public API rate, so a fair
          price comparison is not possible. Seedance 2.0 is the current
          baseline, with provider rates compared at the same selected output
          resolution and normalized to USD per output second.
        </p>
        <div className="version-comparison">
          <article>
            <p className="directory-card-label">Seedance 2.5</p>
            <h3>Pricing pending</h3>
            <p>
              Official price, supported resolutions, model modes, and provider
              availability still need confirmation.
            </p>
          </article>
          <article>
            <p className="directory-card-label">Seedance 2.0</p>
            <h3>Current pricing baseline</h3>
            <p>
              Compare published provider rates by resolution and estimate cost
              per video or month.
            </p>
            <Link className="text-link" href="/seedance-2-pricing-calculator">
              Open the Seedance 2 pricing calculator
              <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      </section>

      <section className="update-cta" aria-labelledby="pricing-update-title">
        <div>
          <p className="eyebrow">Release notification</p>
          <h2 id="pricing-update-title">Get Seedance 2.5 pricing update</h2>
          <p>
            Request an email update when confirmed public Seedance 2.5 API
            pricing is added to this tracker.
          </p>
        </div>
        <a
          className="button"
          href="mailto:hello@videoapicost.com?subject=Seedance%202.5%20pricing%20update"
        >
          Get Seedance 2.5 pricing update
          <span aria-hidden="true">→</span>
        </a>
      </section>

      <section className="content-section faq" aria-labelledby="faq-title">
        <p className="eyebrow">FAQ</p>
        <h2 id="faq-title">Seedance 2.5 pricing questions</h2>
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
