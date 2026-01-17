import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* ===============================
   EVENTS
================================ */

async function loadEvents() {
  const list = document.getElementById("events-list");
  list.innerHTML = "";

  const snap = await getDocs(collection(db, "events"));
  snap.forEach(d => {
    const e = d.data();
    list.innerHTML += `
      <div class="item">
        <strong>${e.title}</strong><br>
        Date: ${e.date || "Not set"}<br>
        <button onclick="editEvent('${d.id}')">Edit</button>
        <button onclick="deleteEvent('${d.id}')">Delete</button>
      </div>
    `;
  });
}

window.addEvent = async () => {
  const title = prompt("Event title:");
  const date = prompt("Event date:");
  if (!title) return;

  await addDoc(collection(db, "events"), { title, date });
  loadEvents();
};

window.editEvent = async (id) => {
  const title = prompt("New title:");
  if (!title) return;

  await updateDoc(doc(db, "events", id), { title });
  loadEvents();
};

window.deleteEvent = async (id) => {
  if (!confirm("Delete event?")) return;
  await deleteDoc(doc(db, "events", id));
  loadEvents();
};

/* ===============================
   POLLS
================================ */

async function loadPolls() {
  const list = document.getElementById("polls-list");
  list.innerHTML = "";

  const snap = await getDocs(collection(db, "polls"));
  snap.forEach(d => {
    const p = d.data();
    list.innerHTML += `
      <div class="item">
        <strong>${p.title}</strong><br>
        Status: <b>${p.status}</b><br>
        <button onclick="closePoll('${d.id}')">Close Poll</button>
        <button onclick="deletePoll('${d.id}')">Delete</button>
      </div>
    `;
  });
}

window.addPoll = async () => {
  const title = prompt("Poll question:");
  const optionsRaw = prompt("Options (comma separated)");
  if (!title || !optionsRaw) return;

  const options = optionsRaw.split(",").map(o => o.trim());

  await addDoc(collection(db, "polls"), {
    title,
    options,
    status: "active",
    votes: {}
  });

  loadPolls();
};

window.closePoll = async (id) => {
  await updateDoc(doc(db, "polls", id), { status: "closed" });
  loadPolls();
};

window.deletePoll = async (id) => {
  if (!confirm("Delete poll?")) return;
  await deleteDoc(doc(db, "polls", id));
  loadPolls();
};

/* ===============================
   ANNOUNCEMENTS
================================ */

async function loadAnnouncements() {
  const list = document.getElementById("announcements-list");
  list.innerHTML = "";

  const snap = await getDocs(collection(db, "announcements"));
  snap.forEach(d => {
    const a = d.data();
    list.innerHTML += `
      <div class="item">
        <strong>${a.title}</strong><br>
        ${a.body}<br>
        <button onclick="editAnnouncement('${d.id}')">Edit</button>
        <button onclick="deleteAnnouncement('${d.id}')">Delete</button>
      </div>
    `;
  });
}

window.addAnnouncement = async () => {
  const title = prompt("Announcement title:");
  const body = prompt("Announcement body:");
  if (!title || !body) return;

  await addDoc(collection(db, "announcements"), { title, body });
  loadAnnouncements();
};

window.editAnnouncement = async (id) => {
  const title = prompt("New title:");
  const body = prompt("New body:");
  if (!title || !body) return;

  await updateDoc(doc(db, "announcements", id), { title, body });
  loadAnnouncements();
};

window.deleteAnnouncement = async (id) => {
  if (!confirm("Delete announcement?")) return;
  await deleteDoc(doc(db, "announcements", id));
  loadAnnouncements();
};

/* ===============================
   INITIAL LOAD
================================ */

loadEvents();
loadPolls();
loadAnnouncements();
