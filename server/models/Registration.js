const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Student reference is required"],
        },
        offeringId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Offering",
            required: [true, "Offering reference is required"],
        },
        term: {
            type: String,
            required: [true, "Term is required"],
            trim: true,
        },
        status: {
            type: String,
            enum: {
                values: ["registered", "dropped"],
                message: "{VALUE} is not a valid registration status",
            },
            default: "registered",
            required: [true, "Registration status is required"],
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

// Prevent duplicate registration for the same student and offering
registrationSchema.index({ studentId: 1, offeringId: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);