// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Főoldal</h2>
      <p>Üdvözlünk a Keddi Foci App-ben!</p>
      <nav>
        <Link to="/register">Regisztráció</Link> |{" "}
        <Link to="/login">Bejelentkezés</Link>
      </nav>
    </div>
  );
}

export default Home;
