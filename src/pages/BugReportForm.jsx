// src/pages/BugReportForm.jsx
import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const BugReportForm = () => {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = "";
    try {
      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `bugReports/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(db, "bug-reports"), {
        description,
        imageUrl,
        createdAt: serverTimestamp()
      });
      setMessage("Hibajelentés elküldve. Köszönjük, hogy jelezted a problémát!");
      setDescription("");
      setFile(null);
    } catch (error) {
      console.error("Hiba a hibajelentés elküldésekor: ", error);
      setMessage("Hiba történt a hibajelentés elküldésekor.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Hibajelentés</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Írd le a problémát..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={textArea}
        />
        <br />
        <input style={fileUpload} type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <br />
        <button type="submit" style={buttonStyle}>Elküld</button>
      </form>
    </div>
  );
};

const textArea = {
  width: "-webkit-fill-available",
  minHeight: "150px",
  outline: "unset",
  borderRadius: 16,
  padding: 24,
  
}

const buttonStyle = {
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px"
};

const fileUpload = {
  backgroundColor: "#007BFF",
  color: "#ffffff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px"
};

export default BugReportForm;
