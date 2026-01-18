document.getElementById("loginBtn").addEventListener("click", () => {
  const password = document.getElementById("password").value.trim();

  if (password === "Puyola@0032542025") {
    window.location.href = "admin.html";
  } else if (password === "Puyola@2025") {
    window.location.href = "member.html";
  } else {
    alert("Incorrect password!");
  }
});

document.getElementById("showPassword").addEventListener("change", () => {
  const pwd = document.getElementById("password");
  pwd.type = pwd.type === "password" ? "text" : "password";
});
