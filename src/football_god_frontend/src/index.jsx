import * as React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './components/shared/navbar';
import MyFooter from './components/shared/footer';
import Home from "./components/home";
import Rules from "./components/rules";
import Admin from "./components/admin/admin";
import Seasons from "./components/admin/seasons - delete";
import Teams from "./components/admin/teams";
import Fixtures from "./components/admin/fixtures - delete";
import SystemState from "./components/admin/system-state";

import { AuthProvider } from "./contexts/AuthContext";
import Play from "./components/play";

const App = () => {
 
  return (
      <Router>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <MyNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/seasons" element={<Seasons />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/system-state" element={<SystemState />} />
            <Route path="/play" element={<Play />} />
            <Route path="/game-rules" element={<Rules />} />
          </Routes>
          <MyFooter />
        </div>
      </Router>   
  );
};

const root = document.getElementById("app");
createRoot(root).render(
  <AuthProvider>
    <App />
  </AuthProvider>);
