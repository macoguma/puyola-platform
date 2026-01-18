// login.js - Hard-coded passwords + user role + memberId

function getOrCreateMemberId() {
  let id = localStorage.getItem("puyola_member_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("puyola_member_id", id);
  }
  return id;
}

document.getElementById("loginBtn").addEventListener("click", () => {
  const password = document.getElementById("password").value.trim();

  if (password === "Puyola@0032542025") {
    localStorage.setItem("puyola_role", "admin");
    window.location.href = "admin.html";
  } 
  else if (password === "Puyola@2025") {
    localStorage.setItem("puyola_role", "member");
    getOrCreateMemberId();
    window.location.href = "member.html";
  } 
  else {
    alert("Incorrect password!");
  }
});

// Show/Hide password
document.getElementById("showPassword").addEventListener("change", () => {
  const pwd = document.getElementById("password");
  pwd.type = pwd.type === "password" ? "text" : "password";
});
