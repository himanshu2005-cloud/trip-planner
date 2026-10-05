import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-[#1c1c23] bg-[#08080a] py-14 px-6 sm:px-12 text-[#9e9a91]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <Logo size="md" />
          <p className="font-serif italic text-xs text-[#5c5851] max-w-sm mt-1">
            An intelligent trip planner and algorithmic routing engine designed for exploring India with zero dead mileage.
          </p>
        </div>

        {/* Centered navigation links */}
        <div className="flex flex-wrap items-center gap-8 font-mono text-[11px] tracking-wider uppercase text-[#9e9a91]">
          <Link to="/" className="hover:text-[#f5f2eb] transition-colors">
            HOME
          </Link>
          <Link to="/explore" className="hover:text-[#f5f2eb] transition-colors">
            EXPLORE INDIA
          </Link>
          <Link to="/plan" className="hover:text-[#f5f2eb] transition-colors">
            PLAN ITINERARY
          </Link>
          <Link to="/trips" className="hover:text-[#f5f2eb] transition-colors">
            MY SAVED TRIPS
          </Link>
          <a
            href="https://github.com/himanshu2005-cloud/trip-planner"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#f5f2eb] transition-colors"
          >
            SOURCE
          </a>
        </div>

        <div className="flex flex-col items-start md:items-end font-mono text-[10px] text-[#5c5851] tracking-wider uppercase">
          <span>© {new Date().getFullYear()} TRIPPILOT · INDIA EDITION</span>
          <span className="text-[#32323e] mt-1">ALL DESTINATIONS CURATED</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
