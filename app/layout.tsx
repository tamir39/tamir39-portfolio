import type { Metadata, Viewport } from "next";
import { Orbitron, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { HudFrame } from "@/components/layout/HudFrame";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScanlineOverlay } from "@/components/hud/ScanlineOverlay";
import { CrtNoise } from "@/components/hud/CrtNoise";
import { Vignette } from "@/components/hud/Vignette";
import { AmbientBackdrop } from "@/components/hud/AmbientBackdrop";
import { ChannelSwitch } from "@/components/transitions/ChannelSwitch";
import { ChannelSweep } from "@/components/transitions/ChannelSweep";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { ActiveSectionProvider } from "@/components/providers/ActiveSectionProvider";
import { BootSequence } from "@/components/boot/BootSequence";
import { BootStatusProvider } from "@/components/providers/BootStatusProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-orbitron",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
});

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  title: "Tamir - Portfolio",
  description:
    "Portfolio of Phi Vuong Tuong Tam (tamir39) — Computer Science student, game developer, builder. HCMC, Vietnam.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Tamir - Portfolio",
    description: "Computer Science · Game Dev · Builder",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} ${jetbrainsMono.variable}`} style={{ background: "#000" }}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "html,body{margin:0;padding:0;color:#f1f8ff}html{background:#000}",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: [
              "(function(){try{",
              "var t=localStorage.getItem('tamir.theme');",
              "if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;",
              "var booted=sessionStorage.getItem('tamir.boot.shown')==='1';",
              "var bg=(booted&&t==='light')?'#ECECE4':'#000';",
              "document.documentElement.style.background=bg;",
              "document.body&&(document.body.style.background=bg);",
              "}catch(e){}})();",
            ].join(""),
          }}
        />
      </head>
      <body className="bg-bg text-text antialiased">
        <ThemeProvider>
        <BootStatusProvider>
          <BootSequence />
          <MotionProvider>
            <ActiveSectionProvider>
            <AmbientBackdrop />
            <Vignette />
            <ScanlineOverlay />
            <CrtNoise />
            <HudFrame />
            <Header />
            <ChannelSwitch />
            <ChannelSweep />
            <div className="relative z-[1] flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>
            </div>
            <Footer />
          </ActiveSectionProvider>
          </MotionProvider>
        </BootStatusProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
