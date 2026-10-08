import { ImageResponse } from "next/og";
import { currentRole } from "@/lib/data/profile";

export const alt = `Tamir — Thoughtful design. Playful code. Frontend & UI/UX at ${currentRole.company}.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", background: "#f8f7f2", color: "#282923", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 }}><span style={{ fontSize: 40, fontWeight: 700 }}>Tamir</span><span>UI/UX & Frontend</span></div>
    <div style={{ display: "flex", flexDirection: "column", fontSize: 90, fontWeight: 700, letterSpacing: -5, lineHeight: 1.1 }}><span>Thoughtful design.</span><span style={{ color: "#334bd3" }}>Playful code.</span></div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#64645c" }}><span>Phi Vuong Tuong Tam</span><span>Frontend & UI/UX at {currentRole.company}</span></div>
  </div>, size);
}
