import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyDvCIe9BjfRVgWvutuf9xMQidfUg2y3FQQ",
    authDomain: "myapp-16a3a.firebaseapp.com",
    databaseURL: "https://myapp-16a3a-default-rtdb.firebaseio.com",
    projectId: "myapp-16a3a",
    storageBucket: "myapp-16a3a.appspot.com",
    messagingSenderId: "190110689374",
    appId: "1:190110689374:web:0ce39d9ddac06d1bf72ccf",
    measurementId: "G-VGP70GLBFN"
  };

firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default firebase;
