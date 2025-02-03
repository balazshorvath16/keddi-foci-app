import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import { register } from './serviceWorker';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker regisztrálva:', registration);
    })
    .catch((err) => {
      console.error('Service Worker regisztrációs hiba:', err);
    });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)