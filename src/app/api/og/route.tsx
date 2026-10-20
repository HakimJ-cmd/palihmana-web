import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { sanitizeText } from "@/lib/sanitize";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = sanitizeText(searchParams.get("title") || "Palihmana.ID", 100);
    const pilar = sanitizeText(searchParams.get("pilar") || "Jurnalisme Solutif", 30).toUpperCase();

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0b1c30",
            padding: "60px 70px",
            color: "white",
            fontFamily: "sans-serif",
            border: "8px solid #0056b3",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 900,
                  color: "#0066cc",
                  letterSpacing: "1px",
                }}
              >
                PALIHMANA<span style={{ color: "#ffffff", fontWeight: 300 }}>.ID</span>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#0056b3",
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              {pilar}
            </div>
          </div>

          <div
            style={{
              fontSize: "48px",
              fontWeight: 800,
              lineHeight: 1.25,
              maxWidth: "1000px",
              color: "#ffffff",
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "2px solid rgba(255,255,255,0.15)",
              paddingTop: "24px",
              fontSize: "18px",
              color: "#94a3b8",
            }}
          >
            <div>Rumah Pengetahuan & Panduan Warga Tasikmalaya</div>
            <div style={{ color: "#38bdf8", fontWeight: 600 }}>palihmana.id</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response("Gagal membuat gambar OpenGraph", { status: 500 });
  }
}
