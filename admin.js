import { db } from "./firebase-config.js";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// UTILITY: Clear and render items with proper event listeners
async function loadEvents() {
  const container = document.getElementById("events-list");
  container.innerHTML = "";
  const snapshot = await getDocs(collection(db, "events"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<strong>${data.title || "No Title"}</strong> - ${data.date || "No Date"}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", async () => {
      const newTitle = prompt("New Event Title:", data.title);
      if (!newTitle) return;
      await updateDoc(doc(db, "events", docSnap.id), { title: newTitle });
      loadEvents();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      if (confirm("Delete this event?")) {
        await deleteDoc(doc(db, "events", docSnap.id));
        loadEvents();
      }
    });

    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    container.appendChild(div);
  });
}

async function loadPolls() {
  const container = document.getElementById("polls-list");
  container.innerHTML = "";
  const snapshot = await getDocs(collection(db, "polls"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<strong>${data.title || "No Title"}</strong> - Status: ${data.status || "N/A"}`;

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", async () => {
      await updateDoc(doc(db, "polls", docSnap.id), { status: "closed" });
      loadPolls();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      if (confirm("Delete this poll?")) {
        await deleteDoc(doc(db, "polls", docSnap.id));
        loadPolls();
      }
    });

    div.appendChild(closeBtn);
    div.appendChild(deleteBtn);
    container.appendChild(div);
  });
}

async function loadAnnouncements() {
  const container = document.getElementById("announcements-list");
  container.innerHTML = "";
  const snapshot = await getDocs(collection(db, "announcements"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<strong>${data.title || "No Title"}</strong>: ${data.body || ""}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", async () => {
      const newTitle = prompt("New Announcement Title:", data.title);
      const newBody = prompt("New Announcement Body:", data.body);
      if (!newTitle && !newBody) return;
      const updateData = {};
      if (newTitle) updateData.title = newTitle;
      if (newBody) updateData.body = newBody;
      await updateDoc(doc(db, "announcements", docSnap.id), updateData);
      loadAnnouncements();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      if (confirm("Delete this announcement?")) {
        await deleteDoc(doc(db, "announcements", docSnap.id));
        loadAnnouncements();
      }
    });

    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    container.appendChild(div);
  });
}

// INITIAL LOAD
loadEvents();
loadPolls();
loadAnnouncements();
