import { db } from "./firebase-config.js";
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// EVENTS
window.addEvent = async () => {
  await addDoc(collection(db,"events"),{
    title: eventTitle.value,
    date: eventDate.value
  });
  loadEvents();
};

async function loadEvents(){
  const snap = await getDocs(collection(db,"events"));
  events-list.innerHTML="";
  snap.forEach(d=>{
    events-list.innerHTML+=`
      <div class="item">
        ${d.data().title} - ${d.data().date}
        <button onclick="deleteItem('events','${d.id}')">Delete</button>
      </div>`;
  });
}

// POLLS
window.addPoll = async () => {
  await addDoc(collection(db,"polls"),{
    title: pollTitle.value,
    status:"active",
    options: pollOptions.value.split(","),
    votes:[]
  });
  loadPolls();
};

async function loadPolls(){
  const snap = await getDocs(collection(db,"polls"));
  polls-list.innerHTML="";
  snap.forEach(d=>{
    polls-list.innerHTML+=`
      <div class="item">
        ${d.data().title} (${d.data().status})
        <button onclick="closePoll('${d.id}')">Close</button>
      </div>`;
  });
}

window.closePoll = async id=>{
  await updateDoc(doc(db,"polls",id),{status:"closed"});
  loadPolls();
};

// ANNOUNCEMENTS
window.addAnnouncement = async ()=>{
  await addDoc(collection(db,"announcements"),{
    title: annTitle.value,
    body: annBody.value
  });
  loadAnnouncements();
};

async function loadAnnouncements(){
  const snap = await getDocs(collection(db,"announcements"));
  announcements-list.innerHTML="";
  snap.forEach(d=>{
    announcements-list.innerHTML+=`
      <div class="item">
        <b>${d.data().title}</b> - ${d.data().body}
        <button onclick="deleteItem('announcements','${d.id}')">Delete</button>
      </div>`;
  });
}

window.deleteItem = async (col,id)=>{
  await deleteDoc(doc(db,col,id));
  loadEvents(); loadPolls(); loadAnnouncements();
};

loadEvents(); loadPolls(); loadAnnouncements();
