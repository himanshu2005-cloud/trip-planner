import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

export const Footer = () => {
  return (
    <footer className="w-full border-t dark:border-[#1c1c23] border-[#e8e2d5] dark:bg-[#08080a] bg-[#f5f0e6] py-14 px-6 sm:px-12 dark:text-[#9e9a91] text-[#635f56] transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <Logo size="md" />
          <p className="font-serif italic text-xs dark:text-[#5c5851] text-[#857e72] max-w-sm mt-1">
            An intelligent trip planner and algorithmic routing engine designed for exploring India with zero dead mileage.
          </p>
        </div>

        {/* Centered navigation links */}
        <div className="flex flex-wrap items-center gap-8 font-mono text-[11px] tracking-wider uppercase dark:text-[#9e9a91] text-[#635f56]">
          <Link to="/" className="dark:hover:text-[#f5f2eb] hover:text-[#18181c] transition-colors">
            HOME
          </Link>
          <Link to="/explore" className="dark:hover:text-[#f5f2eb] hover:text-[#18181c] transition-colors">
            EXPLORE INDIA
          </Link>
          <Link to="/plan" className="dark:hover:text-[#f5f2eb] hover:text-[#18181c] transition-colors">
            PLAN ITINERARY
          </Link>
          <Link to="/trips" className="dark:hover:text-[#f5f2eb] hover:text-[#18181c] transition-colors">
            MY SAVED TRIPS
          </Link>
          <a
            href="https://github.com/himanshu2005-cloud/trip-planner"
            target="_blank"
            rel="noreferrer"
            className="dark:hover:text-[#f5f2eb] hover:text-[#18181c] transition-colors"
          >
            SOURCE
          </a>
        </div>

        <div className="flex flex-col items-start md:items-end font-mono text-[10px] dark:text-[#5c5851] text-[#857e72] tracking-wider uppercase">
          <span>© {new Date().getFullYear()} TRIPPILOT · INDIA EDITION</span>
          <span className="dark:text-[#32323e] text-[#b0a899] mt-1">ALL DESTINATIONS CURATED</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
