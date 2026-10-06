const mongoose = require("mongoose");

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

function toMinutes(timeStr) {
    if (!timeStr || typeof timeStr !== "string") return null;
    const parts = timeStr.split(":");
    if (parts.length !== 2) return null;
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

const offeringSchema = new mongoose.Schema(
    {
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
        section: {
            type: Number,
            required: [true, "Section is required"],
            default: 1,
            min: [1, "Section must be at least 1"],
        },
        day: {
            type: String,
            required: [true, "Day is required"],
            trim: true,
        },
        startTime: {
            type: String,
            required: [true, "Start time is required"],
            trim: true,
            match: [timeRegex, "Start time must be in HH:mm format (e.g. 09:00)"],
        },
        endTime: {
            type: String,
            required: [true, "End time is required"],
            trim: true,
            match: [timeRegex, "End time must be in HH:mm format (e.g. 12:00)"],
            validate: {
                validator: function (val) {
                    const start =
                        this.startTime ||
                        (this.getUpdate &&
                            (this.getUpdate().startTime ||
                                (this.getUpdate().$set && this.getUpdate().$set.startTime)));
                    if (start && val && timeRegex.test(start) && timeRegex.test(val)) {
                        return toMinutes(val) > toMinutes(start);
                    }
                    return true;
                },
                message: "End time must be after start time",
            },
        },
        room: {
            type: String,
            required: [true, "Room is required"],
            trim: true,
        },
        instructor: {
            type: String,
            required: [true, "Instructor is required"],
            trim: true,
        },
        seats: {
            type: Number,
            required: [true, "Seats / capacity is required"],
            min: [0, "Capacity must be non-negative"],
            alias: "capacity",
        },
        seatsTaken: {
            type: Number,
            default: 0,
            min: [0, "Seats taken must be non-negative"],
        },
        addDropOpen: {
            type: Boolean,
            default: true,
        },
        addDropClosesAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Map validation errors on seats to capacity alias if accessed via capacity
offeringSchema.post("validate", function (error, doc, next) {
    if (error && error.errors && error.errors.seats && !error.errors.capacity) {
        error.errors.capacity = error.errors.seats;
    }
    if (typeof next === "function") next(error);
});

// Compound unique index ensuring uniqueness of course, term, and section
offeringSchema.index({ courseId: 1, term: 1, section: 1 }, { unique: true });

module.exports = mongoose.model("Offering", offeringSchema);