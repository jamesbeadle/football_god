import React, { useState, useContext, useEffect  } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const MyNavbar = () => {
  const { isAdmin, isAuthenticated, login, logout } = useContext(AuthContext);

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">Football God</Navbar.Brand>
      <Nav className="ml-auto">
        {isAuthenticated ? (
          <>
            {isAdmin && <Nav.Link as={Link} to="/admin">Admin</Nav.Link>}
            <Nav.Link href="#history">History</Nav.Link>
            <NavDropdown title="My Account" id="basic-nav-dropdown" alignRight>
              <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>Disconnect</NavDropdown.Item>
            </NavDropdown>
          </>
        ) : (
          <Button onClick={login}>Connect</Button>
        )}
      </Nav>
    </Navbar>
  );
};

export default MyNavbar;
