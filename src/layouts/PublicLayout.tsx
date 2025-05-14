import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
