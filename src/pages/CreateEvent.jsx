// src/pages/CreateEvent.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserRole(data.role);
          if (data.role !== "admin") {
            // Ha nem admin, vissza a Dashboardra
            navigate("/dashboard");
          }
        } else {
          navigate("/dashboard");
        }
        setLoading(false);
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!location || !eventDate || !eventTime || !maxCapacity) {
      setError("Minden mezőt tölts ki!");
      return;
    }
    try {
      await addDoc(collection(db, "events"), {
        location,
        eventDate,
        eventTime,
        maxCapacity: Number(maxCapacity),
        participants: [],
        waitlist: [],
        createdAt: serverTimestamp()
      });
      navigate("/events"); // Esemény létrehozása után az események listájára navigálunk
    } catch (err) {
      setError("Hiba az esemény létrehozása során: " + err.message);
    }
  };

  if (loading) {
    return <div>Töltés...</div>;
  }

  return (
    <div className="main_container">
      <h2>Esemény Létrehozása</h2>
      <form onSubmit={handleCreateEvent} className="form_style">
        <input 
          type="text" 
          placeholder="Helyszín" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          required 
        />
        <input 
          type="date" 
          placeholder="Dátum" 
          value={eventDate} 
          onChange={(e) => setEventDate(e.target.value)} 
          required 
        />
        <input 
          type="time" 
          placeholder="Idő" 
          value={eventTime} 
          onChange={(e) => setEventTime(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          placeholder="Max létszám" 
          value={maxCapacity} 
          onChange={(e) => setMaxCapacity(e.target.value)} 
          required 
        />
        <button type="submit">Esemény létrehozása</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default CreateEvent;
