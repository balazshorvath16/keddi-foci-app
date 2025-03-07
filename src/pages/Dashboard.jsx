// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function Dashboard() {
  const version = "1.0.1";
  const currentDate = new Date().toLocaleDateString();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const buildRevolutPaymentUrl = (note = "Keddi foci") => {
    // Példa URL – ez csak illusztráció, a tényleges URL formátum Revolut dokumentációjától függ!
    return `https://revolut.me/balazshorvath16?note=${encodeURIComponent(note)}`;
  };

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

  const handlePaymentClick = () => {
    // Itt például beállíthatod az összeget és a megjegyzést
    const paymentUrl = buildRevolutPaymentUrl("10.00", "Fizetés a Keddi Foci App-en keresztül");
    window.location.href = paymentUrl;
  };

  return (
    <div className="main_container"> 
    <div className="footerStyle" style={footerStyle}>
      <p>Verzió: {version} | Dátum: {currentDate}</p>
      <Link to="/bug-report">
        <button style={buttonStyle}>Hibajelentés</button>
      </Link>
      <a
    href="https://github.com/sajat-projekt/bugfixek"
    target="_blank"
    rel="noopener noreferrer"
    style={{ marginLeft: '10px', textDecoration: 'none' }}
  >
    <button style={buttonStyle}>Frissítések megtekintése</button>
  </a>
    </div>
    <div style={{marginBottom: 80}}>
      <h2 style={{fontSize: 40}}>Kezdőlap</h2>
      {user && <p>Üdvözlünk, {user.displayName || user.email}! ({userRole})</p>}
      {/* <button onClick={() => navigate("/events")}>Események megtekintése</button>
      <button onClick={() => navigate("/profile")}>Profil</button> */}
      {userRole === "admin" && (
        <button onClick={() => navigate("/create-event")}>
          Esemény létrehozása
        </button>
      )}
       {userRole === "admin" && (
        <button onClick={() => navigate("/bug-reports")} style={{ marginBottom: "20px" }}>
          Hibajelentések megtekintése
        </button>
      )}
      {/* <button onClick={handleLogout}>Kijelentkezés</button> */}
      </div>
      <div className="fizetes_info">
        <h2>Fizetési információk</h2>
        <button onClick={handlePaymentClick}>
        Fizetés Revoluttal
        </button>
      </div>
    </div>
  );
}

const footerStyle = {
  backgroundColor: "#333",
  color: "#fff",
  padding: "20px",
  position: "relative",
  borderRadius: "16px 16px 16px 16px",
  zIndex: 10
};

const buttonStyle = {
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer"
};


export default Dashboard;
