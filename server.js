const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Define Schema and Model
const FormSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});
const FormModel = mongoose.model("FormSubmission", FormSchema);

// Handle Form Submission with Validation
app.post("/api/form", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validation: Check for missing fields
    if (!name) {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Validate phone format (can be adjusted to your needs)
    if (!validator.isMobilePhone(phone, 'en-GM', { strictMode: false })) {
      return res.status(400).json({ error: "Invalid phone number format." });
    }

    // Simulate processing delay (for loading spinner testing)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save form data to the database
    const newForm = new FormModel({ name, email, phone });
    await newForm.save();
    
    // Return success message
    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ error: "Error saving form data." });
  }
});

// Admin Dashboard: Fetch all form submissions
app.get("/api/submissions", async (req, res) => {
  try {
    const submissions = await FormModel.find();
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Error fetching submissions." });
  }
});

// Serve static files (for the "thank you" page)
app.use(express.static("public"));

// Start Server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));