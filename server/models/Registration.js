const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        offeringId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Offering",
            required: true,
        },
        term: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["registered", "pending", "dropped", "approved"],
            default: "registered",
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate active registration for the same student and offering
registrationSchema.index({ studentId: 1, offeringId: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);