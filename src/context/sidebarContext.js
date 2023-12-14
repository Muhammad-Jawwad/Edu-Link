// // SidebarContext.js
// import React, { createContext, useState, useContext } from 'react';

// const SidebarContext = createContext();

// export const SidebarProvider = ({ children }) => {
//     const [sidebarLoaded, setSidebarLoaded] = useState(false);

//     return (
//         <SidebarContext.Provider value={{ sidebarLoaded, setSidebarLoaded }}>
//             {children}
//         </SidebarContext.Provider>
//     );
// };

// export const useSidebar = () => {
//     return useContext(SidebarContext);
// };
