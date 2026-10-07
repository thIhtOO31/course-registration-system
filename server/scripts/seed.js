require("dotenv").config();
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Course = require("../models/Course");
const Offering = require("../models/Offering");
const Registration = require("../models/Registration");
const Record = require("../models/Record");

// =============================================================================
// D5 — COURSE CATALOGUE & SECTION DEFINITIONS
// Term: 2026-1  (format YYYY-1/2/3 per team contract)
//
// Source note: CSC220 "Web Development II" is taken verbatim from the
// CSC220 Final Project Brief supplied by the lecturer.  All other codes
// (CSC110, CSC120, CSC150, CSC200, CSC210, CSC230, CSC240, CSC250, MTH101)
// are internally-consistent demo codes invented for this project and do NOT
// appear in a verified external curriculum document.  The curriculum source
// is documented in docs/checks/database.md.
//
// Add/drop is CLOSED on every section (addDropOpen: false, addDropClosesAt:
// null) so that F9 can demonstrate opening it with a current future date.
//
// D7 will overwrite seatsTaken by counting real Registration rows after
// inserting them.  NEVER set seatsTaken > 0 manually here.
// =============================================================================

const CURRENT_TERM = "2026-1";

// ---------------------------------------------------------------------------
// CATALOGUE  (10 courses)
// CSC250 has no 2026-1 offering — satisfies "catalogue course / no section".
// _key is a seed-internal lookup handle, not stored to the database.
// ---------------------------------------------------------------------------
const COURSE_DEFS = [
    {
        _key:        "CSC110",
        code:        "CSC110",
        title:       "Introduction to Programming",
        credits:     3,
        description: "Fundamental programming concepts using Python: variables, control flow, functions and basic data structures.",
    },
    {
        _key:        "CSC120",
        code:        "CSC120",
        title:       "Data Structures",
        credits:     3,
        description: "Arrays, linked lists, stacks, queues, trees and graphs with algorithmic analysis.",
    },
    {
        _key:        "CSC150",
        code:        "CSC150",
        title:       "Computer Networks",
        credits:     3,
        description: "OSI model, TCP/IP protocols, routing, switching and network security fundamentals.",
    },
    {
        _key:        "CSC200",
        code:        "CSC200",
        title:       "Object-Oriented Programming",
        credits:     3,
        description: "OOP principles in Java: encapsulation, inheritance, polymorphism and design patterns.",
    },
    {
        _key:        "CSC210",
        code:        "CSC210",
        title:       "Database Fundamentals",
        credits:     3,
        description: "Relational model, SQL, normalisation, transactions and an introduction to MongoDB.",
    },
    {
        // Source: CSC220 Final Project Brief supplied by the lecturer (confirmed title)
        _key:        "CSC220",
        code:        "CSC220",
        title:       "Web Development II",
        credits:     3,
        description: "Full-stack web development: REST APIs with Node/Express, React front-end and MongoDB Atlas.",
    },
    {
        _key:        "CSC230",
        code:        "CSC230",
        title:       "Operating Systems",
        credits:     3,
        description: "Process management, memory management, file systems and concurrency.",
    },
    {
        _key:        "CSC240",
        code:        "CSC240",
        title:       "Software Testing",
        credits:     3,
        description: "Unit, integration and system testing; TDD; automated test frameworks and CI basics.",
    },
    {
        // CATALOGUE-ONLY — no 2026-1 offering (D5 requirement: one course with no current-term section)
        _key:        "CSC250",
        code:        "CSC250",
        title:       "Software Engineering",
        credits:     3,
        description: "SDLC, Agile/Scrum, UML, requirements analysis, project planning and code review.",
    },
    {
        _key:        "MTH101",
        code:        "MTH101",
        title:       "Mathematics for Computing",
        credits:     3,
        description: "Discrete mathematics, logic, set theory, combinatorics and probability for CS students.",
    },
];

// ---------------------------------------------------------------------------
// SECTION DEFINITIONS  (12 sections, term 2026-1)
//
// Stable case names for use in test docs, D6 histories and D7 registrations:
//
//   CLASH_A      — CSC220 S1  Mon 09:00-11:00  ← clashes with CLASH_B
//   CLASH_B      — CSC110 S1  Mon 10:00-12:00  ← overlaps CLASH_A 10-11
//   BACK_TO_BACK — CSC120 S1  Mon 11:00-13:00  ← immediately after CLASH_A
//   DIFF_DAY     — CSC150 S1  Wed 09:00-11:00  ← separate day; no clash
//   TWO_SECTION  — CSC220 S2  Tue 13:00-15:00  ← second section of CSC220
//   FULL_DEMO    — CSC210 S1  cap 3; D7 registers 3 students → full
//   ONE_LEFT     — CSC200 S1  cap 25; D7 registers 24 → one seat left
//   OPEN_A…E     — remaining open sections for normal registration demos
//
// seatsTaken defaults to 0; D7 increments via real Registration inserts.
// addDropOpen: false on ALL sections; F9 reopens with a future date.
// ---------------------------------------------------------------------------
const OFFERING_DEFS = [
    // ── Schedule-case sections ────────────────────────────────────────────
    {
        _key:            "CLASH_A",
        courseKey:       "CSC220",
        section:         1,
        day:             "Monday",
        startTime:       "09:00",
        endTime:         "11:00",
        room:            "IT-Lab 301",
        instructor:      "Ajarn Prawit Somboon",
        seats:           30,
        addDropOpen:     false,
        addDropClosesAt: null,
        // Stable note for test docs — do not remove
        _note: "CLASH_A: Mon 09:00-11:00 — clashes with CLASH_B (10:00-12:00)",
    },
    {
        _key:            "CLASH_B",
        courseKey:       "CSC110",
        section:         1,
        day:             "Monday",
        startTime:       "10:00",
        endTime:         "12:00",
        room:            "IT-Lab 302",
        instructor:      "Ajarn Kulpreeya Rattana",
        seats:           35,
        addDropOpen:     false,
        addDropClosesAt: null,
        _note: "CLASH_B: Mon 10:00-12:00 — overlaps CLASH_A window 10:00-11:00",
    },
    {
        _key:            "BACK_TO_BACK",
        courseKey:       "CSC120",
        section:         1,
        day:             "Monday",
        startTime:       "11:00",
        endTime:         "13:00",
        room:            "IT-Lab 303",
        instructor:      "Ajarn Manee Charoenwong",
        seats:           30,
        addDropOpen:     false,
        addDropClosesAt: null,
        _note: "BACK_TO_BACK: Mon 11:00-13:00 — immediately follows CLASH_A (ends 11:00)",
    },
    {
        _key:            "DIFF_DAY",
        courseKey:       "CSC150",
        section:         1,
        day:             "Wednesday",
        startTime:       "09:00",
        endTime:         "11:00",
        room:            "Net-Lab 201",
        instructor:      "Ajarn Siriporn Thongchai",
        seats:           30,
        addDropOpen:     false,
        addDropClosesAt: null,
        _note: "DIFF_DAY: Wed 09:00-11:00 — different day; no clash with Monday sections",
    },
    {
        // Second section of CSC220 — satisfies "at least one course with two sections"
        _key:            "TWO_SECTION",
        courseKey:       "CSC220",
        section:         2,
        day:             "Tuesday",
        startTime:       "13:00",
        endTime:         "15:00",
        room:            "IT-Lab 301",
        instructor:      "Ajarn Prawit Somboon",
        seats:           30,
        addDropOpen:     false,
        addDropClosesAt: null,
        _note: "TWO_SECTION: CSC220 S2 — second section of same course as CLASH_A",
    },
    // ── Capacity-case sections ────────────────────────────────────────────
    {
        // Deliberately small capacity so D7 fills it with exactly 3 registrations
        _key:            "FULL_DEMO",
        courseKey:       "CSC210",
        section:         1,
        day:             "Thursday",
        startTime:       "09:00",
        endTime:         "11:00",
        room:            "IT-Lab 304",
        instructor:      "Ajarn Nattapong Jirasak",
        seats:           3,
        addDropOpen:     false,
        addDropClosesAt: null,
        _note: "FULL_DEMO: cap 3 — D7 registers 3 students; tests seat-full rejection",
    },
    {
        // D7 registers 24 of 25 students → one seat left for save-check test
        _key:            "ONE_LEFT",
        courseKey:       "CSC200",
        section:         1,
        day:             "Tuesday",
        startTime:       "09:00",
        endTime:         "11:00",
        room:            "IT-Lab 305",
        instructor:      "Ajarn Chanya Wattana",
        seats:           25,
        addDropOpen:     false,
        addDropClosesAt: null,
        _note: "ONE_LEFT: cap 25 — D7 registers 24; one seat remains for boundary check",
    },
    // ── Open sections for normal registration demos ───────────────────────
    {
        _key:            "OPEN_A",
        courseKey:       "CSC230",
        section:         1,
        day:             "Wednesday",
        startTime:       "13:00",
        endTime:         "15:00",
        room:            "IT-Lab 306",
        instructor:      "Ajarn Somkid Boonsong",
        seats:           30,
        addDropOpen:     false,
        addDropClosesAt: null,
        _note: "OPEN_A: CSC230 — open seats, normal demo",
    },
    {
        _key:            "OPEN_B",
        courseKey:       "CSC240",
        section:         1,
        day:             "Thursday",
        startTime:       "13:00",
        endTime:         "15:00",
        room:            "IT-Lab 307",
        instructor:      "Ajarn Wanpen Sukhon",
        seats:           30,
        addDropOpen:     false,
        addDropClosesAt: null,
        _note: "OPEN_B: CSC240 — open seats, normal demo",
    },
    {
        _key:            "OPEN_C",
        courseKey:       "MTH101",
        section:         1,
        day:             "Friday",
        startTime:       "09:00",
        endTime:         "11:00",
        room:            "Class 101",
        instructor:      "Ajarn Decha Phanomwan",
        seats:           40,
        addDropOpen:     false,
        addDropClosesAt: null,
        _note: "OPEN_C: MTH101 — large room, open seats",
    },
    {
        _key:            "OPEN_D",
        courseKey:       "CSC110",
        section:         2,
        day:             "Friday",
        startTime:       "13:00",
        endTime:         "15:00",
        room:            "IT-Lab 302",
        instructor:      "Ajarn Kulpreeya Rattana",
        seats:           35,
        addDropOpen:     false,
        addDropClosesAt: null,
        _note: "OPEN_D: CSC110 S2 — second section, Friday afternoon",
    },
    {
        _key:            "OPEN_E",
        courseKey:       "CSC120",
        section:         2,
        day:             "Wednesday",
        startTime:       "11:00",
        endTime:         "13:00",
        room:            "IT-Lab 303",
        instructor:      "Ajarn Manee Charoenwong",
        seats:           30,
        addDropOpen:     false,
        addDropClosesAt: null,
        _note: "OPEN_E: CSC120 S2 — Wednesday mid-morning",
    },
];

// ---------------------------------------------------------------------------
// Named offering-key string constants — import from D6 / D7 to avoid typos.
// ---------------------------------------------------------------------------
const OFFERING_KEYS = {
    CLASH_A:      "CLASH_A",
    CLASH_B:      "CLASH_B",
    BACK_TO_BACK: "BACK_TO_BACK",
    DIFF_DAY:     "DIFF_DAY",
    TWO_SECTION:  "TWO_SECTION",
    FULL_DEMO:    "FULL_DEMO",
    ONE_LEFT:     "ONE_LEFT",
    OPEN_A:       "OPEN_A",
    OPEN_B:       "OPEN_B",
    OPEN_C:       "OPEN_C",
    OPEN_D:       "OPEN_D",
    OPEN_E:       "OPEN_E",
};

// ---------------------------------------------------------------------------
// D6 — FICTIONAL DEMO ACCOUNTS, HISTORIES AND CURRENT REGISTRATIONS
//
// This password is intentionally a test-only value. D7 must hash it before
// storing it as passwordHash; it is not a production credential.
// ---------------------------------------------------------------------------
const DEMO_TEST_PASSWORD = "DemoPass123!";

const ADVISOR_DEFS = [
    {
        _key: "ADVISOR1",
        name: "Dr. Linette Vale",
        email: "advisor1@example.com",
        role: "advisor",
        password: DEMO_TEST_PASSWORD,
        _note: "Fictional advisor used for demo account and student assignment.",
    },
    {
        _key: "ADVISOR2",
        name: "Dr. Arjun Suri",
        email: "advisor2@example.com",
        role: "advisor",
        password: DEMO_TEST_PASSWORD,
        _note: "Second fictional advisor; no real staff identity is used.",
    },
];

const ADMIN_DEFS = [
    {
        _key: "ADMIN1",
        name: "Admin Rowan Moss",
        email: "admin@example.com",
        role: "admin",
        password: DEMO_TEST_PASSWORD,
        _note: "Fictional admin used only for the demo login.",
    },
];

// Student IDs and emails are deliberately fabricated. Each student receives
// a deterministic three-course history from 2025-2 and 2025-3, using only the
// grades accepted by Record's schema.
const STUDENT_DEFS = [
    {
        _key: "DEMO001", studentId: "DEMO001", name: "Alicia Morrow",
        email: "student01@example.com", advisorKey: "ADVISOR1",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC110", grade: "F" },
            { term: "2025-2", courseKey: "CSC120", grade: "B" },
            { term: "2025-3", courseKey: "CSC220", grade: "A" },
        ],
    },
    {
        _key: "DEMO002", studentId: "DEMO002", name: "Brin Kestrel",
        email: "student02@example.com", advisorKey: "ADVISOR1",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC150", grade: "W" },
            { term: "2025-3", courseKey: "CSC230", grade: "W" },
            { term: "2025-3", courseKey: "CSC240", grade: "W" },
        ],
    },
    {
        _key: "DEMO003", studentId: "DEMO003", name: "Cora Nivens",
        email: "student03@example.com", advisorKey: "ADVISOR1",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC210", grade: "F" },
            { term: "2025-3", courseKey: "CSC210", grade: "A" },
            { term: "2025-3", courseKey: "MTH101", grade: "B+" },
        ],
    },
    {
        _key: "DEMO004", studentId: "DEMO004", name: "Dorian Vale",
        email: "student04@example.com", advisorKey: "ADVISOR2",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC220", grade: "F" },
            { term: "2025-3", courseKey: "CSC220", grade: "W" },
            { term: "2025-3", courseKey: "CSC110", grade: "C+" },
        ],
    },
    {
        _key: "DEMO005", studentId: "DEMO005", name: "Elara Finch",
        email: "student05@example.com", advisorKey: "ADVISOR2",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC120", grade: "B+" },
            { term: "2025-2", courseKey: "CSC150", grade: "C" },
            { term: "2025-3", courseKey: "MTH101", grade: "A" },
        ],
    },
    {
        _key: "DEMO006", studentId: "DEMO006", name: "Farid Sol",
        email: "student06@example.com", advisorKey: "ADVISOR2",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC110", grade: "C+" },
            { term: "2025-2", courseKey: "CSC210", grade: "B" },
            { term: "2025-3", courseKey: "CSC230", grade: "A" },
        ],
    },
    {
        _key: "DEMO007", studentId: "DEMO007", name: "Gwendolyn Pike",
        email: "student07@example.com", advisorKey: "ADVISOR1",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC240", grade: "B" },
            { term: "2025-2", courseKey: "MTH101", grade: "C+" },
            { term: "2025-3", courseKey: "CSC150", grade: "A" },
        ],
    },
    {
        _key: "DEMO008", studentId: "DEMO008", name: "Haru Tamsin",
        email: "student08@example.com", advisorKey: "ADVISOR1",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC120", grade: "C" },
            { term: "2025-2", courseKey: "CSC200", grade: "W" },
            { term: "2025-3", courseKey: "CSC220", grade: "B+" },
        ],
    },
    {
        _key: "DEMO009", studentId: "DEMO009", name: "Imani Belen",
        email: "student09@example.com", advisorKey: "ADVISOR2",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC110", grade: "A" },
            { term: "2025-2", courseKey: "CSC230", grade: "B+" },
            { term: "2025-3", courseKey: "CSC240", grade: "C+" },
        ],
    },
    {
        _key: "DEMO010", studentId: "DEMO010", name: "Jae Thorne",
        email: "student10@example.com", advisorKey: "ADVISOR2",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC150", grade: "B" },
            { term: "2025-2", courseKey: "MTH101", grade: "C" },
            { term: "2025-3", courseKey: "CSC200", grade: "W" },
        ],
    },
    {
        _key: "DEMO011", studentId: "DEMO011", name: "Kofi Adebayo",
        email: "student11@example.com", advisorKey: "ADVISOR1",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC210", grade: "C+" },
            { term: "2025-2", courseKey: "CSC220", grade: "B" },
            { term: "2025-3", courseKey: "CSC110", grade: "A" },
        ],
    },
    {
        _key: "DEMO012", studentId: "DEMO012", name: "Liora Senn",
        email: "student12@example.com", advisorKey: "ADVISOR1",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC120", grade: "A" },
            { term: "2025-2", courseKey: "CSC240", grade: "D" },
            { term: "2025-3", courseKey: "CSC150", grade: "B+" },
        ],
    },
    {
        _key: "DEMO013", studentId: "DEMO013", name: "Mira Quill",
        email: "student13@example.com", advisorKey: "ADVISOR2",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC110", grade: "B+" },
            { term: "2025-2", courseKey: "CSC200", grade: "W" },
            { term: "2025-3", courseKey: "MTH101", grade: "A" },
        ],
    },
    {
        _key: "DEMO014", studentId: "DEMO014", name: "Niko Vares",
        email: "student14@example.com", advisorKey: "ADVISOR2",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC230", grade: "C+" },
            { term: "2025-2", courseKey: "CSC240", grade: "B" },
            { term: "2025-3", courseKey: "CSC210", grade: "B+" },
        ],
    },
    {
        _key: "DEMO015", studentId: "DEMO015", name: "Oren Lark",
        email: "student15@example.com", advisorKey: "ADVISOR1",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC120", grade: "B+" },
            { term: "2025-2", courseKey: "CSC220", grade: "C" },
            { term: "2025-3", courseKey: "CSC200", grade: "W" },
        ],
    },
    {
        _key: "DEMO016", studentId: "DEMO016", name: "Panya Shor",
        email: "student16@example.com", advisorKey: "ADVISOR1",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC110", grade: "C" },
            { term: "2025-2", courseKey: "CSC150", grade: "B" },
            { term: "2025-3", courseKey: "CSC230", grade: "B+" },
        ],
    },
    {
        _key: "DEMO017", studentId: "DEMO017", name: "Rowan Cale",
        email: "student17@example.com", advisorKey: "ADVISOR2",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC120", grade: "D+" },
            { term: "2025-2", courseKey: "CSC210", grade: "C+" },
            { term: "2025-3", courseKey: "CSC240", grade: "B" },
        ],
    },
    {
        _key: "DEMO018", studentId: "DEMO018", name: "Sora Mendez",
        email: "student18@example.com", advisorKey: "ADVISOR2",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC110", grade: "B" },
            { term: "2025-2", courseKey: "CSC200", grade: "C+" },
            { term: "2025-3", courseKey: "MTH101", grade: "B+" },
        ],
    },
    {
        _key: "DEMO019", studentId: "DEMO019", name: "Talia Rook",
        email: "student19@example.com", advisorKey: "ADVISOR1",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC150", grade: "A" },
            { term: "2025-2", courseKey: "CSC230", grade: "C" },
            { term: "2025-3", courseKey: "CSC220", grade: "B" },
        ],
    },
    {
        _key: "DEMO020", studentId: "DEMO020", name: "Umesh Nair",
        email: "student20@example.com", advisorKey: "ADVISOR1",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC120", grade: "B" },
            { term: "2025-2", courseKey: "CSC240", grade: "B+" },
            { term: "2025-3", courseKey: "CSC210", grade: "A" },
        ],
    },
    {
        _key: "DEMO021", studentId: "DEMO021", name: "Veda Opal",
        email: "student21@example.com", advisorKey: "ADVISOR2",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC110", grade: "C+" },
            { term: "2025-2", courseKey: "CSC150", grade: "D" },
            { term: "2025-3", courseKey: "CSC200", grade: "W" },
        ],
    },
    {
        _key: "DEMO022", studentId: "DEMO022", name: "Wren Hart",
        email: "student22@example.com", advisorKey: "ADVISOR2",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC120", grade: "C+" },
            { term: "2025-2", courseKey: "CSC230", grade: "B" },
            { term: "2025-3", courseKey: "MTH101", grade: "B+" },
        ],
    },
    {
        _key: "DEMO023", studentId: "DEMO023", name: "Ximena Solis",
        email: "student23@example.com", advisorKey: "ADVISOR1",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC210", grade: "B+" },
            { term: "2025-2", courseKey: "CSC240", grade: "C" },
            { term: "2025-3", courseKey: "CSC110", grade: "A" },
        ],
    },
    {
        _key: "DEMO024", studentId: "DEMO024", name: "Yuki Kato",
        email: "student24@example.com", advisorKey: "ADVISOR1",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC120", grade: "A" },
            { term: "2025-2", courseKey: "CSC220", grade: "B" },
            { term: "2025-3", courseKey: "CSC200", grade: "W" },
        ],
    },
    {
        _key: "DEMO025", studentId: "DEMO025", name: "Zaria Moon",
        email: "student25@example.com", advisorKey: "ADVISOR2",
        password: DEMO_TEST_PASSWORD,
        history: [
            { term: "2025-2", courseKey: "CSC150", grade: "B+" },
            { term: "2025-2", courseKey: "CSC230", grade: "C+" },
            { term: "2025-3", courseKey: "CSC240", grade: "A" },
        ],
    },
];

// Flatten student histories into records for D7's create path. Keeping these
// definitions separate makes course references and grades easy to validate.
const RECORD_DEFS = STUDENT_DEFS.flatMap((student) =>
    student.history.map((record) => ({
        studentKey: student._key,
        studentId: student.studentId,
        courseKey: record.courseKey,
        term: record.term,
        grade: record.grade,
    }))
);

// Current registrations are deliberately data-only. D7 should create them only
// after inserting the users, courses and offerings. The three FULL_DEMO rows
// fill the cap, while DEMO001-Demo024 fill ONE_LEFT to the boundary. DEMO005
// and DEMO007 additionally exercise the two overlapping schedule sections.
const CURRENT_REGISTRATION_DEFS = [
    { studentKey: "DEMO005", studentId: "DEMO005", offeringKey: "CLASH_A", term: CURRENT_TERM, expectedResult: "known clash with DEMO007 on CLASH_B" },
    { studentKey: "DEMO007", studentId: "DEMO007", offeringKey: "CLASH_B", term: CURRENT_TERM, expectedResult: "known clash with DEMO005 on CLASH_A" },
    ...["DEMO001", "DEMO004", "DEMO007"].map((studentKey) => ({
        studentKey, studentId: studentKey, offeringKey: "FULL_DEMO", term: CURRENT_TERM,
        expectedResult: "FULL_DEMO is full after 3 registrations",
    })),
    ...["DEMO001", "DEMO002", "DEMO003", "DEMO004", "DEMO005", "DEMO006", "DEMO007", "DEMO008", "DEMO009", "DEMO010", "DEMO011", "DEMO012", "DEMO013", "DEMO014", "DEMO015", "DEMO016", "DEMO017", "DEMO018", "DEMO019", "DEMO020", "DEMO021", "DEMO022", "DEMO023", "DEMO024"].map((studentKey) => ({
        studentKey, studentId: studentKey, offeringKey: "ONE_LEFT", term: CURRENT_TERM,
        expectedResult: "ONE_LEFT has one seat left after 24 registrations",
    })),
];

// ---------------------------------------------------------------------------
// Export definitions so D6 (student defs) and D7 (insert + register) can
// require() this file without re-running seedDatabase().
// ---------------------------------------------------------------------------
module.exports = {
    CURRENT_TERM,
    COURSE_DEFS,
    OFFERING_DEFS,
    OFFERING_KEYS,
    DEMO_TEST_PASSWORD,
    ADVISOR_DEFS,
    ADMIN_DEFS,
    STUDENT_DEFS,
    RECORD_DEFS,
    CURRENT_REGISTRATION_DEFS,
};

// ---------------------------------------------------------------------------
// seedDatabase() — scaffold only for D5.
// D5 does NOT execute deletion or insertion.
// D7 will complete this function with all deleteMany / create / register calls.
// ---------------------------------------------------------------------------
async function seedDatabase() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env file.");
        }

        console.log("Connecting to MongoDB...");
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to: ${conn.connection.host} (${conn.connection.name})`);

        // ── D7 will add deleteMany, user inserts, course inserts,
        //    offering inserts and registration inserts here.
        //    Do NOT add DB writes until D7. ──────────────────────────────

        console.log("[D5] Course and offering definitions prepared. Run D7 to execute inserts.");
        console.log(`Catalogue: ${COURSE_DEFS.length} courses (including CSC250 catalogue-only)`);
        console.log(`Sections : ${OFFERING_DEFS.length} sections for term ${CURRENT_TERM}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

// Run only when invoked directly (node scripts/seed.js), not when required
if (require.main === module) {
    seedDatabase();
}