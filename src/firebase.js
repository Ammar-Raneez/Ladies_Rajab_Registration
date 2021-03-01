import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBClCU7-nnf8sp5YMxlRHju374Fu5fb2eI",
    authDomain: "ladies-rajab-registration.firebaseapp.com",
    projectId: "ladies-rajab-registration",
    storageBucket: "ladies-rajab-registration.appspot.com",
    messagingSenderId: "147627459623",
    appId: "1:147627459623:web:e669ba77671d4a3ebbfa02",
    measurementId: "G-0215M9DNK5"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()

export default db;