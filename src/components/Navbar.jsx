// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { FaHome, FaCalendarAlt, FaUser, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { auth } from "../firebaseConfig";
import { Navbar, Nav, Container } from "react-bootstrap";

function CustomNavbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Kijelentkezési hiba:", err);
    }
  };

  return (
    <Navbar style={styles.navbar} bg="dark" variant="dark" expand="lg">
      <Container style={styles.container}>
        <Nav className="w-100 justify-content-around" style={styles.navList}>
          <Nav.Link as={Link} to="/dashboard" style={styles.navLink}>
            <FaHome style={styles.icon} />
          </Nav.Link>
          <Nav.Link as={Link} to="/events" style={styles.navLink}>
            <FaCalendarAlt style={styles.icon} />
          </Nav.Link>
          <Nav.Link as={Link} to="/profile" style={styles.navLink}>
            <FaUser style={styles.icon} />
          </Nav.Link>
          <Nav.Link as={Link} to="/statistics" style={styles.navLink}>
            <FaChartBar style={styles.icon} />
          </Nav.Link>
          <Nav.Link onClick={handleLogout} style={styles.navLink}>
            <FaSignOutAlt style={styles.icon} />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

const styles = {
  navbar: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: "24px 24px",
    borderRadius: "16px 16px 0 0",  // csak a felső sarkok lekerekítése
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    margin: "0px auto",
    maxWidth: 640,
    zIndex: 10,
  },
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
  },
  navList: {
    // A bootstrap "w-100" és "justify-content-around" osztályok gondoskodnak az elrendezésről
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navLink: {
    padding: 0,
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#fff",
    fontSize: "1.8rem",  // nagyobb ikon méret
  },
};

export default CustomNavbar;
