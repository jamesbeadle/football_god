import React, { useState, useContext  } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Actor } from "@dfinity/agent";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { football_god_backend as football_god_backend_actor } from '../../../../declarations/football_god_backend';

const MyNavbar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const authClient = useContext(AuthContext);

  const handleConnect = async () => {

    await authClient.login({
      identityProvider: process.env.II_URL,
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
        const userIsAdmin = await football_god_backend_actor.isAdmin();
        setIsAdmin(userIsAdmin);
        setIsConnected(true);
      }
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsAdmin(false);
    authClient.logout();
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand  as={Link} to="/">Football God</Navbar.Brand>
      <Nav className="ml-auto">
        {isConnected ? (
          <>
            {isAdmin && <Nav.Link as={Link} to="/admin">Admin</Nav.Link>}
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
