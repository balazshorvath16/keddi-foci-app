// src/pages/BugReports.jsx
import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

const BugReports = () => {
  const [bugReports, setBugReports] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "bug-reports"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBugReports(reports);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Hibajelentések</h2>
      {bugReports.length === 0 ? (
        <p>Nincs hibajelentés.</p>
      ) : (
        <ul>
          {bugReports.map((report) => (
            <li key={report.id} style={{ marginBottom: "15px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
              <p><strong>Leírás:</strong> {report.description}</p>
              {report.imageUrl && (
                <img src={report.imageUrl} alt="Hibajelentés képe" style={{ maxWidth: "200px" }} />
              )}
              <p><strong>Létrehozva:</strong> {new Date(report.createdAt?.seconds * 1000).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BugReports;
