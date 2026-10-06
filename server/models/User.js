const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
        passwordHash: {
            type: String,
            required: [true, "Password hash is required"],
        },
        role: {
            type: String,
            enum: {
                values: ["student", "advisor", "admin"],
                message: "{VALUE} is not a valid role",
            },
            default: "student",
            required: [true, "Role is required"],
        },
        studentId: {
            type: String,
            trim: true,
            default: null,
            required: [
                function () {
                    const role =
                        this.role ||
                        (this.getUpdate &&
                            (this.getUpdate().role ||
                                (this.getUpdate().$set && this.getUpdate().$set.role)));
                    return role === "student";
                },
                "Student ID is required for students",
            ],
        },
        advisorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure unique studentId for students, while avoiding duplicate key conflicts on nonstudent accounts
userSchema.index(
    { studentId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            studentId: { $type: "string" },
        },
    }
);

module.exports = mongoose.model("User", userSchema);