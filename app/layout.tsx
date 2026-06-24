import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="shell header-inner">
            <Link className="brand" href="/">
              <img
                alt="Video API Cost logo"
                className="brand-logo"
                height={28}
                src="/logo.png"
                width={28}
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
