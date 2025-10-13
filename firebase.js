// Logging happens here
const logEl = document.getElementById('log');

function showMessage(msg) {
    const time = new Date().toLocaleTimeString();
    logEl.textContent += `[${time}] ${msg}\n`;
    logEl.scrollTop = logEl.scrollHeight;
}

// Import Firebase from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// 🔥 REPLACE & PASTE YOUR CONFIG HERE 🔥
const firebaseConfig = {
    apiKey: "AIzaSyD5I3xbjw2bbd4sNHTif8KnGnvDSTmN1es",
    authDomain: "mystudentapp-285ce.firebaseapp.com",
    databaseURL: "https://mystudentapp-285ce-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mystudentapp-285ce",
    storageBucket: "mystudentapp-285ce.firebasestorage.app",
    messagingSenderId: "956122077661",
    appId: "1:956122077661:web:bc567b0844bee5fe7c3e34"
};

// Start Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// 1. Sign-In Anonymously [For Locked Mode]
async function signIn() {
    showMessage("🔄 Signing in...");

    try {
        const user = await signInAnonymously(auth);
        
        document.getElementById('userStatus').textContent = "✅ Signed in! User ID: " + user.user.uid;
        showMessage("✅ Signed in successfully!");
    } catch (error) {
        // Handle different types of authentication errors
        if (error.code === 'auth/network-request-failed') {
            showMessage("❌ Network error: Cannot connect to Firebase. Check your internet connection.");
        } else if (error.code === 'auth/configuration-not-found') {
            showMessage("❌ Firebase configuration error: Check your firebaseConfig values.");
        } else if (error.code === 'auth/too-many-requests') {
            showMessage("❌ Too many attempts: Please wait a moment before trying again.");
        } else {
            showMessage("❌ Sign-in failed: " + error.message);
        }
        
        console.error("Authentication error:", error);
    }
}

// 2. Saving Data Function Demo
async function saveData() {
    const name = document.getElementById('nameInput').value;
    const message = document.getElementById('messageInput').value;

    // When either name or message variable returns null/empty
    if (!name || !message) {
        showMessage("❌ Please enter both name and message");
        return;
    }

    // When user is not authenticated
    const user = auth.currentUser;
    if (!user) {
        showMessage("❌ Please sign in first");
        return;
    }

    // Save to database under user's ID
    // ref(database variable, table name, the unique ID identifier)
    const userRef = ref(database, 'users/' + user.uid);
    await set(userRef, {
        name: name,
        message: message,
        savedAt: new Date().toLocaleString()
    });

    showMessage("✅ Data saved to database!");
    document.getElementById('nameInput').value = '';
    document.getElementById('messageInput').value = '';
}

// 3. Loading Data Function Demo
async function loadData() {
    const user = auth.currentUser;
    if (!user) {
        showMessage("❌ Please sign in first");
        return;
    }

    showMessage("🔄 Loading your data...");

    // ref(database variable, table name, the unique ID identifier)
    const userRef = ref(database, 'users/' + user.uid);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        const data = snapshot.val();
        document.getElementById('dataDisplay').innerHTML = `
            <div style="background: #e8f4fd; padding: 10px;">
                <strong>Name:</strong> ${data.name}<br>
                <strong>Message:</strong> ${data.message}<br>
                <strong>Saved:</strong> ${data.savedAt}
            </div>
        `;
        showMessage("✅ Data loaded successfully!");
    } else {
        document.getElementById('dataDisplay').innerHTML = "<p>No data saved yet</p>";
        showMessage("ℹ️ No data found - save some data first!");
    }
}

// Make functions available to HTML buttons
window.signIn = signIn;
window.saveData = saveData;
window.loadData = loadData;

signIn();