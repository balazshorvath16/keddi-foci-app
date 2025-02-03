// src/pages/UserManagement.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    });
    return () => unsubscribe();
  }, []);

  const handleLevelChange = async (userId, newLevel) => {
    try {
      await updateDoc(doc(db, "users", userId), { level: newLevel });
    } catch (err) {
      console.error("Hiba a felhasználó level frissítése során:", err);
    }
  };

  const handleParticipationCountChange = async (userId, newCount) => {
    try {
      await updateDoc(doc(db, "users", userId), { participationCount: newCount });
    } catch (err) {
      console.error("Hiba a felhasználó részvételi száma frissítése során:", err);
    }
  };

  return (
    <div>
      <h2>Felhasználók kezelése</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Email</th>
            <th>Teljes név</th>
            <th>Szint</th>
            <th>Részvétel száma</th>
            <th>Módosítás</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.fullName}</td>
              <td>{user.level}</td>
              <td>{user.participationCount}</td>
              <td>
                <button onClick={() => handleLevelChange(user.id, user.level === "Új játékos" ? "Keddi foci veterán" : "Új játékos")}>
                  Szint váltás
                </button>
                <button onClick={() => {
                  const newCount = prompt("Új részvételi szám:", user.participationCount);
                  if (newCount !== null) {
                    handleParticipationCountChange(user.id, Number(newCount));
                  }
                }}>
                  Részvételi szám módosítása
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
