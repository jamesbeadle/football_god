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
import Fixtures from "./components/admin/fixtures/fixtures";
import Season from "./components/admin/seasons/season";
import UpdateFixture from "./components/admin/fixtures/update-fixture";
import Play from "./components/play";
import Balances from "./components/admin/balances";
import Payout from "./components/admin/payout";
import History from "./components/history";
import Leaderboard from "./components/leaderboard";
import Profile from "./components/profile/profile";
import Seasons from "./components/admin/seasons/seasons";
import ViewPrediction from "./components/view-prediction";
import CorrectPredictions from "./components/admin/fixtures/correct-predictions";

const PrivateWindowFallback = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h1>Please use a non-private window to access this app</h1>
    </div>
  );
};

const App = () => {

  const [isPrivateWindow, setIsPrivateWindow] = React.useState(false);

  React.useEffect(() => {
    if (window.indexedDB) {
      const request = window.indexedDB.open("TestDB");

      request.onerror = () => {
        setIsPrivateWindow(true);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        db.close(); // make sure the db is closed before deleting
        const deleteRequest = window.indexedDB.deleteDatabase("TestDB");
  
        deleteRequest.onerror = (event) => {
          console.error("Failed to delete TestDB", event);
        };
  
        deleteRequest.onsuccess = () => {
          //console.log("TestDB deleted successfully");
        };
      };
  

    } else {
      setIsPrivateWindow(true);
    }
  }, []);

  if (isPrivateWindow) {
    return (
      <PrivateWindowFallback />
    );
  }
 
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <MyNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/balances" element={<Balances />} />
            <Route path="/fixtures/:seasonId/:gameweekNumber" element={<Fixtures />} />
            <Route path="/payout" element={<Payout />} />
            <Route path="/seasons" element={<Seasons />} />
            <Route path="/season/:seasonId" element={<Season />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/update-fixture/:seasonId/:gameweekNumber/:fixtureId" element={<UpdateFixture />} />
            <Route path="/history" element={<History />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/game-rules" element={<Rules />} />
            <Route path="/play" element={<Play />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/view-prediction/:userId/:seasonId/:gameweekNumber" element={<ViewPrediction />} />
            <Route path="/correct-predictions/:seasonId/:gameweekNumber/:fixtureId" element={<CorrectPredictions />} />
          </Routes>
          <MyFooter />
        </div>
      </Router>   
  </AuthProvider>
  );
};

const root = document.getElementById("app");
createRoot(root).render(
    <App />
);
