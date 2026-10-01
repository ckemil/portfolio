import About from "@/components/About";
import ChatBot from "@/components/ChatBot";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Game from "@/components/Game";
import Hero from "@/components/Hero";
import MotionProvider from "@/components/MotionProvider";
import Nav from "@/components/Nav";
import Projects from "@/components/Projects";
import Radar from "@/components/Radar";
import Skills from "@/components/Skills";
import Stats from "@/components/Stats";
import { experience, profile, skills } from "@/data/resume";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${profile.siteUrl}/#person`,
      name: profile.name,
      alternateName: [profile.fullName, profile.handle],
      jobTitle: profile.title,
      description: profile.intro,
      url: profile.siteUrl,
      email: `mailto:${profile.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Abu Dhabi", addressCountry: "AE" },
      sameAs: [profile.linkedin],
      knowsAbout: skills.flatMap((s) => s.items),
      worksFor: { "@type": "Organization", name: experience[0].company },
    },
    {
      "@type": "WebSite",
      "@id": `${profile.siteUrl}/#website`,
      url: profile.siteUrl,
      name: profile.name,
      alternateName: [profile.fullName, profile.handle, "ckemil.com"],
      inLanguage: "en",
      publisher: { "@id": `${profile.siteUrl}/#person` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <MotionProvider>
        <Nav />
        <main>
          <Hero />
          <Stats />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Radar />
          <Game />
          <Education />
          <Contact />
        </main>
        <Footer />
        <ChatBot />
      </MotionProvider>
    </>
  );
}
