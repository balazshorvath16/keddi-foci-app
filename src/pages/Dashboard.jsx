// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Ha nincs bejelentkezve, visszairányítjuk a Home oldalra
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
    <div>
      <h2>Dashboard</h2>
      {user && <p>Üdvözlünk, {user.email}!</p>}
      <button onClick={handleLogout}>Kijelentkezés</button>
      <div>
        <h3>Események</h3>
        {/* Itt majd megjelenik az események listája és a részletek */}
        <p>Itt jelennek meg az események.</p>
      </div>
    </div>
  );
}

export default Dashboard;
