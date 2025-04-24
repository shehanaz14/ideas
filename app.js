const API_URL = "https://idea-collectorr-1.onrender.com/api/ideas";

document.getElementById("ideaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!title || !description || !email) return alert("Please fill all fields.");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, email })
  });

  const data = await response.json();
  alert(data.message || "Idea submitted!");
  document.getElementById("ideaForm").reset();
  loadIdeas();
});

async function loadIdeas() {
  const res = await fetch(API_URL);
  const ideas = await res.json();
  const container = document.getElementById("ideasList");
  container.innerHTML = "";

  ideas.reverse().forEach((idea) => {
    const card = document.createElement("div");
    card.className = "ideaCard";

    const guidelines = generateGuidelines(idea.title, idea.description);
    const skills = generateSkills(idea.title, idea.description);

    card.innerHTML = `
      <h3 contenteditable="false" class="title">${idea.title}</h3>
      <p contenteditable="false" class="desc">${idea.description}</p>
      <p class="email">Submitted by: ${idea.email}</p>
      <h4>Guidelines to implement:</h4>
      <ul>${guidelines.map(step => `<li>${step}</li>`).join("")}</ul>
      <h4>Skills Required:</h4>
      <ul>${skills.map(skill => `<li>${skill}</li>`).join("")}</ul>
      <button onclick="editIdea(this, '${idea._id}')">✏️ Edit</button>
    `;
    container.appendChild(card);
  });
}

async function editIdea(button, id) {
  const card = button.parentElement;
  const titleEl = card.querySelector(".title");
  const descEl = card.querySelector(".desc");

  if (button.textContent.includes("Edit")) {
    titleEl.setAttribute("contenteditable", "true");
    descEl.setAttribute("contenteditable", "true");
    titleEl.focus();
    button.textContent = "💾 Save";
  } else {
    const updatedTitle = titleEl.textContent.trim();
    const updatedDesc = descEl.textContent.trim();

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: updatedTitle, description: updatedDesc })
    });

    button.textContent = "✏️ Edit";
    titleEl.setAttribute("contenteditable", "false");
    descEl.setAttribute("contenteditable", "false");
    alert("Idea updated successfully!");
    loadIdeas();
  }
}



function generateGuidelines(title, description) {
  const lower = (title + description).toLowerCase();
  const steps = [
    "Research and define your target problem.",
    "Gather necessary resources and tools.",
    "Design a basic prototype or mockup.",
    "Test with real or simulated users.",
    "Refine based on feedback and deploy."
  ];

  if (lower.includes("ai")) steps.push("Train and validate an AI model with relevant data.");
  if (lower.includes("app")) steps.push("Develop UI using React Native or Flutter.");
  if (lower.includes("iot")) steps.push("Integrate IoT sensors and test real-world functionality.");
  if (lower.includes("waste") || lower.includes("management")) steps.push("Coordinate with municipal systems and sensors.");

  return steps;
}


function generateSkills(title, description) {
  const lower = (title + description).toLowerCase();
  const skills = ["Problem Solving", "Project Planning", "Documentation"];

  if (lower.includes("ai")) skills.push("Machine Learning", "Python", "Data Preprocessing");
  if (lower.includes("app")) skills.push("React Native", "Flutter", "Mobile App UI/UX");
  if (lower.includes("iot")) skills.push("Arduino/Raspberry Pi", "Sensor Integration");
  if (lower.includes("web")) skills.push("HTML", "CSS", "JavaScript", "API Integration");
  if (lower.includes("smart") || lower.includes("management")) skills.push("System Architecture", "Cloud Integration");

  return [...new Set(skills)];
}

window.onload = loadIdeas;
