import type { Metadata } from "next";
import { Anton, Space_Grotesk, Space_Mono } from "next/font/google";
import { profile } from "@/data/resume";
import "./globals.css";

// Open-source stand-ins from the design spec: Anton ≈ Manuka, Space Grotesk ≈ PolySans, Space Mono ≈ PolySans Mono
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
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
    <html
      lang="en"
      className={`${anton.variable} ${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
