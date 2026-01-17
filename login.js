// login.js - Hard-coded passwords
document.getElementById("loginBtn").addEventListener("click", () => {
  const password = document.getElementById("password").value.trim();

  if(password === "Puyola@0032542025"){
    // Admin login
    window.location.href = "admin.html";
  } else if(password === "Puyola@2025"){
    // Member login
    window.location.href = "member.html";
  } else {
    alert("Incorrect password!");
  }
});
