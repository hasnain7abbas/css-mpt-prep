import { ImageResponse } from "next/og";
import { EXAM, formatExamDate } from "@/lib/mpt";

export const alt = "CSS MPT Prep — clear the FPSC screening test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Kept Satori-safe: ASCII only (no emoji → no dynamic font fetch), every
// container with multiple children sets display:flex, and interpolated text is
// built with template literals — `a {b} c` compiles to several child nodes,
// which Satori rejects on a plain <div>.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#fbf9f4",
          color: "#12161c",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, letterSpacing: 4, fontFamily: "monospace", color: "#4d5560" }}>
            {`FPSC / MCQ-BASED PRELIMINARY TEST / ${EXAM.cycle.toUpperCase()}`}
          </div>
          <div style={{ height: 6, background: "#12161c", marginTop: 20, width: "100%" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }}>
            Two hundred questions stand between you and the CSS exam.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ fontSize: 30, fontFamily: "monospace", color: "#14563c" }}>
            {`${formatExamDate(EXAM.testDate)} / pass mark ${EXAM.passMarks} of ${EXAM.totalQuestions}`}
          </div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>CSS MPT Prep</div>
        </div>
      </div>
    ),
    size,
  );
}
