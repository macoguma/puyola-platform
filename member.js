import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const memberId = localStorage.getItem("puyola_member_id");

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
    const pollId = docSnap.id;

    const alreadyVoted = (data.votedBy || []).includes(memberId);

    const voteButtons = data.status === "active"
      ? (alreadyVoted
          ? `<em>You already voted</em>`
          : data.options?.map(opt => `<button onclick='vote("${pollId}","${opt}")'>${opt}</button>`).join(" "))
      : `<em>Poll closed</em>`;

    container.innerHTML += `
      <div class="item">
        <strong>${data.title || "No Title"}</strong> 
        <div>${voteButtons || "No options"}</div>
      </div>
    `;
  });
}

// Handle voting
window.vote = async (pollId, option) => {
  const pollRef = doc(db, "polls", pollId);
  const pollSnap = await getDocs(collection(db, "polls"));
  const docSnap = pollSnap.docs.find(d => d.id === pollId);
  const data = docSnap.data();

  const alreadyVoted = (data.votedBy || []).includes(memberId);
  if (alreadyVoted) {
    alert("You already voted.");
    return;
  }

  const votes = data.votes || [];
  votes.push(option);

  const votedBy = data.votedBy || [];
  votedBy.push(memberId);

  await updateDoc(pollRef, { votes, votedBy });

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
