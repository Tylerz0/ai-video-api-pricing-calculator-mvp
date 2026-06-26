import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

const pageTitle = "Video API Cost | AI Video API Pricing Calculator";
const pageDescription =
  "Estimate and compare AI video generation API costs with transparent, provider-level pricing calculators.";
const pageUrl = "https://videoapicost.com/";

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

export default function HomePage() {
  return (
    <div className="shell page-section">
      <section className="hero">
        <p className="eyebrow">Simple cost planning</p>
        <h1>AI Video API Pricing Calculator</h1>
        <p className="hero-copy">
          Estimate monthly AI video generation costs and compare providers
          before you build.
        </p>
        <Link className="button" href="/video-generation-api-pricing">
          View video API pricing
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="home-section" aria-labelledby="what-this-tool-does">
        <p className="eyebrow">Cost planning</p>
        <h2 id="what-this-tool-does">What this tool does</h2>
        <p>
          Estimate AI video API costs before building a product or production
          workflow. Enter expected video volume and duration to compare public
          per-second rates on a consistent monthly scenario.
        </p>
      </section>

      <section
        className="home-section supported-calculator"
        aria-labelledby="supported-calculator-title"
      >
        <div>
          <p className="eyebrow">Available now</p>
          <h2 id="supported-calculator-title">
            Currently supported calculator
          </h2>
          <p>
            The Seedance 2 Pricing Calculator compares public rates across
            BytePlus, fal.ai, PiAPI, OpenRouter, EvoLink, and Kie.ai. Its
            default scenario is 1,000 videos per month at 8 seconds per video.
          </p>
        </div>
        <Link className="text-link" href="/seedance-2-pricing-calculator">
          Open Seedance 2 Pricing Calculator
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section
        className="home-section supported-calculator"
        aria-labelledby="seedance-2-5-tracker-title"
      >
        <div>
          <p className="eyebrow">Pricing watch</p>
          <h2 id="seedance-2-5-tracker-title">Seedance 2.5 pricing tracker</h2>
          <p>
            Official Seedance 2.5 API pricing is not published yet. Follow
            release and provider pricing updates as confirmed rates become
            available.
          </p>
        </div>
        <Link className="text-link" href="/seedance-2-5-pricing">
          Track Seedance 2.5 pricing
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
