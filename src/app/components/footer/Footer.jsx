import React from "react";

const Footer = () => {
  return (
    <footer className="footer border-t-[#33352F] border-x-transparent text-white">
      <div className="container p-4 sm:p-6 md:p-12 flex flex-col sm:flex-row justify-between items-center">
        <span className="text-xl font-semibold text-white animate-pulse mb-4 sm:mb-0">
          NextMusicPlayer
        </span>
        <p className="text-slate-600 text-center sm:text-left">
          Built with Next.js, all rights reserved{" "}
          <a
            className="text-slate-600 hover:text-secondary-600 animate-pulse"
            href="https://github.com/kyy-95631488"
          >
            Kyy{" "}
          </a>
          2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;
