import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './../node_modules/bulma/css/bulma.css';
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

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
