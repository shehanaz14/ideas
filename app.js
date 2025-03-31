// Auto-login if userEmail is saved
window.onload = () => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      userEmail = storedEmail;
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('appSection').style.display = 'block';
      loadIdeas();
    }
  };
  
let userEmail = '';

function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
  
    if (email && password) {
      userEmail = email;
      // ✅ Store email in localStorage
      localStorage.setItem('userEmail', userEmail);
  
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('appSection').style.display = 'block';
      loadIdeas();
    } else {
      alert("Please enter email and password.");
    }
  }
 
  

document.getElementById("ideaForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  const response = await fetch("http://localhost:5000/api/ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, email: userEmail })
  });

  if (response.ok) {
    document.getElementById("ideaForm").reset();
    loadIdeas();
  } else {
    alert("Error submitting idea");
  }
});

async function loadIdeas() {
  const response = await fetch("http://localhost:5000/api/ideas");
  const ideas = await response.json();
  const ideasList = document.getElementById("ideasList");
  ideasList.innerHTML = "";

  ideas.forEach(idea => {
    const div = document.createElement("div");
    div.classList.add("idea-container");
    div.innerHTML = `
      <h3>${idea.title}</h3>
      <p>${idea.description}</p>
      <p><strong>This idea was submitted by:</strong> ${idea.email}</p>
      <p class="guidelines">Steps:</p>
      <ul>${idea.steps.map(step => `<li>${step}</li>`).join("")}</ul>
      <p class="skills-title">Skills & Technologies:</p>
      <ul>${idea.skills.map(skill => `<li>${skill}</li>`).join("")}</ul>
      ${userEmail === idea.email ? `<button onclick="editIdea('${idea._id}', '${idea.title}', '${idea.description}')">Edit</button>` : ""}
    `;
    ideasList.appendChild(div);
  });
}

async function editIdea(id, currentTitle, currentDesc) {
  const newTitle = prompt("Edit Title:", currentTitle);
  const newDesc = prompt("Edit Description:", currentDesc);
  if (newTitle && newDesc) {
    await fetch(`http://localhost:5000/api/ideas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, description: newDesc })
    });
    loadIdeas();
  }
}
