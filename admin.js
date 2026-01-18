import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// --- EVENTS ---
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
        <button onclick="editEvent('${d.id}')">Edit</button>
        <button onclick="deleteEvent('${d.id}')">Delete</button>
        <button onclick="exportEvent('${d.id}')">Export</button>
      </div>
    `;
  });
}

window.addEventListener("load", loadEvents);

window.addEventListener("load", () => {
  loadPolls();
  loadAnnouncements();
});

window.addEventListener("load", loadAnnouncements);

window.addEventListener("load", loadEvents);

window.addEventListener("load", loadPolls);

window.addEventListener("load", loadAnnouncements);

// Add Event
window.addEventListener("load", () => {});

window.addEventListener("load", loadEvents);

window.addEventListener("load", loadPolls);

window.addEventListener("load", loadAnnouncements);

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

window.addEventListener("load", () => {});

// Add Event function
window.addEvent = async () => {
  const title = prompt("Event title:");
  const date = prompt("Event date (e.g. 2025-12-20):");

  if (!title) return;

  await addDoc(collection(db, "events"), {
    title,
    date,
  });

  loadEvents();
};

// Edit Event
window.editEvent = async (id) => {
  const title = prompt("New title:");
  const date = prompt("New date:");
  if (!title) return;

  await updateDoc(doc(db, "events", id), { title, date });
  loadEvents();
};

// Delete Event
window.deleteEvent = async (id) => {
  if (!confirm("Delete event?")) return;
  await deleteDoc(doc(db, "events", id));
  loadEvents();
};

// Export Event
window.exportEvent = async (id) => {
  const d = await getDocs(collection(db, "events"));
  const docData = d.docs.find(x => x.id === id).data();
  const csv = `title,date\n${docData.title},${docData.date}`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "event.csv";
  a.click();
};

// --- POLLS ---
async function loadPolls() {
  const snapshot = await getDocs(collection(db, "polls"));
  const list = document.getElementById("polls-list");
  list.innerHTML = "";

  snapshot.forEach(d => {
    const data = d.data();
    list.innerHTML += `
      <div class="item">
        <strong>${data.title || "No Title"}</strong>
        <div>Status: ${data.status || "inactive"}</div>
        <button onclick="closePoll('${d.id}')">Close Poll</button>
        <button onclick="deletePoll('${d.id}')">Delete Poll</button>
        <button onclick="exportPoll('${d.id}')">Export</button>
      </div>
    `;
  });
}

// Add Poll
window.addPoll = async () => {
  const title = prompt("Poll title:");
  const options = prompt("Options (comma separated):");
  if (!title || !options) return;

  await addDoc(collection(db, "polls"), {
    title,
    options: options.split(",").map(x => x.trim()),
    votes: [],
    status: "active",
  });

  loadPolls();
};

// Close Poll
window.closePoll = async (id) => {
  await updateDoc(doc(db, "polls", id), { status: "closed" });
  loadPolls();
};

// Delete Poll
window.deletePoll = async (id) => {
  if (!confirm("Delete poll?")) return;
  await deleteDoc(doc(db, "polls", id));
  loadPolls();
};

// Export Poll
window.exportPoll = async (id) => {
  const d = await getDocs(collection(db, "polls"));
  const docData = d.docs.find(x => x.id === id).data();
  const csv = `title,status,options,votes\n${docData.title},${docData.status},"${docData.options.join("|")}","${docData.votes.join("|")}"`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "poll.csv";
  a.click();
};

// --- ANNOUNCEMENTS ---
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
        <button onclick="editAnnouncement('${d.id}')">Edit</button>
        <button onclick="deleteAnnouncement('${d.id}')">Delete</button>
        <button onclick="exportAnnouncement('${d.id}')">Export</button>
      </div>
    `;
  });
}

// Add Announcement
window.addAnnouncement = async () => {
  const title = prompt("Announcement title:");
  const body = prompt("Announcement body:");
  if (!title || !body) return;

  await addDoc(collection(db, "announcements"), {
    title,
    body,
  });

  loadAnnouncements();
};

// Edit Announcement
window.editAnnouncement = async (id) => {
  const title = prompt("New title:");
  const body = prompt("New body:");
  if (!title || !body) return;

  await updateDoc(doc(db, "announcements", id), { title, body });
  loadAnnouncements();
};

// Delete Announcement
window.deleteAnnouncement = async (id) => {
  if (!confirm("Delete announcement?")) return;
  await deleteDoc(doc(db, "announcements", id));
  loadAnnouncements();
};

// Export Announcement
window.exportAnnouncement = async (id) => {
  const d = await getDocs(collection(db, "announcements"));
  const docData = d.docs.find(x => x.id === id).data();
  const csv = `title,body\n${docData.title},${docData.body}`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "announcement.csv";
  a.click();
};
