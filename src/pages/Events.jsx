// src/pages/Events.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

function Events() {
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Felhasználó beállítása
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        navigate("/");
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  // Események lekérése
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Jelentkezés eseményre
  const joinEvent = async (event) => {
    if (!currentUser) return;
    const eventRef = doc(db, "events", event.id);
    try {
      if (event.participants.length < event.maxCapacity) {
        // Hozzáadjuk a felhasználót a résztvevők listájához
        await updateDoc(eventRef, {
          participants: arrayUnion(currentUser.uid)
        });
      } else {
        // Ha megtelt, hozzáadjuk a várólistához
        await updateDoc(eventRef, {
          waitlist: arrayUnion(currentUser.uid)
        });
      }
    } catch (err) {
      console.error("Hiba a jelentkezés során:", err);
    }
  };

  // Lemondás eseményről (résztvevő vagy várólista törlése)
  const cancelParticipation = async (event) => {
    if (!currentUser) return;
    const eventRef = doc(db, "events", event.id);
    try {
      if (event.participants.includes(currentUser.uid)) {
        await updateDoc(eventRef, {
          participants: arrayRemove(currentUser.uid)
        });
        // Itt később bevezethetünk logikát, hogy a várólista első tagját áthelyezzük a résztvevők közé
      }
      if (event.waitlist && event.waitlist.includes(currentUser.uid)) {
        await updateDoc(eventRef, {
          waitlist: arrayRemove(currentUser.uid)
        });
      }
    } catch (err) {
      console.error("Hiba a leiratkozás során:", err);
    }
  };

  if (loading) {
    return <div>Töltés...</div>;
  }

  return (
    <div>
      <h2>Események</h2>
      <button onClick={() => navigate("/dashboard")}>Vissza a Dashboardra</button>
      <ul>
        {events.map((event) => {
          const isParticipant = event.participants.includes(currentUser?.uid);
          const isInWaitlist = event.waitlist && event.waitlist.includes(currentUser?.uid);
          return (
            <li key={event.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
              <p><strong>Helyszín:</strong> {event.location}</p>
              <p><strong>Dátum:</strong> {event.eventDate}</p>
              <p><strong>Idő:</strong> {event.eventTime}</p>
              <p><strong>Max létszám:</strong> {event.maxCapacity}</p>
              <p><strong>Résztvevők száma:</strong> {event.participants.length}</p>
              {isParticipant || isInWaitlist ? (
                <button onClick={() => cancelParticipation(event)}>Lemondom</button>
              ) : (
                <button onClick={() => joinEvent(event)}>
                  {event.participants.length < event.maxCapacity ? "Jelentkezem" : "Jelentkezem várólistára"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Events;
