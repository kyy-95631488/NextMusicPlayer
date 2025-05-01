import React, { useState, useEffect } from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase"; // Assuming you have initialized Supabase
import { ArrowRightOnRectangleIcon, PowerIcon, UserCircleIcon } from "@heroicons/react/24/solid";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "Music Player", path: "/music-player" },
  { title: "Library", path: "#library" }
];

const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible,
};

const NavBar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playlistCount, setPlaylistCount] = useState(0);

  // Check if the user is logged in on component mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        fetchPlaylistCount(session.user.id); // Fetch playlist count when logged in
      } else {
        setIsLoggedIn(false);
      }
    };

    getSession();
  }, []);

  // Fetch the number of playlists for the logged-in user
  const fetchPlaylistCount = async (user_id) => {
    const { data, error } = await supabase
      .from("playlist")
      .select("id")
      .eq("user_id", user_id);

    if (error) {
      console.error("Error fetching playlists:", error);
    } else {
      setPlaylistCount(data.length); // Update the playlist count based on the user
    }
  };

  const handleLogout = () => {
    supabase.auth.signOut(); // Use Supabase logout method
    setIsLoggedIn(false);
    window.location.href = "/"; // Redirect to home after logging out
  };

  return (
    <motion.nav
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed mx-auto border-b-2 border-slate-700 top-0 left-0 right-0 z-10 bg-[#121212] bg-opacity-100 w-full"
    >
      <div className="flex container lg:py-2 flex-wrap items-center justify-between mx-auto px-4 py-1">
        <Link
          href={"/"}
          className="text-2xl md:text-1xl sm:text-1xl font-semibold text-white"
        >
          <motion.span
            variants={itemVariants}
            className="hover:border-4 transition-all ease-in-out delay-150 hover:border-dashed hover:border-blue-700"
          >
            <span className="text-blue-600">{"<"}</span> NextMusicPlayer
            <span className="text-blue-600">{" />"}</span>
          </motion.span>
        </Link>

        {/* Mobile Menu Button */}
        <div className="block md:hidden">
          {!navbarOpen ? (
            <button
              onClick={() => setNavbarOpen(true)}
              className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => setNavbarOpen(false)}
              className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Menu Items for larger screens */}
        <motion.div
          variants={itemVariants}
          className="hidden md:flex items-center"
          id="navbar"
        >
          <ul className="flex p-2 md:p-0 md:flex-row md:space-x-8 mt-0 items-center">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink href={link.path} title={link.title} />
              </li>
            ))}
            {isLoggedIn ? (
              <>
                <li>
                  <Link href="/panel/dashboard">
                    <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center">
                      <UserCircleIcon className="h-6 w-6" />
                    </button>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center"
                  >
                    <PowerIcon className="h-6 w-6" />
                  </button>
                </li>
                {/* Display Playlist Count */}
                <li className="text-sm text-gray-400">
                  Playlist Count: {playlistCount}
                </li>
              </>
            ) : (
              <li>
                <Link href="auth/login">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center">
                    <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay */}
      {navbarOpen && (
        <div className="md:hidden">
          <MenuOverlay
            links={navLinks}
            closeOverlay={() => setNavbarOpen(false)}
          />
        </div>
      )}
    </motion.nav>
  );
};

export default NavBar;
