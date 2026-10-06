const mongoose = require("mongoose");

const offeringSchema = new mongoose.Schema(
    {
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
        section: {
            type: Number,
            required: true,
            default: 1,
        },
        day: {
            type: String,
            required: true,
            trim: true,
        },
        startTime: {
            type: String,
            required: true,
            trim: true,
        },
        endTime: {
            type: String,
            required: true,
            trim: true,
        },
        room: {
            type: String,
            required: true,
            trim: true,
        },
        instructor: {
            type: String,
            required: true,
            trim: true,
        },
        seats: {
            type: Number,
            required: true,
            min: 1,
        },
        seatsTaken: {
            type: Number,
            default: 0,
            min: 0,
        },
        addDropOpen: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Offering", offeringSchema);