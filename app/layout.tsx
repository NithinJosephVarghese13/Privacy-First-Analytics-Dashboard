import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
