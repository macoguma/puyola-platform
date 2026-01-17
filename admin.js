// admin.js
import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

async function loadEvents() {
  const snapshot = await getDocs(collection(db, "events"));
  const container = document.getElementById("events-list");
  container.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    container.innerHTML += `<div class="item"><strong>${data.title || "No Title"}</strong> - ${data.date?.toDate?.() || "No Date"}</div>`;
  });
}

async function loadPolls() {
  const snapshot = await getDocs(collection(db, "polls"));
  const container = document.getElementById("polls-list");
  container.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    container.innerHTML += `<div class="item"><strong>${data.title || "No Title"}</strong> - Status: ${data.status || "N/A"}</div>`;
  });
}

async function loadAnnouncements() {
  const snapshot = await getDocs(collection(db, "announcements"));
  const container = document.getElementById("announcements-list");
  container.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    container.innerHTML += `<div class="item"><strong>${data.title || "No Title"}</strong>: ${data.body || ""}</div>`;
  });
}

loadEvents();
loadPolls();
loadAnnouncements();
