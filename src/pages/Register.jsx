// src/pages/Register.jsx
import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [profileOption, setProfileOption] = useState("default"); // "default" vagy "custom"
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const defaultProfilePic = "/assets/default-profile.png";
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError("A jelszavak nem egyeznek!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      let profilePicURL = defaultProfilePic; // alapértelmezett kép

      if (profileOption === "custom" && file) {
        // Itt add hozzá a Firebase Storage feltöltési logikát, például:
        const storage = getStorage();
        const storageRef = ref(storage, `profilePics/${user.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        profilePicURL = await getDownloadURL(storageRef);
      }
      
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        fullName: fullName,
        birthDate: birthDate,
        role: "user",
        profilePic: profilePicURL
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
      <h2>Regisztráció</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
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
        <label>Profilkép beállítása:</label>
        <select value={profileOption} onChange={(e) => setProfileOption(e.target.value)}>
          <option value="default">Alapértelmezett kép</option>
          <option value="custom">Saját kép feltöltése</option>
        </select>
        <br />
        {profileOption === "custom" && (
          <>
            <label>Válaszd ki a képet:</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
            <br />
          </>
        )}
        <button type="submit">Regisztráció</button>
      </form>
    </div>
  );
}

export default Register;
