import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0c0c0f] text-[#f5f2eb]">
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-[57px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
