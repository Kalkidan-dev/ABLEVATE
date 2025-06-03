import React, { useState } from 'react';
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';


const NavigationBar = () => {
  const { theme, toggleTheme, enableBrailleMode } = useTheme();
  const [expanded, setExpanded] = useState(false); // handle toggle state
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const isLoggedIn = !!localStorage.getItem('access');
const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('role');
    navigate('/login'); // or '/' if you prefer
  };


  return (
    <BootstrapNavbar
      expand="lg"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      bg={theme === 'light' ? 'primary' : theme === 'dark' ? 'dark' : 'secondary'}
      variant={theme === 'light' ? 'light' : 'dark'}
      className="px-3"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          ABLEVATE
        </BootstrapNavbar.Brand>

        {/* Toggle button for smaller screens */}
        <BootstrapNavbar.Toggle aria-controls="main-navbar" />

        {/* Collapsible content */}
        <BootstrapNavbar id="main-navbar" className="justify-content-between">
          <Nav className="me-auto">
            
            {isLoggedIn && role === 'admin' && (
          <Nav.Link as={Link} to="/register">Register</Nav.Link>
        )}
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            <Nav.Link as={Link} to="/privacy">Privacy</Nav.Link>
            
            <Nav>
        {!isLoggedIn ? (
          <>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
           
          </>
        ) : (
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        )}
      </Nav>
          </Nav>

          {/* Theme & Braille Toggle */}
          <ButtonGroup>
            <Button
              
              onClick={toggleTheme}
            >
              {theme === 'dark' ? '☀️ ' : '🌙 '}
            </Button>
            <Button
              variant={theme === 'braille' ? 'success' : 'outline-success'}
              onClick={enableBrailleMode}
            >
              ♿ 
            </Button>
          </ButtonGroup>
        </BootstrapNavbar>
      </Container>
    </BootstrapNavbar>
  );
};

export default NavigationBar;
