import React from "react";
import AdviserHeaderNav from "./AdviserHeaderNav";

export default function AdviserLayout({ children }) {
  return (
    <>
      {/* Navbar */}
      <AdviserHeaderNav />

      {/* Page Content */}
      <div
        className="pt-5 px-3"
        style={{ transition: "margin-left 0.3s ease-in-out" }}
      >
        {children}
      </div>
    </>
  );
}
