// import React, { useEffect, useState } from "react";
// import { Route, Routes, useNavigate } from "react-router-dom";
// import Login from "./components/Login/Login";
// import Sidebar from "./components/dashboard/Sidebar";
// import useAuth from "./hooks/useAuth";
// import Table from "./components/Table";

// function App() {
//   const navigate = useNavigate();
//   const { hasPermission, pageFeatures } = useAuth();
//   const [login, setLogin] = useState<boolean>(false);

//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     return sessionStorage.getItem("token") !== null;
//   });

//   // useEffect(() => {
//   //   if (!isAuthenticated) {
//   //     navigate("/");
//   //   }
//   // }, [isAuthenticated, navigate]);

//   if (!isAuthenticated) {
//     return (
//       <Routes>
//         <Route path="/" element={<Login setIsAuthenticated={setLogin} />} />
//       </Routes>
//     );
//   }

//   return (
//     <div className="app-container">
//       <div className="main-layout">
//         <Sidebar hasPermission={hasPermission} pageFeatures={pageFeatures} />
//         <div className="page-content">
//           <Routes>
//               <Route path="/table" element={<Table hasPermission={hasPermission} />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;


// =======================================================================================


import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import useAuth from "./hooks/useAuth";
import { baseUrl } from "./shared/Fetch";

// Import all components (kept as-is)
import Dashboard from "./components/dashboard/Dashboard";
import Sidebar from "./components/dashboard/Sidebar";
import Login from "./components/Login/Login";
import { UserMast } from "./components/userMast/UserMast";
import { Page } from "./components/page";
import { Role } from "./components/role";
import Topbar from "./components/dashboard/Menubar";
import { Project } from "./components/Project";


function App() {
  const navigate = useNavigate();
  const { hasPermission, pageFeatures } = useAuth();

  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem("token") !== null);


  const loginData = sessionStorage.getItem("loginData");
  const parsedLoginData = loginData ? JSON.parse(loginData) : null;

  if (isAuthenticated) {
    return (
      <div className="main-container">
        <div className="menubar">
          <Topbar setIsAuthenticated={setIsAuthenticated} />
        </div>
        <div className="cont">
          <div className="sidebar">
            <Sidebar hasPermission={hasPermission} pageFeatures={pageFeatures} />
          </div>
          <div className="main-content">
            <Routes>
              (<Route path="dashboard" element={<Dashboard hasPermission={hasPermission} />} />)
              (<Route path="user" element={<UserMast hasPermission={hasPermission} />} />)
              <Route path="page" element={<Page hasPermission={hasPermission} />} />
              <Route path="role" element={<Role hasPermission={hasPermission} />} />
              <Route path="project" element={<Project hasPermission={hasPermission} />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
    </Routes>
  );
}

export default App;
