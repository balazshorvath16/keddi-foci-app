// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

function Navbar() {
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
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}><Link to="/dashboard" style={styles.link}>Dashboard</Link></li>
        <li style={styles.navItem}><Link to="/events" style={styles.link}>Események</Link></li>
        <li style={styles.navItem}><Link to="/profile" style={styles.link}>Profil</Link></li>
        <li style={styles.navItem}><Link to="/statistics" style={styles.link}>Statisztikák</Link></li>
        <li style={styles.navItem}><button onClick={handleLogout} style={styles.logoutButton}>Kijelentkezés</button></li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#333",
    padding: "10px"
  },
  navList: {
    listStyle: "none",
    display: "flex",
    justifyContent: "space-around",
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: "0 10px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  logoutButton: {
    backgroundColor: "#555",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default Navbar;
