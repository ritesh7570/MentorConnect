const socket = io(); // Connect to the server
const chatId = "<%= chat._id %>"; // Chat room ID
const userId = "<%= loggedInUser.id %>"; // Logged-in user ID

// Join the chat room
socket.emit("joinRoom", chatId);

// Append a new message to the chat box
function appendMessage(senderId, text, timestamp) {
    const chatBox = document.getElementById("chatBox");
    const messageDiv = document.createElement("div");
    messageDiv.className = senderId === userId ? "text-end mb-2" : "text-start mb-2";

    messageDiv.innerHTML = `
        <strong>${senderId === userId ? 'You' : '<%= secondPerson.name %>'}:</strong>
        <p class="m-0">${text}</p>
        <small class="text-muted">${new Date(timestamp).toLocaleString()}</small>
    `;

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
}

// Listen for new messages from the server
socket.on("message", (message) => {
    appendMessage(message.sender, message.text, message.timestamp);
});

// Handle message submission
document.getElementById("chatForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const messageInput = document.getElementById("messageInput");
    const text = messageInput.value;

    // Send message to the server
    socket.emit("newMessage", { chatId, senderId: userId, text });

    // Clear the input box
    messageInput.value = "";
});

// Video call button functionality
document.getElementById("videoCallBtn").addEventListener("click", () => {
    // Show the video call section and hide the chat section
    document.getElementById("videoCallSection").classList.remove("d-none");
    document.getElementById("chatBoxSection").classList.add("d-none");

    // Emit the event to start video call
    socket.emit("startVideoCall", { chatId, userId, secondPersonId: "<%= secondPerson._id %>" });
});

// WebRTC variables
let localStream;
let peerConnection;

// Handle incoming video call request
socket.on("videoCallRequest", ({ userId, secondPersonId }) => {
    const answerCall = confirm("You have an incoming video call. Do you want to answer?");
    if (answerCall) {
        startCall(userId, secondPersonId, true);
    }
});

// Start a video call (either outgoing or incoming)
function startCall(userId, secondPersonId, isAnswer = false) {
    // Get the user's media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            localStream = stream;
            document.getElementById("localVideo").srcObject = localStream;

            // Create a peer connection
            peerConnection = new RTCPeerConnection();

            // Add local stream to peer connection
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });

            // Handle remote stream
            peerConnection.ontrack = (event) => {
                document.getElementById("remoteVideo").srcObject = event.streams[0];
            };

            // Signal offer or answer
            if (isAnswer) {
                peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                peerConnection.createAnswer()
                    .then((answer) => {
                        peerConnection.setLocalDescription(answer);
                        socket.emit("answer", { answer, userId, secondPersonId });
                    });
            } else {
                peerConnection.createOffer()
                    .then((offer) => {
                        peerConnection.setLocalDescription(offer);
                        socket.emit("offer", { offer, userId, secondPersonId });
                    });
            }

            // Handle ICE candidates
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("iceCandidate", { candidate: event.candidate, userId, secondPersonId });
                }
            };
        });
}

// Handle receiving an answer from the other user
socket.on("answer", ({ answer, secondPersonId }) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

// Handle receiving ICE candidates
socket.on("iceCandidate", ({ candidate, secondPersonId }) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

// End video call functionality
document.getElementById("endCallBtn").addEventListener("click", () => {
    peerConnection.close();
    localStream.getTracks().forEach(track => track.stop());
    document.getElementById("videoCallSection").classList.add("d-none");
    document.getElementById("chatBoxSection").classList.remove("d-none");
});

// End chat functionality
document.getElementById("endChatBtn").addEventListener("click", () => {
    socket.emit("endChat", { chatId });
    window.location.href = '/mentorDashboard'; // Or navigate to your desired route
});
