import * as firebase from 'firebase';
import "firebase/auth";
var firebaseConfig = {
    apiKey: "AIzaSyBqSavDHySRTydr9uGwhhExWrNploNo4lk",
    authDomain: "tennis-court-scheduler.firebaseapp.com",
    databaseURL: "https://tennis-court-scheduler.firebaseio.com",
    projectId: "tennis-court-scheduler",
    storageBucket: "tennis-court-scheduler.appspot.com",
    messagingSenderId: "897574807945",
    appId: "1:897574807945:web:87f6a63d30dd4212e99958"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  firebase.getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject);
    })
  };
  
  var db = firebase.firestore();

  export default db;