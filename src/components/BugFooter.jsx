// src/components/BugFooter.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const BugFooter = () => {
  const version = "1.0.0";
  const currentDate = new Date().toLocaleDateString();

  return (
    <footer style={footerStyle}>
      <div style={{ textAlign: "center" }}>
        <p>Verzió: {version} | Dátum: {currentDate}</p>
        <Link to="/bug-report">
          <button style={buttonStyle}>Hibajelentés</button>
        </Link>
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: "#333",
  color: "#fff",
  padding: "20px",
  position: "relative",
  bottom: 0,
  width: "100%",
  borderRadius: "16px 16px 0 0",
  zIndex: 10
};

const buttonStyle = {
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer"
};

export default BugFooter;
