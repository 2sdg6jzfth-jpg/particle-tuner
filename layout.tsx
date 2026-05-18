import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Particle Tuner",
  description: "The fastest, most accurate way to tune your guitar.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0E18",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#050709]">
          <div
            className="relative w-full h-[100dvh] max-w-[420px] sm:max-w-[380px] sm:h-[760px] sm:rounded-[36px] overflow-hidden bg-bg-primary text-text font-sans"
            style={{ boxShadow: "inset 0 0 0 1px rgba(245,235,215,0.06)" }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
