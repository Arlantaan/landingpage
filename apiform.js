const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const validator = require("validator");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet()); // Security middleware for setting HTTP headers

// Rate Limiting - Allow a maximum of 5 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter); // Apply rate limiter to all routes

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

// Handle Form Submission with Specific Validation
app.post("/api/form", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validation - Check for missing fields
    if (!name) {
      return res.status(400).json({ error: "Please fill in your name." });
    }
    if (!email) {
      return res.status(400).json({ error: "Please fill in your email." });
    }
    if (!phone) {
      return res.status(400).json({ error: "Please fill in your phone number." });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Validate phone number format (adjust based on requirements)
    if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
      return res.status(400).json({ error: "Invalid phone number format." });
    }

    const newForm = new FormModel({ name, email, phone });
    await newForm.save();
    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ error: "Error saving form data." });
  }
});

// Start Server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
