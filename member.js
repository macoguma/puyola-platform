import { db } from "./firebase-config.js";
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// EVENTS
async function loadEvents() {
  const container = document.getElementById("events-list");
  container.innerHTML = "";
  const snapshot = await getDocs(collection(db, "events"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = `${data.title || "No Title"} - ${data.date || "No Date"}`;
    container.appendChild(div);
  });
}

// POLLS
async function loadPolls() {
  const container = document.getElementById("polls-list");
  container.innerHTML = "";
  const snapshot = await getDocs(collection(db, "polls"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "item";
    const title = document.createElement("strong");
    title.textContent = data.title || "No Title";
    div.appendChild(title);

    if (data.status === "active" && data.options) {
      data.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.addEventListener("click", async () => {
          const votes = data.votes || [];
          votes.push(option);
          await updateDoc(doc(db, "polls", docSnap.id), { votes });
          alert(`You voted: ${option}`);
          loadPolls();
        });
        div.appendChild(btn);
      });
    } else {
      const closed = document.createElement("em");
      closed.textContent = "Poll closed";
      div.appendChild(closed);
    }

    container.appendChild(div);
  });
}

// ANNOUNCEMENTS
async function loadAnnouncements() {
  const container = document.getElementById("announcements-list");
  container.innerHTML = "";
  const snapshot = await getDocs(collection(db, "announcements"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<strong>${data.title || "No Title"}</strong>: ${data.body || ""}`;
    container.appendChild(div);
  });
}

// INITIAL LOAD
loadEvents();
loadPolls();
loadAnnouncements();
