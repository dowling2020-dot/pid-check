import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EU Product Identifier (PID) Check — M-PID, NS-PID & S-PID readiness",
    template: "%s · PID Check",
  },
  description: SITE_TAGLINE,
  keywords: [
    "EU PID requirements",
    "product identifier customs EU November 2026",
    "M-PID NS-PID S-PID",
    "EU customs PID mandatory",
    "H7 product identifier",
    "GTIN check digit",
    "EU 150 euro duty exemption abolished",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "EU Product Identifier (PID) Check — get your SKUs ready for 1 November 2026",
    description: SITE_TAGLINE,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "EU Product Identifier (PID) Check",
    description: SITE_TAGLINE,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
