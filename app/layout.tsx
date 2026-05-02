import type { Metadata, Viewport } from "next";
import { Orbitron, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { HudFrame } from "@/components/layout/HudFrame";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { ScanlineOverlay } from "@/components/hud/ScanlineOverlay";
import { CrtNoise } from "@/components/hud/CrtNoise";
import { Vignette } from "@/components/hud/Vignette";
import { HudCursor } from "@/components/hud/HudCursor";
import { ChannelSwitch } from "@/components/transitions/ChannelSwitch";
import { MotionProvider } from "@/components/providers/MotionProvider";

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

export const metadata: Metadata = {
  title: "TAMIR.OS // Phi Vuong Tuong Tam",
  description:
    "Portfolio of Phi Vuong Tuong Tam (tamir39) — Computer Science student, game developer, builder. HCMC, Vietnam.",
  metadataBase: new URL("https://tamir39.vercel.app"),
  openGraph: {
    title: "TAMIR.OS",
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
    <html lang="en" className={`${orbitron.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg text-text antialiased">
        <MotionProvider>
          <Vignette />
          <ScanlineOverlay />
          <CrtNoise />
          <HudFrame />
          <Nav />
          <ChannelSwitch />
          <HudCursor />
          <div className="relative z-[1] flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
