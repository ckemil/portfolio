import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { profile } from "@/data/resume";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const description = `${profile.title} — ${profile.tagline}. ${profile.intro}`;

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title}`,
  description,
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full overflow-x-hidden font-sans" suppressHydrationWarning>
        <div className="noise" aria-hidden />
        {children}
      </body>
    </html>
  );
}
