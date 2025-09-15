import React from "react";
import TeacherHeaderNav from "./TeacherHeaderNav";

export default function TeacherLayout({ children }) {
  return (
    <>
      {/* Navbar */}
      <TeacherHeaderNav />

      {/* Page Content */}
      <div className="" style={{ marginLeft: "0px", transition: "margin-left 0.3s ease-in-out" }}>
      
        {children}
      </div>
    </>
  );
}
