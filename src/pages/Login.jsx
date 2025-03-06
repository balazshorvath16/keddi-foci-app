// src/pages/Login.jsx
import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Állítsd be a persistence-t, hogy a felhasználó localStorage-ban maradjon bejelentkezve
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

    // Google bejelentkezés
    const handleGoogleSignIn = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
  
        // Ha a felhasználó dokumentum nem létezik, hozzuk létre
        await setDoc(
          doc(db, "users", user.uid),
          {
            email: user.email,
            fullName: user.displayName,
            profilePic: user.photoURL, // Google profilkép URL-je
            role: "user",
            // Egyéb mezők, pl. birthDate: "", participationCount: 0, stb.
          },
          { merge: true } // Merge-be állítjuk, ha már létezik a dokumentum
        );
        navigate("/dashboard");
      } catch (error) {
        setError(error.message);
      }
    };

  return (
    <div className="main_container">
      <div className="main_form">
      <h2>Bejelentkezés</h2>
      <form onSubmit={handleLogin} className="form_style">
        <input
          type="email"
          placeholder="Email cím"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        <label>Maradjak bejelentkezve</label>
        <br />
        <button type="submit">Bejelentkezés</button>
      </form>
      <Link to="/register">Még nincs fiókom, regisztrálok</Link>
      <hr />
      <button onClick={handleGoogleSignIn}>Bejelentkezés Google fiókkal</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
