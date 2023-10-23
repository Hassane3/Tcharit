// import express from 'express';
// import cors from "cors";
import http from 'node:http';
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCxpSn9MzF0CJZsfR_7s42S8_a52dskQX4",
  authDomain: "tchari.firebaseapp.com",
  databaseURL: "https://tchari-default-rtdb.firebaseio.com",
  projectId: "tchari",
  storageBucket: "tchari.appspot.com",
  messagingSenderId: "294891691900",
  appId: "1:294891691900:web:c11d262e460c9407ee8ef9",
  measurementId: "G-M7T6TYNY74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getDatabase(app);


const port = 8000;

// app.use(cors());
// app.use(express.json());

// app.get('/message', (req, res) => {
//   res.json({message :  'Hello World!'});
// });

// app.listen(port, () => {
//   return console.log(`Express is listening at http://localhost:${port}`);
// });




// Fonction pour générer un identifiant unique (exemple simple)
function generateUniqueID() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Créer un serveur HTTP basique
const server = http.createServer((req, res) => {
  // Vérifier si le cookie est déjà présent dans la requête
  const cookie = req.headers.cookie;
  let visitorID;

  if (cookie) {
    const cookieParts = cookie.split(';').map(part => part.trim());
    for (const part of cookieParts) {
      const [key, value] = part.split('=');
      if (key === 'visitor_id') {
        visitorID = value;
        break;
      }
    }
  }

  // Si le cookie n'existe pas ou est invalide, en générer un nouveau
  if (!visitorID || !/^[a-zA-Z0-9]+$/.test(visitorID)) {
    visitorID = generateUniqueID();
    res.setHeader('Set-Cookie', `visitor_id=${visitorID}; HttpOnly`);
  }

  // Autres opérations à effectuer sur le serveur (non pertinentes pour l'exemple)
  // ...

  // Envoyer une réponse au client
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Bonjour, visiteur ! Votre ID est : ${visitorID}`);
});

// Lancer le serveur sur le port 3000
server.listen(port, () => {
  console.log(`Serveur en cours d'écoute sur le port ${port}`);
});
