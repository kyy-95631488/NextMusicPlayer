"use client";

import Link from "next/link"; 
import React, { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Image from "next/image";

// Define motion variants for animations
const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible,
};

const HeroSection = () => {
  const [trendingMusicBanners, setTrendingMusicBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch trending music data from YouTube API
  useEffect(() => {
    const fetchTrendingMusic = async () => {
      const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;  // Access the key from the environment variable

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=TopMusic2025&key=${YOUTUBE_API_KEY}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const banners = data.items.map(item => item.snippet.thumbnails.high.url);
          setTrendingMusicBanners(banners);
        } else {
          console.error("No videos found.");
        }
      } catch (error) {
        console.error("Error fetching music:", error);
      }
    };

    fetchTrendingMusic();
  }, []);

  // Automatically change banner every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % trendingMusicBanners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [trendingMusicBanners]);

  return (
    <motion.article
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 1 } }}
      variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
      className="md:py-0 md:pt-0 lg:pt-0 lg:py-0 sm:my-10 sm:py-10"
      id="home"
    >
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="col-span-8 place-self-center text-center sm:text-left justify-self-start">
          <motion.h1
            initial={{ x: "100%" }}
            animate={{ x: -4 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            transition={{ type: "spring", stiffness: 50 }}
            className="text-white mb-4 text-4xl sm:text-4xl md:text-5xl lg:text-7xl lg:leading-normal font-extrabold"
          >
            <motion.span
              variants={itemVariants}
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600"
            >
              Welcome to
            </motion.span>
            <br />
            <TypeAnimation
              className="sm:w-full"
              sequence={[
                "Next Music Player",
                800,
                "Your Ultimate Music Experience",
                800,
                "YouTube Music Player",
                800,
              ]}
              wrapper="span"
              speed={30}
              repeat={Infinity}
            />
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-[#ADB7BE] text-base sm:text-lg mb-6 lg:text-xl text-wrap lg:mr-20 md:mr-20 md:pr-20"
          >
            Stream your favorite tracks from YouTube, and more using our advanced player. Powered by YouTube API, YT-DLP, Supabase.
          </motion.p>
          <div>
            <a
              href="https://github.com/kyy-95631488"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                variants={itemVariants}
                className="px-6 py-3 w-full sm:w-fit rounded-full mr-4 hover:bg-slate-200 text-white bg-gradient-to-br from-primary-500 via-secondary-600 to-secondary-500"
              >
                Explore Music
              </motion.button>
            </a>
            <motion.button
              variants={itemVariants}
              className="px-1 py-1 w-full sm:w-fit rounded-full bg-transparent hover:bg-slate-800 text-white mt-3 bg-gradient-to-br from-primary-500 via-secondary-600 to-secondary-500"
            >
              <Link href="/" className="block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2">
                Learn More
              </Link>
            </motion.button>
          </div>
        </div>
        <div className="col-span-4 place-self-center mt-4 lg:mt-0 md:ml-20 hidden lg:block md:block">
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: -100, opacity: 1 }}
          exit={{ opacity: 1, transition: { duration: 10 } }}
          transition={{ type: "spring", stiffness: 30 }}
          className="rounded-full w-[700px] h-[700px] lg:w-[700px] lg:h-[700px] md:w-[600px] md:h-[600px] md:block lg:block relative"
        >
            {trendingMusicBanners.length > 0 ? (
              <motion.div
                key={currentIndex}  // Key to force re-render on index change
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-xl"
              >
                <Image
                  src={trendingMusicBanners[currentIndex]}
                  alt="Trending Music Banner"
                  width={700}  // Increased width
                  height={700} // Increased height
                />
              </motion.div>
            ) : (
              <div className="w-full h-full bg-gray-300 animate-pulse rounded-full"></div>
            )}
            <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary-900 to-transparent rounded-full w-[700px] h-[700px] lg:w-[700px] lg:h-[700px] z-1 blur-lg absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 animate-pulse"></div>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

export default HeroSection;