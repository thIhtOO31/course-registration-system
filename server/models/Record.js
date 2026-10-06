const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        term: {
            type: String,
            required: true,
            trim: true,
        },
        grade: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
            enum: ["A", "B+", "B", "C+", "C", "D+", "D", "F", "W", "I", "P"],
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate grade record for the same student, course, and term
recordSchema.index({ studentId: 1, courseId: 1, term: 1 }, { unique: true });

module.exports = mongoose.model("Record", recordSchema);