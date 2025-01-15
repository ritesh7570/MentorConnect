const socket = io(); // Connect to Socket.IO server
let localStream;
let peerConnection;

// HTML Elements
const videoGrid = document.getElementById("videoGrid");
const callButton = document.getElementById("callButton");
const endCallButton = document.getElementById("endCallButton");

// ICE configuration for WebRTC
const iceConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Use Google's STUN server
};

// Get media stream
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  localStream = stream;

  // Show the local video
  const localVideo = document.createElement("video");
  localVideo.srcObject = stream;
  localVideo.autoplay = true;
  localVideo.muted = true;
  videoGrid.appendChild(localVideo);
});

// Start a call
callButton.addEventListener("click", () => {
  const userToCall = prompt("Enter the ID of the user you want to call:");
  if (!userToCall) return;

  peerConnection = new RTCPeerConnection(iceConfiguration);

  // Add local stream tracks to the connection
  localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

  // Send ICE candidates to the other peer
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("callUser", {
        userToCall,
        signal: event.candidate,
        from: socket.id,
        name: "Mentor/Mentee",
      });
    }
  };

  // Show remote stream
  peerConnection.ontrack = (event) => {
    const remoteVideo = document.createElement("video");
    remoteVideo.srcObject = event.streams[0];
    remoteVideo.autoplay = true;
    videoGrid.appendChild(remoteVideo);
  };

  // Create an offer
  peerConnection.createOffer().then((offer) => {
    peerConnection.setLocalDescription(offer);
    socket.emit("callUser", { userToCall, signal: offer, from: socket.id });
  });
});

// Handle incoming calls
socket.on("incomingCall", (data) => {
  const accept = confirm(`Incoming call from ${data.name}. Accept?`);
  if (!accept) return;

  peerConnection = new RTCPeerConnection(iceConfiguration);

  // Add local stream tracks to the connection
  localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("answerCall", { signal: event.candidate, to: data.from });
    }
  };

  peerConnection.ontrack = (event) => {
    const remoteVideo = document.createElement("video");
    remoteVideo.srcObject = event.streams[0];
    remoteVideo.autoplay = true;
    videoGrid.appendChild(remoteVideo);
  };

  peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
  peerConnection.createAnswer().then((answer) => {
    peerConnection.setLocalDescription(answer);
    socket.emit("answerCall", { signal: answer, to: data.from });
  });
});
