import React, { useState } from 'react';
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/NavBar.css';
import Logo from '../../assets/Logo.png';

const NavigationBar = () => {
  const { theme, toggleTheme, enableBrailleMode } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const isLoggedIn = !!localStorage.getItem('access');

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <BootstrapNavbar
      expand="lg"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      className="custom-water-navbar shadow-sm py-2"
    >
      <Container fluid className="px-3">
        {/* Logo + Brand Name */}
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 text-white">
          <img
            src={Logo}
            alt="ABLEVATE Logo"
            style={{ height: '40px', width: 'auto' }}
            className="d-inline-block align-top"
          />
          <span className="fw-bold text-uppercase" style={{ fontSize: '18px' }}>
            ABLEVATE
          </span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="main-navbar" />

        <BootstrapNavbar.Collapse id="main-navbar" className="justify-content-between">
          {/* Left Nav Links */}
         <Nav className="me-auto gap-3" style={{ marginLeft: '6rem' }}>
              {isLoggedIn && role === 'admin' && (
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            )}
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            <Nav.Link as={Link} to="/privacy">Privacy</Nav.Link>
          </Nav>

          {/* Right: Theme, Accessibility, Auth */}
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <ButtonGroup>
              <Button
                variant="outline-light"
                onClick={toggleTheme}
                title="Toggle Light/Dark Theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </Button>
              <Button
                variant={theme === 'braille' ? 'success' : 'outline-light'}
                onClick={enableBrailleMode}
                title="Toggle Accessibility Mode"
              >
                ♿
              </Button>
            </ButtonGroup>

            {!isLoggedIn ? (
              <Link to="/login" className="btn btn-outline-light btn-sm">
                Login
              </Link>
            ) : (
              <Button
                onClick={logout}
                variant="outline-danger"
                size="sm"
                title="Log out of your account"
              >
                Logout
              </Button>
            )}
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default NavigationBar;
