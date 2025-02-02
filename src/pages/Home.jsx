// src/pages/Home.jsx
import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Container className="mt-4 text-center">
      <h2>Üdvözlünk a Keddi Foci App-ben!</h2>
      <p>Kérlek, válassz az alábbi lehetőségek közül:</p>
      <div>
        <Button variant="primary" as={Link} to="/login" className="me-2">
          Bejelentkezés
        </Button>
        <Button variant="secondary" as={Link} to="/register">
          Regisztráció
        </Button>
      </div>
    </Container>
  );
}

export default Home;
