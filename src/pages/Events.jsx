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
  runTransaction,
  getDoc,
  increment
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
function computeRegistrationDeadline(event) {
  const eventDateTimeStr = `${event.eventDate}T${event.eventTime}:00`;
  const eventStart = new Date(eventDateTimeStr);
  const deadline = new Date(eventStart.getTime() - 129600000);
  return deadline;
}
function Events() {
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [usersMap, setUsersMap] = useState({});
  const [expandedEvents, setExpandedEvents] = useState({});
  const navigate = useNavigate();
  const defaultProfilePic = '/assets/img/default-profile.png';

  // Bejelentkezett felhasználó és szerep lekérése
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Lekérjük a felhasználó dokumentumát a "users" kollekcióból a role mezővel
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
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
        usersObj[doc.id] = doc.data(); // Az egész dokumentumot tároljuk
      });
      setUsersMap(usersObj);
    });
    return () => unsubscribeUsers();
  }, []);


  const joinEvent = async (event) => {
    if (!currentUser) return;
    const eventRef = doc(db, "events", event.id);
    const now = new Date();
    const deadline = computeRegistrationDeadline(event); // Ezt implementáld a kívánt logika szerint
  
    try {
      // Ha a regisztrációs határidő előtt van, és a felhasználó veterán
      if (now < deadline && userRole === "Keddi foci veterán") {
        // Ha az esemény megtelt
        if (event.participants.length >= event.maxCapacity) {
          // Keressük meg az első olyan résztvevőt, akinek a levelje "Új játékos"
          const candidateUid = event.participants.find(uid => {
            const userData = usersDataMap[uid];
            return userData && userData.level === "Új játékos";
          });
          if (candidateUid) {
            // Tranzakcióban távolítjuk el a candidateUid-t, hozzáadjuk a várólistához,
            // majd a veteránt a résztvevők közé tesszük
            await runTransaction(db, async (transaction) => {
              const eventDoc = await transaction.get(eventRef);
              if (!eventDoc.exists()) throw "Esemény nem található!";
              const eventData = eventDoc.data();
              const updatedParticipants = eventData.participants.filter(uid => uid !== candidateUid);
              const updatedWaitlist = eventData.waitlist ? [...eventData.waitlist, candidateUid] : [candidateUid];
              updatedParticipants.push(currentUser.uid);
              transaction.update(eventRef, {
                participants: updatedParticipants,
                waitlist: updatedWaitlist
              });
            });
            // (Esetleg itt növeld a veterán részvételi számát is, pl. increment(1))
            return;
          } else {
            // Ha nem találunk "Új játékos" jelölőt, a veteránt a waitlistbe tesszük
            await updateDoc(eventRef, {
              waitlist: arrayUnion(currentUser.uid)
            });
            return;
          }
        } else {
          // Ha nem telt meg az esemény, egyszerűen hozzáadjuk a veteránt a résztvevők közé
          await updateDoc(eventRef, {
            participants: arrayUnion(currentUser.uid)
          });
          return;
        }
      } else {
        // Normál regisztráció
        if (event.participants.length < event.maxCapacity) {
          await updateDoc(eventRef, {
            participants: arrayUnion(currentUser.uid)
          });
        } else {
          await updateDoc(eventRef, {
            waitlist: arrayUnion(currentUser.uid)
          });
        }
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

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: { 
          slidesToShow: 1,
          variableWidth: true,
        },
       
      }
    ]
  };

  if (loading) {
    return <div>
      <img src="https://firebasestorage.googleapis.com/v0/b/keddi-foci-app.firebasestorage.app/o/VAR_System_Logo.svg?alt=media&token=f0d6e4d4-38c4-48c7-8f5e-b71fad29f2d1" alt="" style={{ maxWidth: "120px", height: "auto" }}/>
      <h2>Egy pillanat, a VAR még vizsgálja az esetet...</h2>
      </div>;
  }

  return (
    <div id="event_page" className="main_container">
      <h2>Események</h2>
      <button onClick={() => navigate("/dashboard")}>Vissza a Dashboardra</button>
      <Slider {...settings}>
        {events.map((event) => {
          const isParticipant = event.participants.includes(currentUser?.uid);
          const isInWaitlist = event.waitlist && event.waitlist.includes(currentUser?.uid);
          const cardClass = event.status === "elmarad" ? "event-card cancelled" : "event-card";
          return (
            <div
              key={event.id}
              className={cardClass}
              style={{
                padding: "10px",
                margin: "5px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                position: "relative"
              }}
            >
              {event.modified && (
                <span
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "orange",
                    color: "#fff",
                    padding: "2px 5px",
                    borderRadius: "3px",
                    fontSize: "12px"
                  }}
                >
                  Módosult
                </span>
              )}
              <p><strong>Helyszín:</strong> {event.location}</p>
              <p><strong>Dátum:</strong> {event.eventDate}</p>
              <p><strong>Idő:</strong> {event.eventTime}</p>
              <p><strong>Max létszám:</strong> {event.maxCapacity}</p>
              <p><strong>Résztvevők száma:</strong> {event.participants.length}</p>
              {isParticipant || isInWaitlist ? (
                <button onClick={() => cancelParticipation(event)}>Lemondom</button>
              ) : (
                <button onClick={() => joinEvent(event)}>
                  {event.participants.length < event.maxCapacity
                    ? "Jelentkezem"
                    : "Jelentkezem várólistára"}
                </button>
              )}
              {userRole === "admin" && (
                <button onClick={() => navigate(`/edit-event/${event.id}`)}>
                  Esemény szerkesztése
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
                {expandedEvents[event.id] ? "Elrejt" : "Résztvevők megtekintése"}
              </button>
              {expandedEvents[event.id] && (
                <div>
                  <h4>Résztvevők:</h4>
                  <ul className="resztvevok-list">
                    {event.participants.map((uid) => {
                      const user = usersMap[uid] || {}; // Ha nincs, üres objektum
                      const displayName = user.fullName ? user.fullName : uid;
                      // Ellenőrizd, hogy a profilePic létezik és nem csak üres string
                      const profilePicUrl = user.profilePic && user.profilePic.trim() !== ""
                        ? user.profilePic
                        : defaultProfilePic;
                      return (
                        <li key={uid} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                          <img 
                            src={profilePicUrl} 
                            alt={displayName} 
                            style={{ width: "24px", height: "24px", borderRadius: "50%", marginRight: "5px" }} 
                          />
                          <span>{displayName}</span>
                        </li>
                      );
                    })}
                  </ul>
                  {event.waitlist && event.waitlist.length > 0 && (
                    <>
                      <h4>Várólista:</h4>
                      <ul className="resztvevok-list">
                        {event.waitlist.map((uid) => {
                          const user = usersMap[uid] || {};
                          const displayName = user.fullName ? user.fullName : uid;
                          const profilePicUrl = user.profilePic && user.profilePic.trim() !== ""
                            ? user.profilePic
                            : defaultProfilePic;
                          return (
                            <li key={uid} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                              <img 
                                src={profilePicUrl} 
                                alt={displayName} 
                                style={{ width: "24px", height: "24px", borderRadius: "50%", marginRight: "5px" }} 
                              />
                              <span>{displayName}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

export default Events;
