// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserRole(data.role);
        }
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Kijelentkezési hiba:", err);
    }
  };

  return (
    <div className="main_container"> 
      <h2>Dashboard</h2>
      {user && <p>Üdvözlünk, {user.email}! ({userRole})</p>}
      <button onClick={() => navigate("/events")}>Események megtekintése</button>
      <button onClick={() => navigate("/profile")}>Profil</button>
      {userRole === "admin" && (
        <button onClick={() => navigate("/create-event")}>
          Esemény létrehozása
        </button>
      )}
      <button onClick={handleLogout}>Kijelentkezés</button>
    </div>
  );
}

export default Dashboard;
