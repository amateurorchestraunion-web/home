// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  onSnapshot, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDtat8CbbHg4lnlZ3cQzA2XjX872vzV9iE",
  authDomain: "aou-event.firebaseapp.com",
  projectId: "aou-event",
  storageBucket: "aou-event.firebasestorage.app",
  messagingSenderId: "650092885024",
  appId: "1:650092885024:web:bb8e546e8a0b9240a3b845",
  measurementId: "G-700FX71W9F"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// tree.js에서 사용할 모든 함수 export
export {
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  updateDoc
};
