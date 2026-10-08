import type { Metadata, Viewport } from "next";
import { Manrope, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeCursor } from "@/components/ThemeCursor";
import { PageMotion } from "@/components/PageMotion";
import { CatCompanion } from "@/components/CatCompanion";
import { AppearanceDock } from "@/components/AppearanceDock";
import { appearanceInitScript } from "@/lib/appearance";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { currentRole } from "@/lib/data/profile";
import { PageIntro } from "@/components/PageIntro";
import { pageIntroInitScript } from "@/lib/page-intro";

const kanit = Manrope({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans-var",
  display: "swap",
});

const editorial = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-editorial-var", display: "swap" });

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-var",
  display: "swap",
});

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  title: "Tamir — UI/UX & Frontend",
  description:
    `Tamir (Phi Vuong Tuong Tam) — frontend developer and UI/UX designer at ${currentRole.company}. Interfaces, application flows, and PWA experiences. Based in Ho Chi Minh City.`,
  metadataBase: new URL(baseUrl),
  icons: {
    icon: { url: "/brand/favicons/editorial-light.png?v=circle-1", type: "image/png", sizes: "64x64" },
    shortcut: "/brand/favicons/editorial-light.png?v=circle-1",
    apple: "/brand/cat-favicon.png",
  },
  openGraph: {
    title: "Tamir — UI/UX & Frontend",
    description: `${currentRole.title} at ${currentRole.company}. Interfaces, application flows, and PWA experiences.`,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f7f2",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="editorial" data-appearance="light" data-appearance-preference="system" data-motion="on" suppressHydrationWarning className={`${kanit.variable} ${editorial.variable} ${mono.variable}`}>
      <head>
        <link rel="preload" as="image" href="/brand/cat-mark.png" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: appearanceInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: pageIntroInitScript }} />
      </head>
      <body className="antialiased" style={{ overflowX: "clip" }}>
        <ThemeProvider>
          <PageIntro />
          <a href="#main-content" className="skip-link">Skip to content</a>
          <Header />
          <AppearanceDock />
          {children}
          <Footer />
          <ThemeCursor />
          <PageMotion />
          <CatCompanion />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
