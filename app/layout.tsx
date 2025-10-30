import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import ConsentBanner from "@/components/ConsentBanner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: "Privacy-First Analytics Dashboard",
  description: "GDPR-compliant analytics platform with AI insights",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navbar />
            {children}
            <ConsentBanner />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
