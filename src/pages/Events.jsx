// src/pages/Events.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  runTransaction
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

function Events() {
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersMap, setUsersMap] = useState({});
  const [expandedEvents, setExpandedEvents] = useState({});
  const navigate = useNavigate();

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

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersObj = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        usersObj[doc.id] = data.fullName;
      });
      setUsersMap(usersObj);
    });
    return () => unsubscribeUsers();
  }, []);

  const joinEvent = async (event) => {
    if (!currentUser) return;
    const eventRef = doc(db, "events", event.id);
    try {
      if (event.participants.length < event.maxCapacity) {
        await updateDoc(eventRef, {
          participants: arrayUnion(currentUser.uid)
        });
      } else {
        await updateDoc(eventRef, {
          waitlist: arrayUnion(currentUser.uid)
        });
      }
    } catch (err) {
      console.error("Hiba a jelentkezés során:", err);
    }
  };

  const cancelParticipation = async (event) => {
    if (!currentUser) return;
    const eventRef = doc(db, "events", event.id);
    try {
      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) throw "Az esemény nem található!";
        const eventData = eventDoc.data();
        let updatedParticipants = eventData.participants.filter(
          (uid) => uid !== currentUser.uid
        );
        let updatedWaitlist = eventData.waitlist
          ? eventData.waitlist.filter((uid) => uid !== currentUser.uid)
          : [];
        if (
          eventData.participants.includes(currentUser.uid) &&
          updatedWaitlist.length > 0
        ) {
          const promotedUser = updatedWaitlist.shift();
          updatedParticipants.push(promotedUser);
        }
        transaction.update(eventRef, {
          participants: updatedParticipants,
          waitlist: updatedWaitlist
        });
      });
    } catch (err) {
      console.error("Hiba a leiratkozás során:", err);
    }
  };

  if (loading) {
    return <div>Töltés...</div>;
  }

  return (
    <div className="main_container">
      <h2>Események</h2>
      <button onClick={() => navigate("/dashboard")}>
        Vissza a Dashboardra
      </button>
      <ul>
        {events.map((event) => {
          const isParticipant = event.participants.includes(currentUser?.uid);
          const isInWaitlist =
            event.waitlist && event.waitlist.includes(currentUser?.uid);
          return (
            <li
              key={event.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px"
              }}
            >
              <p>
                <strong>Helyszín:</strong> {event.location}
              </p>
              <p>
                <strong>Dátum:</strong> {event.eventDate}
              </p>
              <p>
                <strong>Idő:</strong> {event.eventTime}
              </p>
              <p>
                <strong>Max létszám:</strong> {event.maxCapacity}
              </p>
              <p>
                <strong>Résztvevők száma:</strong> {event.participants.length}
              </p>
              {isParticipant || isInWaitlist ? (
                <button onClick={() => cancelParticipation(event)}>
                  Lemondom
                </button>
              ) : (
                <button onClick={() => joinEvent(event)}>
                  {event.participants.length < event.maxCapacity
                    ? "Jelentkezem"
                    : "Jelentkezem várólistára"}
                </button>
              )}
              <button
                onClick={() =>
                  setExpandedEvents((prev) => ({
                    ...prev,
                    [event.id]: !prev[event.id]
                  }))
                }
              >
                {expandedEvents[event.id]
                  ? "Elrejt"
                  : "Résztvevők megtekintése"}
              </button>
              {expandedEvents[event.id] && (
                <div>
                  <h4>Résztvevők:</h4>
                  <ul>
                    {event.participants.map((uid) => (
                      <li key={uid}>{usersMap[uid] || uid}</li>
                    ))}
                  </ul>
                  {event.waitlist && event.waitlist.length > 0 && (
                    <>
                      <h4>Várólista:</h4>
                      <ul>
                        {event.waitlist.map((uid) => (
                          <li key={uid}>{usersMap[uid] || uid}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Events;
