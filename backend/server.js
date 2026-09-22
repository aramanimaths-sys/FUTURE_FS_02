const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Lead = require("./models/Lead");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => console.log("MongoDB connection error:", error));

// Test route
app.get("/", (req, res) => {
    res.send("Client Lead CRM API is running!");
});

// GET all leads
app.get("/api/leads", async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leads" });
    }
});

// POST a new lead
app.post("/api/leads", async (req, res) => {
    try {
        const lead = new Lead(req.body);
        const savedLead = await lead.save();

        res.status(201).json(savedLead);
    } catch (error) {
        res.status(400).json({ message: "Error creating lead" });
    }
});

// UPDATE a lead
app.put("/api/leads/:id", async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedLead);
    } catch (error) {
        res.status(400).json({ message: "Error updating lead" });
    }
});

// DELETE a lead
app.delete("/api/leads/:id", async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);

        res.json({ message: "Lead deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting lead" });
    }
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});