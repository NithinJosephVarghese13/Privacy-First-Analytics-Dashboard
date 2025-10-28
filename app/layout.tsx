import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import ConsentBanner from "@/components/ConsentBanner";

export const metadata: Metadata = {
  title: "Privacy-First Analytics Dashboard",
  description: "GDPR-compliant analytics platform with AI insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <Navbar />
          {children}
          <ConsentBanner />
        </Providers>
      </body>
    </html>
  );
}
