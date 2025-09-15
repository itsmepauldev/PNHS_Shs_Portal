// StudentLayout.jsx
import React from "react";
import StudentHeaderNav from "./StudentHeaderNav";

export default function StudentLayout({ children, user }) {
  return (
    <>
      {/* Top Navbar */}
      <StudentHeaderNav user={user} />

      {/* Page Content */}
      <div style={{ marginLeft: "0px", transition: "margin-left 0.3s ease-in-out" }}>
        {children}
      </div>
    </>
  );
}
