const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

const roomControls = document.getElementById("room-controls");
const roomNameInput = document.getElementById("room-name");
const joinRoomButton = document.getElementById("join-room");

// State variables
let currentRoom = "";
let drawing = false;
let isDrawer = false; // True if the player is currently drawing
let currentWord = "";

// Join a room
joinRoomButton.addEventListener("click", () => {
  const roomName = roomNameInput.value.trim();
  if (!roomName) {
    alert("Please enter a room name.");
    return;
  }

  currentRoom = roomName;
  initializeRoom(currentRoom);
});

// Initialize room in Firebase
function initializeRoom(roomName) {
  const roomRef = db.ref(`rooms/${roomName}`);

  // Create room if it doesn't exist
  roomRef.once("value", (snapshot) => {
    if (!snapshot.exists()) {
      roomRef.set({
        drawing: [],
        chat: [],
        players: [],
        gameState: {
          round: 1,
          currentDrawer: "",
          word: "",
        },
      });
    }

    // Add current player to the player list
    roomRef.child("players").push("Player1"); // Replace "Player1" with the actual player name
  });

  // Listen for updates in the room
  listenToRoom(roomName);
}

function listenToRoom(roomName) {
  const roomRef = db.ref(`rooms/${roomName}`);

  // Sync drawing data
  roomRef.child("drawing").on("child_added", (snapshot) => {
    const { x, y, color, size } = snapshot.val();
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  });

  // Sync chat messages
  roomRef.child("chat").on("child_added", (snapshot) => {
    const { player, message } = snapshot.val();
    const li = document.createElement("li");
    li.textContent = `${player}: ${message}`;
    document.getElementById("messages").appendChild(li);

    // Check if the guess is correct
    if (message.toLowerCase() === currentWord.toLowerCase() && !isDrawer) {
      alert("You guessed the word!");
    }
  });
}

// Drawing event listeners
canvas.addEventListener("mousedown", () => (drawing = true));
canvas.addEventListener("mouseup", () => (drawing = false));
canvas.addEventListener("mousemove", draw);

function draw(event) {
  if (!drawing || !isDrawer) return;
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;

  // Draw locally
  ctx.lineWidth = document.getElementById("brush-size").value;
  ctx.strokeStyle = document.getElementById("color-picker").value;
  ctx.lineCap = "round";
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);

  // Update Firebase with drawing data for the current room
  db.ref(`rooms/${currentRoom}/drawing`).push({
    x,
    y,
    color: ctx.strokeStyle,
    size: ctx.lineWidth,
  });
}

// Chat functionality
document.getElementById("chat-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const message = event.target.value;
    db.ref(`rooms/${currentRoom}/chat`).push({
      player: "Player1", // Replace "Player1" with the actual player name
      message,
    });
    event.target.value = "";
  }
});