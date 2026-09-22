const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        trim: true
    },

    company: {
        type: String,
        trim: true
    },

    source: {
        type: String
    },

    status: {
        type: String,
        enum: ["New", "Contacted", "Converted"],
        default: "New"
    },

    notes: {
        type: String
    },

    followUpDate: {
        type: Date
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Lead", leadSchema);