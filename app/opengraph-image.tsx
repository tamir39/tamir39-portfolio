import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TAMIR.OS — portfolio of Phi Vuong Tuong Tam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          fontFamily: "monospace",
          color: "#E6F4FF",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(0,229,255,0.06) 0 1px, transparent 1px 4px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            color: "#00E5FF",
            fontSize: 16,
            letterSpacing: 4,
          }}
        >
          TAMIR.OS v1.0
        </div>
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 40,
            color: "#7A8A99",
            fontSize: 16,
            letterSpacing: 4,
          }}
        >
          // CHANNEL_MAIN_00
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: "#00E5FF", fontSize: 22, letterSpacing: 6 }}>
            // OPERATOR
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "sans-serif",
              fontWeight: 700,
              fontSize: 96,
              letterSpacing: 2,
              lineHeight: 1.05,
              color: "#E6F4FF",
            }}
          >
            <div>PHI VUONG</div>
            <div>TUONG TAM</div>
          </div>
          <div style={{ color: "#7A8A99", fontSize: 26, letterSpacing: 3 }}>
            tamir39 · computer science · game dev · builder
          </div>
          <div
            style={{
              width: 220,
              height: 2,
              background: "linear-gradient(to right, #00E5FF, #8B5CF6)",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            color: "#7A8A99",
            fontSize: 14,
            letterSpacing: 4,
          }}
        >
          // LAT 10.78°N · LON 106.66°E · HCMC, VIETNAM
        </div>
      </div>
    ),
    { ...size },
  );
}
