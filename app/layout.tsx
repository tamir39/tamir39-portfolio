import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const kanit = Kanit({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
  display: "swap",
});

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  title: "Tâm — Portfolio",
  description:
    "Portfolio of Phi Vuong Tuong Tam (tamir39) — Computer Science student, game developer, builder. HCMC, Vietnam.",
  metadataBase: new URL(baseUrl),
  icons: {
    icon: "/tamir-favicon.png",
    shortcut: "/tamir-favicon.png",
    apple: "/tamir-favicon.png",
  },
  openGraph: {
    title: "Tâm — Portfolio",
    description: "Frontend · Game Dev · Builder · HCMC",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0C0C0C",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={kanit.variable} suppressHydrationWarning>
      <body className="antialiased" style={{ overflowX: "clip" }}>
        <MotionProvider>
          {children}
          <Footer />
        </MotionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
