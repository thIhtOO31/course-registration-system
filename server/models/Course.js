const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Course code is required"],
            unique: true,
            trim: true,
            uppercase: true,
        },
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
        },
        credits: {
            type: Number,
            required: [true, "Credits are required"],
            min: [1, "Credits must be at least 1"],
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        prerequisites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Course", courseSchema);