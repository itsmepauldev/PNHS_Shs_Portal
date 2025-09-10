import React from "react";
import AdviserHeaderNav from "./AdviserHeaderNav"; // ✅ use header nav instead of sidebar

export default function AdviserLayout({ children }) {
  return (
    <>
      {/* Transparent Red Navbar */}
      <AdviserHeaderNav />

      {/* Page Content */}
      <div className="pt-5 px-3">
        {children}
      </div>
    </>
  );
}
