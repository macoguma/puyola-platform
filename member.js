import { db } from "./firebase-config.js";
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// EVENTS
async function loadEvents() {
  const snapshot = await getDocs(collection(db, "events"));
  const container = document.getElementById("events-list");
  container.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    container.innerHTML += `<div class="item"><strong>${data.title || "No Title"}</strong> - ${data.date || "No Date"}</div>`;
  });
}

// POLLS (member can vote if active)
async function loadPolls() {
  const snapshot = await getDocs(collection(db, "polls"));
  const container = document.getElementById("polls-list");
  container.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const voteButtons = data.status === "active"
      ? data.options?.map(opt => `<button onclick='vote("${docSnap.id}","${opt}")'>${opt}</button>`).join(" ") 
      : `<em>Poll closed</em>`;
    container.innerHTML += `<div class="item"><strong>${data.title || "No Title"}</strong> - ${voteButtons || "No options"}</div>`;
  });
}

// Handle voting
window.vote = async (pollId, option) => {
  const pollRef = doc(db, "polls", pollId);
  const pollSnap = await getDocs(collection(db, "polls"));
  const docSnap = pollSnap.docs.find(d => d.id === pollId);
  const data = docSnap.data();
  const votes = data.votes || [];
  votes.push(option);
  await updateDoc(pollRef, { votes });
  alert(`You voted: ${option}`);
  loadPolls();
};

// ANNOUNCEMENTS
async function loadAnnouncements() {
  const snapshot = await getDocs(collection(db, "announcements"));
  const container = document.getElementById("announcements-list");
  container.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    container.innerHTML += `<div class="item"><strong>${data.title || "No Title"}</strong>: ${data.body || ""}</div>`;
  });
}

// INITIAL LOAD
loadEvents();
loadPolls();
loadAnnouncements();
