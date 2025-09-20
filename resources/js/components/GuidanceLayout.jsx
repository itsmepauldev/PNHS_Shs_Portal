import React from "react";
import GuidanceHeaderNav from "./GuidanceHeaderNav";

export default function GuidanceLayout({ children }) {
  return (
    <>
      {/* Navbar */}
      <GuidanceHeaderNav />

      {/* Page Content */}
      <div
        className=""
        style={{ marginLeft: "0px", transition: "margin-left 0.3s ease-in-out" }}
      >
        {children}
      </div>
    </>
  );
}
