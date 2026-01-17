import { db } from "./firebase-config.js";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// UTILITY FUNCTION TO RENDER ITEMS
function renderItem(containerId, dataArray, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  dataArray.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";

    if(type === "event") {
      div.innerHTML = `
        <strong>${item.title}</strong> - ${item.date || "No Date"} 
        <button onclick='editEvent("${item.id}")'>Edit</button>
        <button onclick='deleteEvent("${item.id}")'>Delete</button>
      `;
    }

    if(type === "poll") {
      div.innerHTML = `
        <strong>${item.title}</strong> - Status: ${item.status}
        <button onclick='closePoll("${item.id}")'>Close</button>
        <button onclick='deletePoll("${item.id}")'>Delete</button>
      `;
    }

    if(type === "announcement") {
      div.innerHTML = `
        <strong>${item.title}</strong>: ${item.body} 
        <button onclick='editAnnouncement("${item.id}")'>Edit</button>
        <button onclick='deleteAnnouncement("${item.id}")'>Delete</button>
      `;
    }

    container.appendChild(div);
  });
}

// FIRESTORE READ FUNCTIONS
async function loadEvents() {
  const snapshot = await getDocs(collection(db, "events"));
  const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderItem("events-list", events, "event");
}

async function loadPolls() {
  const snapshot = await getDocs(collection(db, "polls"));
  const polls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderItem("polls-list", polls, "poll");
}

async function loadAnnouncements() {
  const snapshot = await getDocs(collection(db, "announcements"));
  const anns = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderItem("announcements-list", anns, "announcement");
}

// ADMIN ACTIONS (CRUD)
window.editEvent = async (id) => {
  const newTitle = prompt("New Event Title:");
  if(!newTitle) return;
  await updateDoc(doc(db, "events", id), { title: newTitle });
  loadEvents();
};

window.deleteEvent = async (id) => {
  if(confirm("Delete this event?")) {
    await deleteDoc(doc(db, "events", id));
    loadEvents();
  }
};

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

window.editAnnouncement = async (id) => {
  const newTitle = prompt("New Announcement Title:");
  const newBody = prompt("New Announcement Body:");
  if(!newTitle && !newBody) return;
  const updateData = {};
  if(newTitle) updateData.title = newTitle;
  if(newBody) updateData.body = newBody;
  await updateDoc(doc(db, "announcements", id), updateData);
  loadAnnouncements();
};

// INITIAL LOAD
loadEvents();
loadPolls();
loadAnnouncements();
