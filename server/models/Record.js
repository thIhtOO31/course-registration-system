const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Student reference is required"],
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
        },
        term: {
            type: String,
            required: [true, "Term is required"],
            trim: true,
        },
        grade: {
            type: String,
            required: [true, "Grade is required"],
            trim: true,
            uppercase: true,
            enum: {
                values: ["A", "B+", "B", "C+", "C", "D+", "D", "F", "W"],
                message: "{VALUE} is not a valid grade",
            },
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate grade record for the same student, course, and term
recordSchema.index({ studentId: 1, courseId: 1, term: 1 }, { unique: true });

module.exports = mongoose.model("Record", recordSchema);