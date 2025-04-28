"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import MenuOverlay from "../../components/navBar/MenuOverlay";
import Footer from "../../components/footer/Footer";
import ParticlesComponent from "../../components/particles/particlesreact";
import { supabase } from "../../lib/supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "Profile", path: "./profile" },
];

const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible,
};

const Dashboard = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) {
        toast.error("Failed to fetch user data");
      } else {
        setUser(userData.user);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("email");
      toast.success("Logout successful!");
      setTimeout(() => {
        window.location.href = "../../auth/login";
      }, 1500);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#121212] overflow-x-hidden relative">
      <ToastContainer />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-20 w-full bg-[#121212] border-b-2 border-slate-700"
      >
        <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-3 md:py-4">
          <Link href="/" className="text-2xl font-bold text-white">
            <motion.span
              variants={itemVariants}
              className="hover:border-2 hover:border-blue-700 border-dashed transition-all"
            >
              <span className="text-blue-600">&lt;</span>NextMusicPlayer
              <span className="text-blue-600">/&gt;</span>
            </motion.span>
          </Link>

          <div className="block md:hidden">
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="flex items-center p-2 border border-slate-300 text-slate-300 rounded hover:text-white hover:border-white"
            >
              {navbarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>

          <motion.div
            variants={itemVariants}
            className="hidden md:flex items-center"
          >
            <ul className="flex flex-col md:flex-row md:space-x-8 items-center text-sm font-medium">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.path} className="text-white hover:text-blue-400">
                    {link.title}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="mt-3 md:mt-0 bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-5 rounded-lg shadow hover:scale-105 transition"
                >
                  Logout
                </button>
              </li>
            </ul>
          </motion.div>
        </div>

        {navbarOpen && (
          <div className="md:hidden">
            <MenuOverlay links={navLinks} closeOverlay={() => setNavbarOpen(false)} />
          </div>
        )}
      </motion.nav>

      {/* Content */}
      <div className="flex flex-grow items-center justify-center pt-24 md:pt-28 container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 1.3 }}
          variants={{
            visible: { opacity: 1, scale: 1 },
            hidden: { opacity: 0, scale: 0 },
          }}
          className="flex flex-col w-full max-w-md bg-[#18191E] border-2 border-[#33353F] shadow-md rounded-2xl p-6"
        >
          <div className="flex-grow flex flex-col justify-between">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold mb-6 text-blue-500">
                Dashboard
              </h1>
              {user ? (
                <>
                  <p className="text-lg text-white mb-4">
                    Welcome, {user.email}
                  </p>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
                    <button
                      onClick={() => window.location.href = './profile'}
                      className="bg-slate-800 py-2 px-5 text-sm text-white rounded-md shadow hover:bg-slate-700 transition"
                    >
                      Go to Profile
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-red-500">Loading user data...</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Particles Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <ParticlesComponent id="particles" />
      </div>
    </main>
  );
};

export default Dashboard;
