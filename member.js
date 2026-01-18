import { db } from "./firebase-config.js";
import {
  collection, getDocs, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Create a unique browser ID to track votes
function getBrowserId() {
  let id = localStorage.getItem("puyola_browser_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("puyola_browser_id", id);
  }
  return id;
}

const browserId = getBrowserId();

async function loadEvents() {
  const snapshot = await getDocs(collection(db, "events"));
  const container = document.getElementById("events-list");
  container.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    container.innerHTML += `<div class="item"><strong>${data.title || "No Title"}</strong> - ${data.date || "No Date"}</div>`;
  });
}

async function loadPolls() {
  const snapshot = await getDocs(collection(db, "polls"));
  const container = document.getElementById("polls-list");
  container.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    // Check if user already voted
    const hasVoted = data.voters?.includes(browserId);

    let voteButtons = "";
    if (data.status === "active") {
      voteButtons = (data.options || []).map(opt => {
        return `<button class="voteBtn" data-poll="${docSnap.id}" data-opt="${opt}" ${hasVoted ? "disabled" : ""}>${opt}</button>`;
      }).join(" ");
    } else {
      voteButtons = `<em>Poll closed</em>`;
    }

    container.innerHTML += `
      <div class="item">
        <strong>${data.title || "No Title"}</strong> - ${data.status || "N/A"}
        <div>${voteButtons}</div>
      </div>
    `;
  });

  // Add event listeners to vote buttons
  document.querySelectorAll(".voteBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const pollId = btn.getAttribute("data-poll");
      const option = btn.getAttribute("data-opt");

      // Disable buttons immediately
      document.querySelectorAll(`button[data-poll="${pollId}"]`).forEach(b => b.disabled = true);

      const pollRef = doc(db, "polls", pollId);
      const pollSnap = await getDocs(collection(db, "polls"));
      const docSnap = pollSnap.docs.find(d => d.id === pollId);
      const data = docSnap.data();

      // Check if already voted
      if (data.voters?.includes(browserId)) {
        alert("You have already voted.");
        return;
      }

      // Update votes map
      const votes = data.votes || {};
      votes[option] = (votes[option] || 0) + 1;

      // Update voters array
      const voters = data.voters || [];
      voters.push(browserId);

      await updateDoc(pollRef, { votes, voters });

      alert(`You voted: ${option}`);
      loadPolls();
    });
  });
}

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
