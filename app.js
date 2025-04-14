const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");
const logoutButton = document.getElementById("logout-button");
const authError = document.getElementById("auth-error");
const authStatus = document.getElementById("auth-status");

const createRoomButton = document.getElementById("create-room");
const joinRoomButton = document.getElementById("join-room");
const confirmRoomButton = document.getElementById("confirm-room");
const roomControls = document.getElementById("room-controls");
const roomNameInput = document.getElementById("room-name");
const roomCodeDisplay = document.getElementById("room-code-display");
const gameSetupSection = document.getElementById("game-setup");

let currentRoom = "";
let isCreatingRoom = false;

// Authentication Handlers
loginButton.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      authError.classList.add("hidden");
      updateAuthStatus();
    })
    .catch((error) => {
      authError.textContent = error.message;
      authError.classList.remove("hidden");
    });
});

signupButton.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      authError.classList.add("hidden");
      updateAuthStatus();
    })
    .catch((error) => {
      authError.textContent = error.message;
      authError.classList.remove("hidden");
    });
});

logoutButton.addEventListener("click", () => {
  auth.signOut().then(updateAuthStatus);
});

auth.onAuthStateChanged((user) => {
  if (user) {
    gameSetupSection.classList.remove("hidden");
    logoutButton.classList.remove("hidden");
    authStatus.textContent = `Logged in as ${user.email}`;
  } else {
    gameSetupSection.classList.add("hidden");
    logoutButton.classList.add("hidden");
    authStatus.textContent = "Not logged in.";
  }
});

// Game Setup Handlers
createRoomButton.addEventListener("click", () => {
  isCreatingRoom = true;
  roomControls.classList.remove("hidden");
});

joinRoomButton.addEventListener("click", () => {
  isCreatingRoom = false;
  roomControls.classList.remove("hidden");
});

confirmRoomButton.addEventListener("click", () => {
  const roomName = roomNameInput.value.trim();
  if (!roomName) {
    alert("Please enter a room name or code.");
    return;
  }

  if (isCreatingRoom) {
    createRoom(roomName);
  } else {
    joinRoom(roomName);
  }
});

function createRoom(roomName) {
  const user = auth.currentUser;
  if (!user) return alert("You must be logged in to create a room.");

  const roomRef = db.ref(`rooms/${roomName}`);
  roomRef.set({
    host: user.uid,
    players: {
      [user.uid]: { email: user.email }
    },
    gameState: {
      status: "lobby",
    },
  }).then(() => {
    roomCodeDisplay.textContent = `Room Code: ${roomName}`;
    roomControls.classList.add("hidden");
  }).catch((error) => {
    alert(`Failed to create room: ${error.message}`);
  });
}

function joinRoom(roomName) {
  const user = auth.currentUser;
  if (!user) return alert("You must be logged in to join a room.");

  const roomRef = db.ref(`rooms/${roomName}`);
  roomRef.child("players").update({
    [user.uid]: { email: user.email },
  }).then(() => {
    roomCodeDisplay.textContent = `Joined Room: ${roomName}`;
    roomControls.classList.add("hidden");
  }).catch((error) => {
    alert(`Failed to join room: ${error.message}`);
  });
}

function updateAuthStatus() {
  const user = auth.currentUser;
  if (user) {
    authStatus.textContent = `Logged in as ${user.email}`;
    gameSetupSection.classList.remove("hidden");
    logoutButton.classList.remove("hidden");
  } else {
    authStatus.textContent = "Not logged in.";
    gameSetupSection.classList.add("hidden");
    logoutButton.classList.add("hidden");
  }
}