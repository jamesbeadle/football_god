import * as React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./contexts/AuthContext";

import MyNavbar from './components/shared/navbar';
import MyFooter from './components/shared/footer';
import Home from "./components/home";
import Rules from "./components/rules";
import Admin from "./components/admin/admin";
import Teams from "./components/admin/teams/teams";
import Fixtures from "./components/admin/fixtures";
import Season from "./components/admin/season";
import UpdateFixture from "./components/admin/update-fixture";
import Play from "./components/play";
import Balances from "./components/admin/balances";
import Payout from "./components/admin/payout";
import History from "./components/history";
import Leaderboard from "./components/leaderboard";
import Profile from "./components/profile";
import Submission from "./components/submission";

const App = () => {
 
  return (
      <Router>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <MyNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/balances" element={<Balances />} />
            <Route path="/fixtures/:seasonId/:gameweekNumber" element={<Fixtures />} />
            <Route path="/payout" element={<Payout />} />
            <Route path="/season/:seasonId" element={<Season />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/update-fixture/:seasonId/:gameweekNumber/:fixtureId" element={<UpdateFixture />} />
            <Route path="/history" element={<History />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/game-rules" element={<Rules />} />
            <Route path="/play" element={<Play />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/submission" element={<Submission />} />
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
