import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-[#0c0c0f] bg-[#fbf9f4] dark:text-[#f5f2eb] text-[#18181c] transition-colors duration-200">
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-[64px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
