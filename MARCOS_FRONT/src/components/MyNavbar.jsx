import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from "../assets/logo.png";
import { useAuth } from "../hooks/useAuth";

function MyNavbar() {
  const { isAuthenticated } = useAuth(); 
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarStyle = {
    transition: "background-color 0.4s ease, box-shadow 0.4s ease",
    backgroundColor: scrolled ? "#fff1dc" : "transparent",
    boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.1)" : "none",
    borderBottom: scrolled ? "1px solid #f3e2c8" : "none",
  };

  const baseLinkStyle = {
    color: "black",
    fontWeight: "500",
    padding: "5px 10px",
    borderRadius: "5px",
    transition: "color 0.3s ease, background-color 0.3s ease"
  };

  const dropdownTitleStyle = {
    color: "black",
  };

  const getLinkStyle = (name) => {
    if (hoveredLink === name) {
      return { ...baseLinkStyle, color: "#ff6f3c", backgroundColor: "#fff2e6" };
    }
    return baseLinkStyle;
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={navbarStyle}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      className="py-3"
    >
      <Container fluid>
        <Navbar.Brand
          className="d-flex align-items-center fs-3 fw-semibold"
          as={Link}
          to="/Inicio"
          onClick={() => setExpanded(false)}
          style={{ color: "black" }}
        >
          <img
            src={Logo}
            alt="Logo"
            width="55"
            height="60"
            className="d-inline-block align-top me-2"
          />
          D'Julia
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link
              as={Link}
              to="/Inicio"
              style={getLinkStyle("Inicio")}
              className="fs-5"
              onClick={() => setExpanded(false)}
              onMouseEnter={() => setHoveredLink("Inicio")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Inicio
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/Nosotros"
              style={getLinkStyle("Nosotros")}
              className="fs-5"
              onClick={() => setExpanded(false)}
              onMouseEnter={() => setHoveredLink("Nosotros")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Nosotros
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/Tienda"
              style={getLinkStyle("Tienda")}
              className="fs-5"
              onClick={() => setExpanded(false)}
              onMouseEnter={() => setHoveredLink("Tienda")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Tienda
            </Nav.Link>

            <NavDropdown
              title={<span style={dropdownTitleStyle}>Experiencia</span>}
              id="exp-dropdown"
              className="fs-5"
              menuVariant="light"
            >
              <NavDropdown.Item
                as={Link}
                to="/Testimonios"
                style={getLinkStyle("Testimonios")}
                onClick={() => setExpanded(false)}
                onMouseEnter={() => setHoveredLink("Testimonios")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Testimonios
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/Galeria"
                style={getLinkStyle("Galeria")}
                onClick={() => setExpanded(false)}
                onMouseEnter={() => setHoveredLink("Galeria")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Galería
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title={<span style={dropdownTitleStyle}>Encuéntranos</span>}
              id="find-dropdown"
              className="fs-5"
              menuVariant="light"
            >
              <NavDropdown.Item
                as={Link}
                to="/Locales"
                style={getLinkStyle("Locales")}
                onClick={() => setExpanded(false)}
                onMouseEnter={() => setHoveredLink("Locales")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Locales
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/Contactanos"
                style={getLinkStyle("Contactanos")}
                onClick={() => setExpanded(false)}
                onMouseEnter={() => setHoveredLink("Contactanos")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Contáctanos
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              as={Link}
              to={isAuthenticated ? "/profile" : "/login"}
              onClick={() => setExpanded(false)}
              className="d-flex align-items-center"
            >
              <img
                src="src/assets/user.png"
                alt="Usuario"
                width="35"
                height="35"
                className="rounded-circle border border-dark ms-lg-3"
                style={{ borderColor: "black" }}
              />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;