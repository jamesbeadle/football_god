import React, { useState } from 'react';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { ConnectButton, ConnectDialog, Connect2ICProvider, useConnect } from "@connect2ic/react"
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

  const handleConnect = () => {
    // Implement your connection logic here
    // After a successful connection, set isConnected to true
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    // Implement your disconnection logic here
    // After a successful disconnection, set isConnected to false
    setIsConnected(false);
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand href="/">Football God</Navbar.Brand>
      <Nav className="ml-auto">
        {isConnected ? (
          <>
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
