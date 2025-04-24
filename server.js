const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors({origin:"https://ideacollectorr.netlify.app"}));


mongoose.connect('mongodb+srv://shehanaz1402:RQSIVPJIwxiPL8da@cluster0.zp4zw5e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));


const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true },
  steps: [String],
  skills: [String]
});

const Idea = mongoose.model("Idea", ideaSchema);


function generateGuidelines(title) {
  const steps = [
    "Research the core concept and validate its feasibility.",
    "Identify the required technologies and tools.",
    "Build a prototype to test the idea.",
    "Iterate based on feedback and refine the product.",
    "Launch and market the final version."
  ];
  const skills = ["Project Management", "Problem-Solving", "Software Development", "Business Strategy"];

  if (title.toLowerCase().includes("ai")) {
    steps.push("Train AI models using data related to your idea.");
    skills.push("Machine Learning", "Python (TensorFlow, PyTorch)", "Data Science");
  }
  if (title.toLowerCase().includes("app")) {
    steps.push("Develop the app using React Native or Flutter.");
    skills.push("UI/UX Design", "React Native", "Flutter", "App Deployment");
  }
  return { steps, skills };
}


app.post("/api/ideas", async (req, res) => {
  try {
    const { title, description, email } = req.body;
    if (!title || !description || !email) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingIdea = await Idea.findOne({ title, description });
    if (existingIdea) {
      return res.status(200).json({ message: "Idea already exists!" });
    }

    const { steps, skills } = generateGuidelines(title);
    const idea = new Idea({ title, description, email, steps, skills });

    await idea.save();
    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


app.get("/api/ideas", async (req, res) => {
  try {
    const ideas = await Idea.find();
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ideas", error });
  }
});


app.put("/api/ideas/:id", async (req, res) => {
  try {
    const { title, description } = req.body;

    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true } // Returns the updated document
    );

    if (!updatedIdea) {
      return res.status(404).json({ message: "Idea not found!" });
    }

    res.json({ message: "Idea updated!", updatedIdea });
  } catch (error) {
    res.status(500).json({ message: "Error updating idea", error });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
