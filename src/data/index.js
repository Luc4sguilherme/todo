import firebase from "firebase/app";
require("firebase/database");
// TODO: Coloque os dados do seu aplicativo no firebase
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

export const db = firebase.initializeApp(firebaseConfig).database();
