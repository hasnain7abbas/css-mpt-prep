import { ImageResponse } from "next/og";

export const alt = "FIA Job Prep — Prepare Smart, Get Selected";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Kept Satori-safe: ASCII only (no emoji → no dynamic font fetch) and every
// container with multiple children sets display:flex.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #064e3b 0%, #047857 55%, #10b981 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 38, fontWeight: 700, opacity: 0.9 }}>
          FIA Job Prep
        </div>
        <div style={{ fontSize: 74, fontWeight: 800, lineHeight: 1.1, marginTop: 28 }}>
          Crack Your FIA Jobs Exam With Confidence
        </div>
        <div style={{ fontSize: 30, marginTop: 30, opacity: 0.92 }}>
          250+ past-paper MCQs / Timed mocks / Progress tracking
        </div>
      </div>
    ),
    size,
  );
}
