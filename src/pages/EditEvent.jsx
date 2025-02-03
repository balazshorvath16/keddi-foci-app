// src/pages/EditEvent.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    location: "",
    eventDate: "",
    eventTime: "",
    maxCapacity: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Ellenőrizzük, hogy admin-e a felhasználó
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Itt célszerű lehet ellenőrizni a felhasználó szerepét, mielőtt folytatnánk
        const eventDocRef = doc(db, "events", id);
        const eventDoc = await getDoc(eventDocRef);
        if (eventDoc.exists()) {
          setEventData(eventDoc.data());
        } else {
          setMessage("Esemény nem található!");
        }
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // A módosítás után beállítjuk, hogy az esemény módosult
      await updateDoc(doc(db, "events", id), {
        ...eventData,
        modified: true
      });
      setMessage("Esemény frissítve!");
    } catch (err) {
      console.error("Hiba az esemény frissítése során:", err);
      setMessage("Hiba az esemény frissítése során!");
    }
  };

  const markAsCancelled = async () => {
    try {
      await updateDoc(doc(db, "events", id), {
        status: "elmarad",
        modified: true
      });
      setMessage("Esemény elmaradt!");
    } catch (err) {
      console.error("Hiba az esemény elmaradásának beállításakor:", err);
      setMessage("Hiba az esemény elmaradásának beállításakor!");
    }
  };

  return (
    <div>
      <h2>Esemény szerkesztése</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleUpdate}>
        <div>
          <label>Helyszín:</label>
          <input
            type="text"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Dátum:</label>
          <input
            type="date"
            value={eventData.eventDate}
            onChange={(e) => setEventData({ ...eventData, eventDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Idő:</label>
          <input
            type="time"
            value={eventData.eventTime}
            onChange={(e) => setEventData({ ...eventData, eventTime: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Max létszám:</label>
          <input
            type="number"
            value={eventData.maxCapacity}
            onChange={(e) => setEventData({ ...eventData, maxCapacity: e.target.value })}
            required
          />
        </div>
        <button type="submit">Mentés</button>
      </form>
      <hr />
      <button onClick={markAsCancelled} style={{ backgroundColor: "red", color: "#fff" }}>
        Esemény elmarad
      </button>
       <nav>
                <Link to="/events">Vissza</Link>
            </nav>
    </div>
  );
}

export default EditEvent;
