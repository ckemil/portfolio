import About from "@/components/About";
import ChatBot from "@/components/ChatBot";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Game from "@/components/Game";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Projects from "@/components/Projects";
import Radar from "@/components/Radar";
import Skills from "@/components/Skills";
import Stats from "@/components/Stats";
import Terminal from "@/components/Terminal";

export default function Home() {
  return (
    <>
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
      <Terminal />
      <ChatBot />
    </>
  );
}
