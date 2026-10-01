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

const title = `${profile.name} — ${profile.title}`;
const description = `${profile.title} in ${profile.location} building Java microservices and cloud-native systems with Spring Boot, Kafka and Kubernetes.`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title,
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  keywords: [
    profile.name,
    profile.title,
    "Java Developer",
    "Spring Boot",
    "Spring Cloud",
    "Microservices",
    "Apache Kafka",
    "Kubernetes",
    "Docker",
    "Cloud-Native",
    "Abu Dhabi",
    "UAE",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: profile.name,
    locale: "en_US",
    type: "profile",
    firstName: profile.firstName,
    lastName: profile.name.split(" ").slice(1).join(" "),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
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
