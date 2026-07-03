import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Form & Frame — Luxury Creative Agency",
  description:
    "A luxury creative agency crafting UI/UX design, cinema & post-production, and next-generation development.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen bg-charcoal-950 font-sans text-off-white antialiased">
        <div className="noise-bg" />
        {children}
      </body>
    </html>
  );
}
