
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// 1005 Studio Firebase Konfigürasyonu
const firebaseConfig = {
  apiKey: "AIzaSyAG5Ws3yDMRI-B-2EOyy3dOckwgBNnZmLY",
  authDomain: "studio-d8e04.firebaseapp.com",
  databaseURL: "https://studio-d8e04-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "studio-d8e04",
  storageBucket: "studio-d8e04.firebasestorage.app",
  messagingSenderId: "557627925938",
  appId: "1:557627925938:web:08cc82248d4438ac3cb0ab"
};

// Uygulamayı başlat (Modular SDK)
const app = initializeApp(firebaseConfig);

// Veritabanı servisini dışarı aktar
export const db = getDatabase(app);
