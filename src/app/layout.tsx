import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
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

const title = `${profile.name} | ${profile.title}`;
const description = `Portfolio of ${profile.fullName}, ${profile.title} based in ${profile.location}. Specializing in Spring Boot, cloud-native microservices and distributed backends.`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title,
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  keywords: [
    profile.name,
    profile.fullName,
    profile.handle,
    profile.title,
    "ckemil.com",
    "Java Developer",
    "Spring Boot",
    "Spring Cloud",
    "Microservices",
    "Apache Kafka",
    "Docker",
    "Abu Dhabi",
    "UAE",
    "Senior Java Developer Abu Dhabi",
    "Backend Engineer Emirates Face Recognition",
  ],
  alternates: { canonical: profile.siteUrl },
  openGraph: {
    title,
    description,
    url: profile.siteUrl,
    siteName: profile.name,
    locale: "en_US",
    type: "profile",
    firstName: profile.firstName,
    lastName: profile.name.split(" ").slice(1).join(" "),
    username: profile.handle,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#131313",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden font-sans" suppressHydrationWarning>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
