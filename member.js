import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// EVENTS
async function loadEvents() {
  const snapshot = await getDocs(collection(db, "events"));
  const list = document.getElementById("events-list");
  list.innerHTML = "";

  snapshot.forEach(d => {
    const data = d.data();
    list.innerHTML += `
      <div class="item">
        <strong>${data.title || "No Title"}</strong>
        <div>${data.date || "No Date"}</div>
      </div>
    `;
  });
}

// POLLS
async function loadPolls() {
  const snapshot = await getDocs(collection(db, "polls"));
  const list = document.getElementById("polls-list");
  list.innerHTML = "";

  snapshot.forEach(d => {
    const data = d.data();

    let buttons = "";

    if (data.status === "active") {
      buttons = data.options
        .map(
          opt =>
            `<button onclick="vote('${d.id}','${opt}')">${opt}</button>`
        )
        .join(" ");
    } else {
      buttons = "<em>Poll closed</em>";
    }

    list.innerHTML += `
      <div class="item">
        <strong>${data.title || "No Title"}</strong>
        <div>Status: ${data.status || "inactive"}</div>
        <div>${buttons}</div>
      </div>
    `;
  });
}

// Vote
window.vote = async (pollId, option) => {
  const pollRef = doc(db, "polls", pollId);
  const pollSnap = await getDoc(pollRef);
  const data = pollSnap.data();

  const votes = data.votes || [];
  votes.push(option);

  await updateDoc(pollRef, { votes });
  alert("Vote recorded!");
  loadPolls();
}

// ANNOUNCEMENTS
async function loadAnnouncements() {
  const snapshot = await getDocs(collection(db, "announcements"));
  const list = document.getElementById("announcements-list");
  list.innerHTML = "";

  snapshot.forEach(d => {
    const data = d.data();
    list.innerHTML += `
      <div class="item">
        <strong>${data.title || "No Title"}</strong>
        <div>${data.body || ""}</div>
      </div>
    `;
  });
}

// Load all
window.addEventListener("load", () => {
  loadEvents();
  loadPolls();
  loadAnnouncements();
});
