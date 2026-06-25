import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: "%s",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  alternateName: siteConfig.alternateName,
  url: `${siteConfig.url}/`,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: `${siteConfig.url}/`,
  logo: `${siteConfig.url}${siteConfig.logoPath}`,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
          type="application/ld+json"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
          type="application/ld+json"
        />
        <header className="site-header">
          <div className="shell header-inner">
            <Link className="brand" href="/">
              <img
                alt="Video API Cost logo"
                className="brand-logo"
                height={48}
                src="/logo.png"
                width={48}
              />
              Video API Cost
            </Link>
            <nav aria-label="Main navigation">
              <Link href="/video-generation-api-pricing">
                Pricing calculators
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <Analytics />
        <SpeedInsights />
        <footer className="site-footer">
          <div className="shell footer-inner">
            <p>Independent AI video API cost estimates.</p>
            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/video-generation-api-pricing">
                Video API pricing
              </Link>
              <Link href="/seedance-2-pricing-calculator">
                Seedance 2 calculator
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
