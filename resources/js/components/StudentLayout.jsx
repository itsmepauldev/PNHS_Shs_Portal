import React from "react";
import StudentHeaderNav from "./StudentHeaderNav"; // ✅ use header nav instead

export default function StudentLayout({ children }) {
  return (
    <>
      {/* Top Navbar */}
      <StudentHeaderNav />

      {/* Page Content */}
      <div className="pt-5 px-3">
        {children}
      </div>
    </>
  );
}
