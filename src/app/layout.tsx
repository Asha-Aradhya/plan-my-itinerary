import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import AuthSessionProvider from "@/components/layout/AuthSessionProvider/AuthSessionProvider";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://plan-my-itinerary.vercel.app";

const siteDescription =
  "AI-powered travel itinerary generator. Create personalised, day-by-day trip plans for any destination in seconds — free and tailored to your style.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Plan My Itinerary | AI-Powered Travel Itinerary Generator",
    template: "%s | Plan My Itinerary",
  },
  description: siteDescription,
  applicationName: "Plan My Itinerary",
  keywords: [
    "AI trip planner",
    "itinerary generator",
    "travel itinerary",
    "trip planner",
    "vacation planner",
    "AI travel planner",
    "personalised itinerary",
  ],
  authors: [{ name: "Plan My Itinerary" }],
  appleWebApp: {
    capable: true,
    title: "Plan My Itinerary",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Plan My Itinerary",
    title: "Plan My Itinerary | AI-Powered Travel Itinerary Generator",
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plan My Itinerary | AI-Powered Travel Itinerary Generator",
    description: siteDescription,
  },
  verification: {
    google: "NKaX7QlqVIE2dIkPnbrxtw6goD0gYvZafjgvw4bEMd8",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Plan My Itinerary",
  url: siteUrl,
  description: siteDescription,
  applicationCategory: "TravelApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1f3d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
