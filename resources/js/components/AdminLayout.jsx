// import React, { useEffect, useState } from 'react';
// import Sidebar from './Sidebar';
// import Header from './Header';

// export default function AdminLayout({ children }) {
//   const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
//   const [collapsed, setCollapsed] = useState(true);

//   useEffect(() => {
//     const updateSize = () => setIsLargeScreen(window.innerWidth >= 768);
//     window.addEventListener('resize', updateSize);
//     return () => window.removeEventListener('resize', updateSize);
//   }, []);

//   const toggleSidebar = () => setCollapsed(!collapsed);

//   return (
//     <>
//       <Header onToggleSidebar={toggleSidebar} />
//       <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
//       <div
//         className="pt-5 px-3"
//         style={{
//           marginLeft: isLargeScreen ? '250px' : '0px',
//           transition: 'margin-left 0.3s ease-in-out',
//         }}
//       >
//         {children}
//       </div>
//     </>
//   );
// }

import React from "react";
import HeaderNav from "./HeaderNav";

export default function AdminLayout({ children }) {
  return (
    <>
      <HeaderNav />
      <div >{children}</div>
    </>
  );
}

