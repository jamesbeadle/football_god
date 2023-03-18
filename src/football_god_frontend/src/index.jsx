import * as React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { defaultProviders } from "@connect2ic/core/providers"
import { createClient } from "@connect2ic/core"
import { ConnectButton, ConnectDialog, Connect2ICProvider, useConnect } from "@connect2ic/react"

import style from "@connect2ic/core/style.css";
console.log(style);

/* Not working:
import "@connect2ic/core/style.css"
*/


import { football_god_backend } from "../../declarations/football_god_backend";
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './components/shared/navbar';
import MyFooter from './components/shared/footer';
import Home from "./components/home";
import Rules from "./components/rules";


const client = createClient({
  canisters: {  },
  providers: defaultProviders
})

const App = () => {
  const [name, setName] = React.useState('');
  const [message, setMessage] = React.useState('');

  async function doGreet() {
    const greeting = await football_god_backend.greet(name);
    setMessage(greeting);
  }

  return (
      <Router>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <MyNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game-rules" element={<Rules />} />
          </Routes>
          <MyFooter />
        </div>
      </Router>   
  );
};

const root = document.getElementById("app");
createRoot(root).render(
  <Connect2ICProvider client={client}>
    <ConnectDialog />
    <App />
  </Connect2ICProvider>  );
