// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Statistics from "./pages/Statistics";
import EditEvent from "./pages/EditEvent";
import UserManagement from "./pages/UserManagement";
import Layout from "./components/Layout";
import './App.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
// import { requestForToken, onMessageListener } from './firebaseMessaging';

const App = () => {
  useEffect(() => {
    const startPushNotifications = async () => {
      await requestNotificationPermission();
      onMessageListener().then((payload) => {
        console.log('Message received. ', payload);
        alert(payload.notification.title);
      });
    };

    startPushNotifications();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Route>
      </Routes>
    </Router>
  );
};

// Engedély kérés
const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');
    await requestForToken();
  } else {
    console.log('Notification permission denied.');
  }
};

export default App;
