import React, { useState, useContext, useEffect  } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../../../assets/logo.png';

const MyNavbar = () => {
  const { isAdmin, isAuthenticated, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <Navbar className="custom-nav" expand="lg" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
      <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
        <img src={Logo} alt="footballgod" style={{ maxWidth: '200px', maxHeight: '100%' }} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          {isAuthenticated ? (
            <>
              {isAdmin && <Nav.Link as={Link} to="/admin" onClick={() => setExpanded(false)}>Admin</Nav.Link>}
              <Nav.Link as={Link} to="/history" onClick={() => setExpanded(false)}>History</Nav.Link>
              <NavDropdown title="My Account" id="basic-nav-dropdown" alignRight>
                <NavDropdown.Item as={Link} to="/profile" onClick={() => setExpanded(false)}>Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => {logout(); setExpanded(false);}}>Disconnect</NavDropdown.Item>
              </NavDropdown>
            </>
          ) : (
            <Button onClick={() => { login(); setExpanded(false); }}>Connect</Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNavbar;
