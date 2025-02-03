// src/pages/Statistics.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

function Statistics() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const statsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          fullName: data.fullName || "Nincs név",
          participationCount: data.participationCount || 0,
        };
      });
      setStats(statsData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="main_container">
      <h2>Statisztikák</h2>
      <table className="statistics_table" border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Név</th>
            <th>Részvétel száma</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.participationCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Statistics;
