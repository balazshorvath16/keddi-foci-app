// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState({ fullName: "", birthDate: "" });
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
    <Container className="mt-4">
      <h2>Profil módosítása</h2>
      <Form onSubmit={handleUpdate}>
        <Form.Group className="mb-3">
          <Form.Label>Email:</Form.Label>
          <Form.Control plaintext readOnly defaultValue={email} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Teljes név:</Form.Label>
          <Form.Control
            type="text"
            value={userData.fullName}
            onChange={(e) =>
              setUserData({ ...userData, fullName: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Születési dátum:</Form.Label>
          <Form.Control
            type="date"
            value={userData.birthDate}
            onChange={(e) =>
              setUserData({ ...userData, birthDate: e.target.value })
            }
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Profil frissítése
        </Button>
      </Form>
      {message && <p>{message}</p>}
    </Container>
  );
}

export default Profile;
