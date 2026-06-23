import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Video Generation API Pricing",
  description:
    "Browse AI video generation API pricing calculators and estimate monthly costs by model and provider.",
  alternates: {
    canonical: "/video-generation-api-pricing",
  },
};

export default function VideoGenerationPricingPage() {
  return (
    <div className="shell page-section">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>Video generation API pricing</span>
      </nav>

      <section className="page-heading">
        <p className="eyebrow">Calculator directory</p>
        <h1>Video Generation API Pricing</h1>
        <p>
          This hub compares AI video API costs by model and provider using
          consistent video volume and duration scenarios.
        </p>
      </section>

      <section aria-labelledby="calculators-title">
        <h2 className="section-title" id="calculators-title">
          Available calculators
        </h2>
        <ul className="calculator-directory">
          <li>
            <article className="directory-card">
              <div className="directory-card-content">
                <div>
                  <p className="directory-card-label">Model</p>
                  <h3>Seedance 2</h3>
                </div>
                <div>
                  <p className="directory-card-label">Default scenario</p>
                  <p className="directory-card-scenario">
                    1,000 videos/month × 8 seconds/video
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
        </ul>
        <p className="hub-note">
          More calculators may be added after search demand is validated.
        </p>
      </section>
    </div>
  );
}
