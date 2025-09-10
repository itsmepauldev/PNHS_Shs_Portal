import React from "react";
import TeacherHeaderNav from "./TeacherHeaderNav"; // ✅ replace sidebar

export default function TeacherLayout({ children }) {
  return (
    <>
      {/* Transparent Red Navbar */}
      <TeacherHeaderNav />

      {/* Page Content */}
      <div className="pt-5 px-3">
        {children}
      </div>
    </>
  );
}
