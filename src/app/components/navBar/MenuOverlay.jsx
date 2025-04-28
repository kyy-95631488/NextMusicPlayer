"use client";

import React from "react";
import NavLink from "./NavLink";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuOverlay = ({ links, closeOverlay }) => {
  const pathname = usePathname();

  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Check if it's the homepage
  const isHomePage = pathname === "/";

  // Determine the button label and href for the home page
  const homePageButtonLabel = isLoggedIn ? "Dashboard" : "Login";
  const homePageButtonHref = isLoggedIn ? "/panel/dashboard" : "/auth/login";

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/auth/login"; // Redirect to login page after logout
  };

  return (
    <ul className="flex flex-col items-end p-4 space-y-4">
      {links.map((link, index) => (
        <li key={index}>
          <NavLink href={link.path} title={link.title} />
        </li>
      ))}
      {isHomePage && (
        <li>
          <Link href={homePageButtonHref} onClick={closeOverlay}>
            <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
              {homePageButtonLabel}
            </button>
          </Link>
        </li>
      )}
      {(pathname === "/auth/login" || pathname === "/auth/register") && (
        <li>
          <Link href={pathname === "/auth/login" ? "/auth/register" : "/auth/login"} onClick={closeOverlay}>
            <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
              {pathname === "/auth/login" ? "Register" : "Login"}
            </button>
          </Link>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Logout
          </button>
        </li>
      )}
    </ul>
  );
};

export default MenuOverlay;
