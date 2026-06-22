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
        <div className="hub-table-wrap">
          <table className="hub-table">
            <thead>
              <tr>
                <th scope="col">Model</th>
                <th scope="col">Default scenario</th>
                <th scope="col">Calculator</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Seedance 2</th>
                <td>1,000 videos/month × 8 seconds/video</td>
                <td>
                  <Link
                    className="text-link"
                    href="/seedance-2-pricing-calculator"
                  >
                    Compare Seedance 2 pricing
                    <span aria-hidden="true">→</span>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="hub-note">
          More calculators may be added after search demand is validated.
        </p>
      </section>
    </div>
  );
}
