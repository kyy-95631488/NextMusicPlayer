/* eslint-disable react/jsx-no-undef */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { Bars3Icon, XMarkIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "../../components/navBar/MenuOverlay";
import Footer from "../../components/footer/Footer";
import ParticlesComponent from "../../components/particles/particlesreact";
import { supabase } from "../../lib/supabase";
import "react-toastify/dist/ReactToastify.css";

const navLinks = [{ title: "Home", path: "/" }];
const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible,
};

const Register = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 2000); // 2 detik loading
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      toast.success("Registration successful! Please check your email for verification.");
      window.location.href = "./login";
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212]">
        <motion.div
          className="w-20 h-20 border-4 border-blue-500 border-dashed rounded-full animate-spin"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#121212] overflow-x-hidden relative">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed mx-auto border-b-2 border-slate-700 top-0 left-0 right-0 z-20 bg-[#121212] w-full"
      >
        <div className="flex container flex-wrap items-center justify-between mx-auto px-4 py-2">
          <Link href="/" className="text-2xl font-semibold text-white">
            <motion.span
              variants={itemVariants}
              className="hover:border-4 transition-all ease-in-out delay-150 hover:border-dashed hover:border-blue-700"
            >
              <span className="text-blue-600">{"<"}</span> Hendriansyah
              <span className="text-blue-600">{" />"}</span>
            </motion.span>
          </Link>

          <div className="block md:hidden">
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
            >
              {navbarOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>

          <motion.div variants={itemVariants} className="hidden md:flex items-center">
            <ul className="flex space-x-8 items-center">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.path} className="text-white">
                    {link.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="./login">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                    Login
                  </button>
                </Link>
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

      {/* Register Form */}
      <div className="flex justify-center items-center flex-grow container mx-auto px-4 py-8 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-xl w-96 transform transition-all duration-300 ease-in-out hover:scale-105"
        >
          <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">Register</h1>
          <form onSubmit={handleRegister}>
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm" htmlFor="email">
                Email
              </label>
              <motion.input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                whileFocus={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </div>

            {/* Password Input */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 mb-2 text-sm" htmlFor="password">
                Password
              </label>
              <motion.input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                whileFocus={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-600"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6 relative">
              <label className="block text-gray-700 mb-2 text-sm" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <motion.input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                whileFocus={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 text-gray-600"
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition-all duration-300 ease-in-out"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Register"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Particle Background */}
      <div id="particles" className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none">
        <ParticlesComponent id="particles" />
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </main>
  );
};

export default Register;
