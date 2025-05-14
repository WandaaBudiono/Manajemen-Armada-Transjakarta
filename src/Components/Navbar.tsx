import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div className="bg-base-100 shadow-lg border-b border-base-200">
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <Link
            to="/"
            className="text-xl font-bold text-primary hover:text-primary-focus"
          >
            Sistem Manajemen Armada
          </Link>
        </div>

        <div className="navbar-end"></div>
      </div>
    </div>
  );
};

export default Navbar;
