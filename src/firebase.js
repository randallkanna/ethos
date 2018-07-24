import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyDAfdkjMr0wjJIhIo0115oOVqPiC14-uns",
  authDomain: "ethos-aec69.firebaseapp.com",
  databaseURL: "https://ethos-aec69.firebaseio.com",
  projectId: "ethos-aec69",
  storageBucket: "ethos-aec69.appspot.com",
  messagingSenderId: "644597783702"
};

firebase.initializeApp(config);
export default firebase;
