
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("formMessage").textContent = "Thanks for your message!";
  this.reset(); // Clears the form
});
function toggleDarkMode() {
  document.body.classList.toggle("dark");
 let btn = document.querySelector(".toggle-btn");
  if (document.body.classList.contains("dark")) {
    btn.textContent = "☀️";
  } else {
    btn.textContent = "🌙";
  }
}
fetch("https://api.github.com/users/DIVYAHARINA/repos")
.then(res => res.json())
.then(data => {
  let list = document.getElementById("repoList");

  data.slice(0,5).forEach(repo => {
    let li = document.createElement("li");
    li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
    list.appendChild(li);
  });
});
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;

  if (name === "") {
    alert("Enter name");
    return;
  }
  if(name.length < 3) {
    alert("Name must be at least 3 characters");
    return;
  }  
  if(name ==="number") {
    alert("Name cannot be a number");
    return;
  }

  if (!email.includes("@")) {
    alert("Enter valid email");
    return;
  }

  document.getElementById("formMessage").textContent = "Message sent!";
  this.reset();
});