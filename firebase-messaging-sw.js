importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyBKI98vzkxjHVuQ7-p8xtH2oum-CxUkDC4",
  authDomain: "fir-demo-7ea78.firebaseapp.com",
  projectId: "fir-demo-7ea78",
  storageBucket: "fir-demo-7ea78.firebasestorage.app",
  messagingSenderId: "336438998712",
  appId: "1:336438998712:web:2db65ecce8bc4c11c9a64d",
  measurementId: "G-Y2HP28VPH7"
};


firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

