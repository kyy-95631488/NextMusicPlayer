"use client"
import { useState } from "react";
import HeroSection from "./components/hero/HeroSection";
import NavBar from "./components/navBar/NavBar";
import EmailSection from "./components/emailSection/EmailSection";
import Footer from "./components/footer/Footer";
import ParticlesComponent from "./components/particles/particlesreact";
import TechnologiesSection from "./components/technologies/TechnologiesSection";
import MusicListSection from "./components/musicSection/MusicListSection";

export default function Home() {
  const [playlist, setPlaylist] = useState([]);

  return (
    <main className="flex min-h-screen flex-col z-0 bg-[#121212] scrollbar-hide md:scrollbar-default overflow-x-hidden w-full ">
      <NavBar playlist={playlist} setPlaylist={setPlaylist} />
      <div className="container mt-24 mx-auto px-12 py-4">
        <HeroSection />
        <TechnologiesSection />
        <MusicListSection setPlaylist={setPlaylist} />
        <EmailSection />
      </div>
      <Footer />
      <div id="particles" className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <ParticlesComponent id="particles" />
      </div>
    </main>
  );
}
