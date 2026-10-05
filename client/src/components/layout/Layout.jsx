import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary selection:bg-purple-600 selection:text-white">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
