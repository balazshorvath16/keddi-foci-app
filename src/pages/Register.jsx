// src/pages/Register.jsx
import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError("A jelszavak nem egyeznek!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        fullName: fullName,
        birthDate: birthDate,
        role: "user",
        participationCount: 0,
        level: "Új játékos"
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="main_container">
      <div className="main_form">
      <h2>Regisztráció</h2>
      <form onSubmit={handleRegister} className="form_style">
        <input
          type="email"
          placeholder="Email cím"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Teljes név"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <br />
        <input
          type="date"
          placeholder="Születési dátum"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Jelszó megerősítése"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />
        <br />
        <button type="submit">Regisztráció</button>
      </form>
      <Link to="/login">Már van fiókom, bejelentkezek</Link>
      {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Register;
