import { db } from "./firebase-config.js";
import {
  collection, getDocs, updateDoc, doc, deleteDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

async function loadEvents() {
  const snapshot = await getDocs(collection(db, "events"));
  const container = document.getElementById("events-list");
  container.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    container.innerHTML += `
      <div class="item">
        <strong>${data.title || "No Title"}</strong> - ${data.date || "No Date"}
        <button onclick='deleteEvent("${docSnap.id}")'>Delete</button>
      </div>
    `;
  });
}

async function loadPolls() {
  const snapshot = await getDocs(collection(db, "polls"));
  const container = document.getElementById("polls-list");
  container.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const votes = data.votes || {};

    // Show results
    const results = Object.keys(votes).map(opt => {
      return `<div>${opt}: ${votes[opt]}</div>`;
    }).join("");

    container.innerHTML += `
      <div class="item">
        <strong>${data.title || "No Title"}</strong> - ${data.status || "N/A"}
        <div>${results}</div>
        <button onclick='closePoll("${docSnap.id}")'>Close</button>
        <button onclick='deletePoll("${docSnap.id}")'>Delete</button>
      </div>
    `;
  });
}

async function loadAnnouncements() {
  const snapshot = await getDocs(collection(db, "announcements"));
  const container = document.getElementById("announcements-list");
  container.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    container.innerHTML += `
      <div class="item">
        <strong>${data.title || "No Title"}</strong>: ${data.body || ""}
        <button onclick='deleteAnnouncement("${docSnap.id}")'>Delete</button>
      </div>
    `;
  });
}

window.closePoll = async (id) => {
  await updateDoc(doc(db, "polls", id), { status: "closed" });
  loadPolls();
};

window.deletePoll = async (id) => {
  if(confirm("Delete this poll?")) {
    await deleteDoc(doc(db, "polls", id));
    loadPolls();
  }
};

window.deleteEvent = async (id) => {
  if(confirm("Delete this event?")) {
    await deleteDoc(doc(db, "events", id));
    loadEvents();
  }
};

window.deleteAnnouncement = async (id) => {
  if(confirm("Delete this announcement?")) {
    await deleteDoc(doc(db, "announcements", id));
    loadAnnouncements();
  }
};

// INITIAL LOAD
loadEvents();
loadPolls();
loadAnnouncements();
