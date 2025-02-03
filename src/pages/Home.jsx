// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="main_container">
      <div className="home_flex_container">
        <div>
          <img src="src/assets/img/keddi_foci_bg.jpg" alt="" />
        </div>
        <div>
          <h2>Gyerünk srácok,<br /> Andris már kint van a pályán! ⚽😎</h2>
          <p>Regisztráljatok, jelentkezzetek be, csekkoljátok a közelgő eseményeket, kövessétek a statisztikákat, és ami a legfontosabb, <b>csapassuk</b>!</p>
          <nav>
            <Link to="/register">Regisztráció</Link> |{" "}
            <Link to="/login">Bejelentkezés</Link>
          </nav>
        </div>
      </div>
      
    </div>
  );
}

export default Home;
