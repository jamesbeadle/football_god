import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { ConnectButton, useConnect } from "@connect2ic/react"

const adminPrincipal = process.env.REACT_APP_ADMIN_PRINCIPAL;
const MyNavbar = () => {

  const { isConnected, principal, activeProvider } = useConnect({
    onConnect: () => {
      // Signed in
      console.log("signed in");
    },
    onDisconnect: () => {
      // Signed out
      console.log("signed out");
    }
  })

  
  useEffect(() => {
    if (principal) {
      console.log(`signed in as ${principal}`);
    }
  }, [principal]);

  const isAdmin = isConnected && principal === adminPrincipal;

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand href="/">Football God</Navbar.Brand>
      <Nav className="ml-auto">
        {isConnected ? (
          <>
            {isAdmin && <Nav.Link href="admin">Admin</Nav.Link>}
            <Nav.Link href="#history">History</Nav.Link>
            <NavDropdown title="My Account" id="basic-nav-dropdown" alignRight>
              <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <ConnectButton />
            </NavDropdown>
          </>
        ) : (
          <ConnectButton />
        )}
      </Nav>
    </Navbar>
  );
};

export default MyNavbar;
