// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState({ fullName: "", birthDate: "", profilePic: "" });
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const defaultProfilePic = '/assets/default-profile.png';

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

  // Segédfüggvény a profile kép lekéréséhez
  const getProfilePic = (pic) => {
    // Ellenőrizzük, hogy pic létezik, és hogy nem üres string (vagy nem tartalmaz csak whitespace karaktereket)
    if (!pic || (typeof pic === "string" && pic.trim() === "")) {
      return defaultProfilePic;
    }
    return pic;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    
    let profilePicURL = userData.profilePic;

    if (file) {
      // Itt add hozzá a Firebase Storage feltöltési logikát
      // Például:
      // const storage = getStorage();
      // const storageRef = ref(storage, `profilePics/${user.uid}/${file.name}`);
      // await uploadBytes(storageRef, file);
      // profilePicURL = await getDownloadURL(storageRef);
    }

    const updateData = {
      fullName: userData.fullName,
      birthDate: userData.birthDate,
      profilePic: profilePicURL || defaultProfilePic,
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
    <div>
      <h2>Profil módosítása</h2>
      {/* Profilkép megjelenítése: Ha nincs beállítva, a default kép jelenik meg */}
      <div>
      <img 
        src={userData.profilePic || defaultProfilePic} 
        alt="Profilkép" 
        style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
      />
      </div>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Email: </label>
          <span>{email}</span>
        </div>
        <div>
          <label>Profilkép:</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <button type="submit">Profil frissítése</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Profile;
