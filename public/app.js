// User Auth
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");
const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
const userDetails = document.getElementById("userDetails");

signInButton.onclick = () => auth.signInWithPopup(provider);
signOutButton.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;

    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});


// Firestore 

const db = firebase.firestore();

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

let thingsRef;
let unsubscribe;


auth.onAuthStateChanged(user => {
    if (user) {
        thingsRef = db.collection('things');

        createThing.onclick = () =>  {

            const { serverTimestamp } = firebase.firestore.FieldValue;

            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            });
        }

        unsubscribe = thingsRef
            .where('uid' , '==', user.uid)
            .orderBy('createdAt')
            .onSnapshot(querySnapshot => {
                const items = querySnapshot.docs.map(doc => {
                    return `<li>${doc.data().name}</li>`
                });

                thingsList.innerHTML = items.join('');
            });
    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
    }

});

