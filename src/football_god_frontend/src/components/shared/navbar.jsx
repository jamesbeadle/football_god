import React, { useState, useEffect } from "react";
import { HttpAgent, Actor } from "@dfinity/agent";

import { AuthClient } from "@dfinity/auth-client";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';

const MyNavbar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [actor, setActor] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleConnect = async () => {
    let authClient = await AuthClient.create();

    await new Promise((resolve) => {
        authClient.login({
            identityProvider: process.env.II_URL,
            onSuccess: resolve,
        });
    });

    const identity = authClient.getIdentity();
    Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);

    const userIsAdmin = await football_god_backend_actor.isAdmin();
    setIsAdmin(userIsAdmin);

    setIsConnected(true);
    setActor(actor);
    setAuthClient(authClient);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsAdmin(false);
    setActor(null);
  };

  useEffect(() => {
    const initAuthClient = async () => {
      const authClient = await AuthClient.create();
      setAuthClient(authClient);
    };
    initAuthClient();
  }, []);

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand href="/">Football God</Navbar.Brand>
      <Nav className="ml-auto">
        {isConnected ? (
          <>
            {isAdmin && <Nav.Link href="/admin">Admin</Nav.Link>}
            <Nav.Link href="#history">History</Nav.Link>
            <NavDropdown title="My Account" id="basic-nav-dropdown" alignRight>
              <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <Button onClick={handleDisconnect}>Disconnect</Button>
            </NavDropdown>
          </>
        ) : (
          <Button onClick={handleConnect}>Connect</Button>
        )}
      </Nav>
    </Navbar>
  );
};

export default MyNavbar;
