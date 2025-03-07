// src/pages/Login.jsx
import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { setDoc, doc, getDoc } from "firebase/firestore";
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
  
        // Itt építsük be a Firestore frissítési logikát:
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          // Új felhasználó: teljes regisztráció
          await setDoc(userDocRef, {
            email: user.email,
            fullName: user.displayName,
            profilePic: user.photoURL,
            role: "user",
            // egyéb mezők, pl. birthDate, participationCount, stb.
          });
        } else {
          // Már létezik: csak frissítjük a változó mezőket, de nem írjuk felül a role-t
          await setDoc(userDocRef, {
            email: user.email,
            fullName: user.displayName,
            profilePic: user.photoURL,
          }, { merge: true });
        }
  
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
        <div style={{display: "flex", flexDirection: "row",alignItems: "center"}}>
        
        <input
        style={{width: "10%"}}
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        <label style={{textAlign: "left", width: "90%"}}>Maradjak bejelentkezve</label> 
        </div>
        
        <button type="submit">Bejelentkezés</button>
      </form>
      <br />
      <Link to="/register">Még nincs fiókom, regisztrálok</Link>
      <hr />
      <button onClick={handleGoogleSignIn}>Bejelentkezés Google fiókkal</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
