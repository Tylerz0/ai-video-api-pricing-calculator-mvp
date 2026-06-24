import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

const siteUrl = "https://videoapicost.com";
const pageUrl = `${siteUrl}/video-generation-api-pricing`;

export const metadata: Metadata = {
  title:
    "AI Video API Pricing Comparison: Text-to-Video and Image-to-Video Cost",
  description:
    "Compare AI video API pricing for text-to-video and image-to-video workflows. Learn how model, provider, duration, resolution, mode, and billing unit affect video generation API cost.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "AI Video API Pricing Comparison",
    description:
      "Understand AI video API pricing across text-to-video, image-to-video, provider billing units, and model-level cost calculators.",
    url: pageUrl,
    siteName: "Video API Cost",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Video API Pricing Comparison",
    description:
      "Understand AI video API pricing across text-to-video, image-to-video, provider billing units, and model-level cost calculators.",
  },
};

const COST_FACTORS = [
  {
    factor: "Model",
    detail:
      "Different video models have different quality levels, speed, availability, and pricing.",
  },
  {
    factor: "Provider",
    detail:
      "Official APIs, aggregators, proxy platforms, and subscription tools may bill differently.",
  },
  {
    factor: "Input type",
    detail:
      "Text-to-video, image-to-video, reference-to-video, and no-video-input routes can have different pricing.",
  },
  {
    factor: "Duration",
    detail:
      "Longer videos usually cost more when billing is based on output seconds.",
  },
  {
    factor: "Resolution",
    detail:
      "720p, 1080p, and higher resolutions may have different prices or availability.",
  },
  {
    factor: "Mode",
    detail:
      "Mini, Fast, Standard, Pro, Preview, or Quality modes can change cost.",
  },
  {
    factor: "Billing unit",
    detail:
      "Providers may charge per second, per video, per token, per credit, or per subscription plan.",
  },
  {
    factor: "Production terms",
    detail:
      "Retries, failed generations, rate limits, storage, and transfer fees can affect real production cost.",
  },
];

const COST_SCENARIOS = [
  {
    scenario: "100 × 8-second videos/month",
    useCase: "Small tests, prototypes, and demos",
    check: "Minimum cost, provider availability, and basic quality",
  },
  {
    scenario: "1,000 × 8-second videos/month",
    useCase: "Batch content, apps, agents, and workflow automation",
    check:
      "Cost per video, accepted output rate, retries, and monthly spend",
  },
  {
    scenario: "10,000 × 8-second videos/month",
    useCase: "High-volume production",
    check:
      "Rate limits, reliability, volume pricing, failed generations, and provider terms",
  },
];

const FAQ_ITEMS = [
  {
    q: "What is AI video API pricing?",
    a: "AI video API pricing is the cost of generating videos through an API. It may depend on model, provider, duration, resolution, input type, generation mode, and billing unit.",
  },
  {
    q: "How do I estimate AI video generation API cost?",
    a: "For per-second pricing, multiply the provider's price per output second by video duration, then multiply by the number of videos generated.",
  },
  {
    q: "Is image-to-video API pricing different from text-to-video pricing?",
    a: "It can be. Some providers use different endpoints, models, modes, durations, or credit systems for image-to-video workflows.",
  },
  {
    q: "Why compare AI video API providers?",
    a: "The same or similar model may be available through official APIs, aggregators, or proxy platforms with different billing units, availability, and listed prices.",
  },
  {
    q: "Should I use API pricing or a subscription tool?",
    a: "API pricing is usually better for developers and automated workflows. Subscription tools may be better for creators who generate videos through a product interface instead of an API.",
  },
  {
    q: "Are the prices on Video API Cost guaranteed?",
    a: "No. The site uses public listed pricing as a research reference. Always verify provider billing, availability, credits, retries, storage, transfer fees, and account-specific terms before production use.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Video Generation API Pricing",
          item: pageUrl,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function VideoGenerationPricingPage() {
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
        <span>Video generation API pricing</span>
      </nav>

      {/* ---------- 1. Hero ---------- */}
      <section className="page-heading">
        <p className="eyebrow">AI video API pricing hub</p>
        <h1>AI Video API Pricing Comparison</h1>
        <p>
          Compare AI video API pricing across text-to-video and
          image-to-video workflows. Video generation APIs may be billed per
          output second, per generated video, by credits, by tokens, or
          through subscription plans. This page explains the main cost
          factors and links to detailed model-level pricing pages where
          public provider data is available.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link className="button" href="#available-pricing-pages">
            View available pricing pages
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="button" href="/seedance-2-pricing-calculator">
            View Seedance 2 pricing comparison
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ---------- 2. Quick Answer ---------- */}
      <section
        aria-labelledby="quick-answer"
        className="quick-answer-card"
      >
        <h2 id="quick-answer">Quick Answer: How AI Video API Pricing Works</h2>
        <p className="quick-answer-intro">
          AI video API pricing depends on the model, provider, input type,
          output duration, resolution, generation mode, and billing unit.
        </p>

        <div className="quick-answer-grid">
          <div className="quick-answer-factor">
            <h3>Billing unit</h3>
            <p>
              Providers may charge per output second, per generation, by
              credits, by tokens, or through subscription plans.
            </p>
          </div>
          <div className="quick-answer-factor">
            <h3>Generation workflow</h3>
            <p>
              Text-to-video, image-to-video, reference-to-video, and
              no-video-input routes may use different pricing.
            </p>
          </div>
          <div className="quick-answer-factor">
            <h3>Output settings</h3>
            <p>
              Duration, resolution, and generation mode can change the final
              video generation API cost.
            </p>
          </div>
        </div>

        <div className="quick-answer-formula">
          <p className="quick-answer-formula-title">
            Simple per-second estimate
          </p>
          <code className="quick-answer-formula-code">
            cost per video = price per output second × video duration
            <br />
            monthly cost = cost per video × monthly video volume
          </code>
        </div>

        <p className="quick-answer-note">
          For exact provider-level prices, use the detailed model pricing
          pages linked below.
        </p>
      </section>

      {/* ---------- 3. Pricing factors ---------- */}
      <section className="content-section" aria-labelledby="factors">
        <h2 id="factors">What Affects AI Video API Cost?</h2>
        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table>
            <caption className="sr-only">
              Factors that affect AI video API generation cost
            </caption>
            <thead>
              <tr>
                <th scope="col">Factor</th>
                <th scope="col">Why it matters</th>
              </tr>
            </thead>
            <tbody>
              {COST_FACTORS.map((f) => (
                <tr key={f.factor}>
                  <th scope="row">{f.factor}</th>
                  <td>{f.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- 4. Text-to-video ---------- */}
      <section
        className="content-section"
        aria-labelledby="text-to-video"
      >
        <h2 id="text-to-video">Text-to-Video API Pricing</h2>
        <p>
          Text-to-video APIs generate videos directly from a text prompt.
          Pricing is usually affected by the selected model, output
          duration, resolution, generation mode, and provider billing unit.
          This workflow is common for prompt-based video generation,
          automated creative testing, AI video apps, and content generation
          pipelines.
        </p>
        <Link className="text-link" href="/seedance-2-pricing-calculator">
          Compare Seedance 2 API pricing
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* ---------- 5. Image-to-video ---------- */}
      <section
        className="content-section"
        aria-labelledby="image-to-video"
      >
        <h2 id="image-to-video">Image-to-Video API Pricing</h2>
        <p>
          Image-to-video APIs use an input image to generate motion, camera
          movement, or scene continuation. Image-to-video pricing can differ
          from text-to-video pricing because providers may use different
          endpoints, modes, durations, or credit systems. When comparing
          providers, use rows with the same input type, resolution, and mode
          whenever possible.
        </p>
        <Link className="text-link" href="/seedance-2-pricing-calculator">
          View Seedance 2 image-to-video and provider pricing rows
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* ---------- 6. Cost scenarios ---------- */}
      <section className="content-section" aria-labelledby="scenarios">
        <h2 id="scenarios">AI Video Generation API Cost Scenarios</h2>
        <p>
          For budgeting, compare practical monthly usage scenarios instead
          of only looking at the lowest listed rate. A provider that looks
          cheap for one route may not be the best choice for a different
          input type, resolution, mode, or production workflow.
        </p>
        <div className="table-wrap" style={{ marginTop: 22 }}>
          <table>
            <caption className="sr-only">
              AI video generation API cost scenarios for small, medium, and
              high-volume production
            </caption>
            <thead>
              <tr>
                <th scope="col">Scenario</th>
                <th scope="col">Example use case</th>
                <th scope="col">What to check</th>
              </tr>
            </thead>
            <tbody>
              {COST_SCENARIOS.map((cs) => (
                <tr key={cs.scenario}>
                  <th scope="row">{cs.scenario}</th>
                  <td>{cs.useCase}</td>
                  <td>{cs.check}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- 7. API vs subscription ---------- */}
      <section
        className="content-section"
        aria-labelledby="api-vs-subscription"
      >
        <h2 id="api-vs-subscription">API Pricing vs Subscription Pricing</h2>
        <p>
          API pricing is usually better for developers, apps, automation
          workflows, and usage-based products because cost scales with
          generation volume. Subscription pricing may be better for creators
          who use a product interface and do not need direct API access.
          When comparing API providers with subscription tools, check
          whether the plan includes commercial usage, export limits,
          generation credits, queue priority, and API availability.
        </p>
      </section>

      {/* ---------- 8. Available pricing pages ---------- */}
      <section aria-labelledby="available" id="available-pricing-pages">
        <h2 className="section-title" id="available">
          Available AI Video API Pricing Pages
        </h2>
        <ul className="calculator-directory">
          <li>
            <article className="directory-card">
              <div className="directory-card-content">
                <div>
                  <p className="directory-card-label">Detailed comparison</p>
                  <h3>Seedance 2 API Pricing Comparison</h3>
                </div>
                <div>
                  <p className="directory-card-label">Includes</p>
                  <p className="directory-card-scenario">
                    View detailed Seedance 2 provider-level pricing, source
                    links, billing units, and cost calculations.
                  </p>
                </div>
              </div>
              <Link
                className="directory-card-link"
                href="/seedance-2-pricing-calculator"
              >
                Compare Seedance 2 pricing
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          </li>
          <li>
            <article className="directory-card">
              <div className="directory-card-content">
                <div>
                  <p className="directory-card-label">Pricing tracker</p>
                  <h3>Seedance 2.5 Pricing Tracker</h3>
                </div>
                <div>
                  <p className="directory-card-label">Status</p>
                  <p className="directory-card-scenario">
                    Track Seedance 2.5 API pricing availability, release
                    status, and future provider coverage.
                  </p>
                </div>
              </div>
              <Link
                className="directory-card-link"
                href="/seedance-2-5-pricing"
              >
                Seedance 2.5 API pricing status
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          </li>
        </ul>
      </section>

      {/* Coming soon */}
      <section
        className="directory-section"
        aria-labelledby="coming-soon"
      >
        <h2 className="section-title" id="coming-soon">
          Coming Soon
        </h2>
        <ul className="calculator-directory">
          {[
            "Kling API Pricing",
            "Veo API Pricing",
            "Runway API Pricing",
            "Luma API Pricing",
          ].map((name) => (
            <li key={name}>
              <article className="directory-card">
                <div className="directory-card-content">
                  <div>
                    <p className="directory-card-label">Coming soon</p>
                    <h3>{name}</h3>
                  </div>
                  <div>
                    <p className="directory-card-label">Status</p>
                    <p className="directory-card-scenario">
                      Not yet available
                    </p>
                  </div>
                </div>
                <span className="directory-card-link" aria-disabled="true">
                  Coming soon
                </span>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- 9. Methodology ---------- */}
      <section
        className="content-section methodology"
        aria-labelledby="methodology"
      >
        <h2 id="methodology">Methodology</h2>
        <p>
          Video API Cost uses manually reviewed public pricing sources where
          available. Detailed model pages normalize listed provider prices
          into practical budgeting units such as cost per output second,
          cost per 8-second video, and estimated monthly cost. Some
          providers publish fixed listed rates, while others publish
          starting prices, routed pricing, token pricing, credits, or
          subscription-based pricing. All estimates are for research and
          budgeting only. Production billing should always be verified with
          the provider.
        </p>
      </section>

      {/* ---------- 10. FAQ ---------- */}
      <section className="content-section faq" aria-labelledby="faq">
        <h2 id="faq">FAQ</h2>
        {FAQ_ITEMS.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <p className="back-link">
        <Link href="/">
          <span aria-hidden="true">←</span>
          Back to home
        </Link>
      </p>
    </div>
  );
}
