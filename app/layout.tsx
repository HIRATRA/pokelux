import type React from "react";
import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { FavoritesProvider } from "@/hooks/use-favorites";
import PageTransition from "@/components/page-transition";
import { FooterWrapper } from "@/components/navigation/FooterWrapper";
import BackToTop from "@/components/navigation/back-to-top";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PokéLux",
  description: "A luxurious dark-mode Pokémon website with premium animations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${dmSans.style.fontFamily};
  --font-heading: ${spaceGrotesk.variable};
  --font-body: ${dmSans.variable};
}
        `}</style>
      </head>
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}
      >
        <BackToTop />
        <FavoritesProvider>
          <PageTransition>{children}</PageTransition>
        </FavoritesProvider>
        <FooterWrapper />
      </body>
    </html>
  );
}
