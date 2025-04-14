const createRoomButton = document.getElementById("create-room");
const joinRoomButton = document.getElementById("join-room");
const confirmRoomButton = document.getElementById("confirm-room");
const roomControlsSection = document.getElementById("room-controls");
const roomNameInput = document.getElementById("room-name");
const gameInfoSection = document.getElementById("game-info");
const roomCodeDisplay = document.getElementById("room-code-display");

let currentRoom = "";
let isCreatingRoom = false;

// Show room controls when "Create Room" or "Join Room" is clicked
createRoomButton.addEventListener("click", () => {
  console.log("Create Room button clicked.");
  isCreatingRoom = true;
  roomControlsSection.classList.remove("hidden");
});

joinRoomButton.addEventListener("click", () => {
  console.log("Join Room button clicked.");
  isCreatingRoom = false;
  roomControlsSection.classList.remove("hidden");
});

// Confirm room creation or joining
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

// Create a room
function createRoom(roomName) {
  console.log("Create room function called with roomName:", roomName);
  currentRoom = roomName;
  const roomRef = db.ref(`rooms/${roomName}`);
  roomRef.set({
    host: `Player-${Math.floor(Math.random() * 1000)}`,
    players: {},
    gameState: {
      status: "lobby",
    },
  }).then(() => {
    console.log("Room created successfully in Firebase.");
    roomCodeDisplay.textContent = `Room Code: ${roomName}`;
    gameInfoSection.classList.remove("hidden");
    roomControlsSection.classList.add("hidden");
  }).catch((error) => {
    console.error("Error creating room in Firebase:", error);
    alert("Failed to create room. Please check your Firebase configuration.");
  });
}

// Join a room
function joinRoom(roomName) {
  console.log("Join room function called with roomName:", roomName);
  currentRoom = roomName;
  const roomRef = db.ref(`rooms/${roomName}`);

  roomRef.once("value").then((snapshot) => {
    if (snapshot.exists()) {
      console.log("Room exists. Joining...");
      roomCodeDisplay.textContent = `Joined Room: ${roomName}`;
      gameInfoSection.classList.remove("hidden");
      roomControlsSection.classList.add("hidden");
    } else {
      alert("Room does not exist.");
    }
  }).catch((error) => {
    console.error("Error joining room in Firebase:", error);
    alert("Failed to join room. Please check your Firebase configuration.");
  });
}