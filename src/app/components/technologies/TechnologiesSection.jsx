import React from "react";
import HorizontalGallery from "../navBar/HorizontalGallery";
import { motion } from "framer-motion";

const TechnologiesSection = () => {
  const imagesArray = [
    {
      id: 1,
      url: "/icon/nextjs/nextjs-logo.svg",
      alt: "Next.js",
    },
    {
      id: 2,
      url: "/icon/tailwind/tailwind-logo.svg",
      alt: "Tailwind CSS",
    },
    {
      id: 3,
      url: "/icon/yt-api/yt-api-logo.svg",
      alt: "YouTube API",
    },
    {
      id: 4,
      url: "/icon/ytdl/ytdl-logo.svg",
      alt: "yt-dlp",
    },
    {
      id: 5,
      url: "/icon/supabase/supabase-icon.svg",
      alt: "Supabase",
    },
    // {
    //   id: 6,
    //   url: "/icon/soundcloud/soundcloud-logo.svg",
    //   alt: "SoundCloud",
    // },
    {
      id: 7,
      url: "/icon/javascript/JavaScript-logo.png",
      alt: "JavaScript",
    },
    {
      id: 8,
      url: "/icon/typescript/typescript.svg",
      alt: "TypeScript",
    }
  ];
    
  return (
    <main className="py-10 flex flex-col items-center overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-3xl font-bold mt-10 text-transparent bg-clip-text bg-white"
      >
        Technologies I&apos;m Using for NextMusicPlayer
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.6 }}
        className="border-b border-secondary-500 sm:flex-row items-center w-3/4"
      ></motion.div>
      <HorizontalGallery imageArray={imagesArray} />
    </main>
  );
};

export default TechnologiesSection;
