import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCQ3O42jy9dOk-BnDce_DSarBcagpp-i2o",
  authDomain: "ethos-3c2e0.firebaseapp.com",
  databaseURL: "https://ethos-3c2e0.firebaseio.com",
  projectId: "ethos-3c2e0",
  storageBucket: "",
  messagingSenderId: "202325232456"
};

const fire = firebase.initializeApp(config);
export { fire };
