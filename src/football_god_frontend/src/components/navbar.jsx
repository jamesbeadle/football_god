import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';

const MyNavbar = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand href="#home">Football God</Navbar.Brand>
      <Nav className="ml-auto">
        <Button variant="outline-light">Connect</Button>
      </Nav>
    </Navbar>
  );
};

export default MyNavbar;
