require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Course = require("../models/Course");
const Offering = require("../models/Offering");
const Registration = require("../models/Registration");
const Record = require("../models/Record");

async function seedDatabase() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env file.");
        }

        console.log("Connecting to MongoDB...");
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to: ${conn.connection.host} (${conn.connection.name})`);

        console.log("Cleaning existing collections...");
        await Promise.all([
            User.deleteMany({}),
            Course.deleteMany({}),
            Offering.deleteMany({}),
            Registration.deleteMany({}),
            Record.deleteMany({}),
        ]);

        console.log("Seeding Users...");
        const defaultPasswordHash = await bcrypt.hash("Password123!", 10);

        const advisor = await User.create({
            name: "Dr. Alan Turing",
            email: "alan.turing@stamford.edu",
            passwordHash: defaultPasswordHash,
            role: "advisor",
            studentId: null,
            advisorId: null,
            active: true,
        });

        const student1 = await User.create({
            name: "Thi Htoo Naing",
            email: "thihtoo@stamford.edu",
            passwordHash: defaultPasswordHash,
            role: "student",
            studentId: "2407160007",
            advisorId: advisor._id,
            active: true,
        });

        const student2 = await User.create({
            name: "Jane Smith",
            email: "jane.smith@stamford.edu",
            passwordHash: defaultPasswordHash,
            role: "student",
            studentId: "2407160008",
            advisorId: advisor._id,
            active: true,
        });

        // 2. Seed Courses
        console.log("Seeding Courses...");
        const courseITE220 = await Course.create({
            code: "ITE220",
            title: "Web Application Development",
            credits: 3,
            description: "Full-stack web application development using modern technologies.",
        });

        const courseITE221 = await Course.create({
            code: "ITE221",
            title: "Database Systems",
            credits: 3,
            description: "Relational and NoSQL database modeling, querying, and optimization.",
        });

        const courseGEN101 = await Course.create({
            code: "GEN101",
            title: "English Communication",
            credits: 3,
            description: "Academic reading, writing, and professional oral communication.",
        });

        // 3. Seed Offerings (Standard Term Format: YYYY-TX e.g. 2026-T1)
        console.log("Seeding Offerings...");
        const offeringITE220_S1 = await Offering.create({
            courseId: courseITE220._id,
            term: "2026-T1",
            section: 1,
            day: "Monday",
            startTime: "09:00",
            endTime: "12:00",
            room: "Lab 301",
            instructor: "Ajarn Somchai",
            seats: 30,
            seatsTaken: 1,
            addDropOpen: true,
        });

        const offeringITE221_S1 = await Offering.create({
            courseId: courseITE221._id,
            term: "2026-T1",
            section: 1,
            day: "Wednesday",
            startTime: "13:00",
            endTime: "16:00",
            room: "Lab 302",
            instructor: "Dr. Alan Turing",
            seats: 30,
            seatsTaken: 1,
            addDropOpen: true,
        });

        // 4. Seed Registrations
        console.log("Seeding Registrations...");
        await Registration.create({
            studentId: student1._id,
            offeringId: offeringITE220_S1._id,
            term: "2026-T1",
            status: "registered",
        });

        await Registration.create({
            studentId: student2._id,
            offeringId: offeringITE221_S1._id,
            term: "2026-T1",
            status: "registered",
        });

        // 5. Seed Academic Records (Past completed courses, e.g., 2025-T3)
        console.log("Seeding Records...");
        await Record.create({
            studentId: student1._id,
            courseId: courseGEN101._id,
            term: "2025-T3",
            grade: "A",
        });

        await Record.create({
            studentId: student2._id,
            courseId: courseGEN101._id,
            term: "2025-T3",
            grade: "B+",
        });

        console.log(" Database seeded successfully!");
        console.log("-----------------------------------------");
        console.log("Summary of Seeded Data:");
        console.log(`- Users: 3 (1 Advisor, 2 Students)`);
        console.log(`- Courses: 3 (ITE220, ITE221, GEN101)`);
        console.log(`- Offerings: 2 (Term 2026-T1)`);
        console.log(`- Registrations: 2`);
        console.log(`- Records: 2`);
        console.log("Default user password: Password123!");
        console.log("-----------------------------------------");

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error(" Seed failed:", error);
        process.exit(1);
    }
}

seedDatabase();