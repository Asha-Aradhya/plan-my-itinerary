import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Plan My Itinerary — AI-Powered Travel Itinerary Generator";

const NAVY = "#0f1f3d";
const GOLD = "#c9a84c";
const CREAM = "#faf7f0";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: NAVY,
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            color: GOLD,
            fontWeight: 700,
            letterSpacing: "-8px",
            marginBottom: "40px",
          }}
        >
          <div style={{ fontSize: 200, lineHeight: 1 }}>P</div>
          <div style={{ fontSize: 144, lineHeight: 1 }}>M</div>
          <div style={{ fontSize: 144, lineHeight: 1 }}>I</div>
        </div>
        <div
          style={{
            display: "flex",
            color: CREAM,
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          Plan My Itinerary
        </div>
        <div
          style={{
            display: "flex",
            color: GOLD,
            fontSize: 38,
            fontFamily: "sans-serif",
            lineHeight: 1.3,
          }}
        >
          AI-Powered Travel Itinerary Generator
        </div>
      </div>
    ),
    { ...size },
  );
}
