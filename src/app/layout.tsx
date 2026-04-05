import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://claude-code-quest.vercel.app"),
  title: "Claude Code Quest - AIディレクター育成RPG",
  description: "Webディレクターが冒険しながらClaude Codeを学ぶRPGゲーム。5分でCLI未経験からAIディレクターへ！",
  openGraph: {
    title: "Claude Code Quest - AIディレクター育成RPG",
    description: "Webディレクターが冒険しながらClaude Codeを学ぶRPGゲーム。5分でCLI未経験からAIディレクターへ！",
    siteName: "Claude Code Quest - AIディレクター育成RPG",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}<Analytics /></body>
    </html>
  );
}
