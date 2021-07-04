//Gemini Group Intranet


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCvTtZlCl0oGDH5xq7nyBCmRbEmBf3d7nY",
    authDomain: "gemini-group-intranet-auth.firebaseapp.com",
    projectId: "gemini-group-intranet-auth",
    storageBucket: "gemini-group-intranet-auth.appspot.com",
    messagingSenderId: "1046773201339",
    appId: "1:1046773201339:web:c7f1cb710f5ef01a762c9e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();

//Update Firestore
db.settings({ timestampsInSnapshots: true });







//Auth state function
var privatePages = [
    '/intranet/dashboard'
];

var publicPages = [
    '/intranet/log-in'
];

firebase.auth().onAuthStateChanged(function(user) {
    var currentPath = window.location.pathname;
    if (user) {
        // User is signed in.
        if (publicPages.includes(currentPath)) {
            window.location.replace('/intranet/private');
        } else {
            console.log('User is logged in!');
            console.log('Email: ' + user.email);
            console.log('UID: ' + user.uid);
            user.getIdTokenResult().then(idTokenResult => {
                if (idTokenResult.claims.admin) {
                    console.log('Role: Admin');
                }
            });
            
            //Get Data
            db.collection('Users').onSnapshot(snapshot => {
                setupUsers(snapshot.docs)
            });
            loadingScreen.style.display = 'none';
            
        }
    } else {
        // User is signed out.
        if (privatePages.includes(currentPath)) {
            window.location.replace('/intranet/log-in');
        } else {

            loadingScreen.style.display = 'none';
            console.log('No user is logged in');
            setupUsers([]);
        }
    }
});

//Logout function
logoutLink.addEventListener('click', logout);

function logout() {
    auth.signOut()
};
