// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState({ fullName: "", birthDate: "", profilePic: "" });
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const updateData = {
      fullName: userData.fullName,
      birthDate: userData.birthDate,
    };

    try {
      await updateDoc(doc(db, "users", user.uid), updateData);
      setMessage("Profil frissítve!");
    } catch (err) {
      console.error("Hiba a profil frissítése során:", err);
      setMessage("Profil frissítési hiba");
    }
  };

  return (
    <div>
      <h2>Profil módosítása</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Email: </label>
          <span>{email}</span>
        </div>
        <div>
          <label>Teljes név:</label>
          <input
            type="text"
            value={userData.fullName}
            onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Születési dátum:</label>
          <input
            type="date"
            value={userData.birthDate}
            onChange={(e) => setUserData({ ...userData, birthDate: e.target.value })}
            required
          />
        </div>
        <button type="submit">Profil frissítése</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Profile;
