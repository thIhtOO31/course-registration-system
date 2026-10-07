# Database Member Checks

> Maintained by the database member. Update after each D-commit.

---

## D5 - Prepare Realistic Courses and Sections

**Commit:** feat: prepare realistic courses and sections
**Date:** 2026-10-07
**Files changed:** `server/scripts/seed.js`, `docs/checks/database.md`

---

### Curriculum Source

| Course code | Title | Source |
|-------------|-------|--------|
| CSC220 | Web Development II | **Confirmed** - verbatim from the CSC220 Final Project Brief supplied by the lecturer (file: CSC220_Database_Member_Guide.docx, cover title and module header). |
| CSC110, CSC120, CSC150, CSC200, CSC210, CSC230, CSC240, CSC250, MTH101 | See catalogue below | **Demo codes** - internally-consistent codes invented for this project. They follow the CSC/MTH naming pattern of the confirmed course but do not appear in a separately verified external curriculum document. A team member with access to the official study plan should confirm or replace them before submission. |

> **Action required (pre-submission):** If you have the official IT/CS programme course list, replace the demo codes above with verified pairs and update this table accordingly.

---

### Course Catalogue (10 courses)

| # | Code | Title | Credits | Offered 2026-1? | Notes |
|---|------|-------|---------|----------------|-------|
| 1 | CSC110 | Introduction to Programming | 3 | Yes S1, S2 | |
| 2 | CSC120 | Data Structures | 3 | Yes S1, S2 | |
| 3 | CSC150 | Computer Networks | 3 | Yes S1 | |
| 4 | CSC200 | Object-Oriented Programming | 3 | Yes S1 | ONE_LEFT case |
| 5 | CSC210 | Database Fundamentals | 3 | Yes S1 | FULL_DEMO case (cap 3) |
| 6 | CSC220 | Web Development II | 3 | Yes S1, S2 | Confirmed lecturer title; CLASH_A + TWO_SECTION |
| 7 | CSC230 | Operating Systems | 3 | Yes S1 | |
| 8 | CSC240 | Software Testing | 3 | Yes S1 | |
| 9 | CSC250 | Software Engineering | 3 | No offering | Catalogue-only - demonstrates no current-term section |
| 10 | MTH101 | Mathematics for Computing | 3 | Yes S1 | |

---

### Section Schedule Table (12 sections, term 2026-1)

| Key (stable name) | Course | Section | Day | Start | End | Room | Instructor | Seats | Case |
|-------------------|--------|---------|-----|-------|-----|------|------------|-------|------|
| CLASH_A | CSC220 | 1 | Mon | 09:00 | 11:00 | IT-Lab 301 | Ajarn Prawit Somboon | 30 | Schedule clash (with CLASH_B) |
| CLASH_B | CSC110 | 1 | Mon | 10:00 | 12:00 | IT-Lab 302 | Ajarn Kulpreeya Rattana | 35 | Schedule clash (overlaps CLASH_A 10-11) |
| BACK_TO_BACK | CSC120 | 1 | Mon | 11:00 | 13:00 | IT-Lab 303 | Ajarn Manee Charoenwong | 30 | Back-to-back (starts exactly when CLASH_A ends) |
| DIFF_DAY | CSC150 | 1 | Wed | 09:00 | 11:00 | Net-Lab 201 | Ajarn Siriporn Thongchai | 30 | Different-day (no clash with Mon sections) |
| TWO_SECTION | CSC220 | 2 | Tue | 13:00 | 15:00 | IT-Lab 301 | Ajarn Prawit Somboon | 30 | Second section of CSC220 |
| FULL_DEMO | CSC210 | 1 | Thu | 09:00 | 11:00 | IT-Lab 304 | Ajarn Nattapong Jirasak | 3 | Full-seat demo (deliberately small cap) |
| ONE_LEFT | CSC200 | 1 | Tue | 09:00 | 11:00 | IT-Lab 305 | Ajarn Chanya Wattana | 25 | One-seat-left boundary check |
| OPEN_A | CSC230 | 1 | Wed | 13:00 | 15:00 | IT-Lab 306 | Ajarn Somkid Boonsong | 30 | Normal open section |
| OPEN_B | CSC240 | 1 | Thu | 13:00 | 15:00 | IT-Lab 307 | Ajarn Wanpen Sukhon | 30 | Normal open section |
| OPEN_C | MTH101 | 1 | Fri | 09:00 | 11:00 | Class 101 | Ajarn Decha Phanomwan | 40 | Large room, open |
| OPEN_D | CSC110 | 2 | Fri | 13:00 | 15:00 | IT-Lab 302 | Ajarn Kulpreeya Rattana | 35 | Second section of CSC110 |
| OPEN_E | CSC120 | 2 | Wed | 11:00 | 13:00 | IT-Lab 303 | Ajarn Manee Charoenwong | 30 | Second section of CSC120 |

---

### Rubric Coverage Summary

| Requirement | Case / section | Status |
|-------------|---------------|--------|
| Current term 2026-1 | All 12 sections | Done |
| At least one course with two sections | CSC220 (CLASH_A + TWO_SECTION), CSC110 (CLASH_B + OPEN_D), CSC120 (BACK_TO_BACK + OPEN_E) | Done |
| Catalogue course with no current offering | CSC250 Software Engineering | Done |
| Mon 09:00-11:00 / Mon 10:00-12:00 clash pair | CLASH_A / CLASH_B | Done |
| Mon 11:00-13:00 back-to-back case | BACK_TO_BACK | Done |
| Different-day case | DIFF_DAY (Wednesday) | Done |
| Full-seat scenario | FULL_DEMO (cap 3, filled by D7) | Done |
| Open-seat scenario | OPEN_A through OPEN_E | Done |
| One-seat-left scenario | ONE_LEFT (cap 25, 24 registered by D7) | Done |
| seatsTaken derived from real Registration rows | All - D7 counts and sets after inserts | Done |
| Add/drop closed initially | All sections: addDropOpen false | Done |
| No real student identities or grades | D5 contains no user data | Done |

---

### Constants Exported for D6 / D7

    const { CURRENT_TERM, COURSE_DEFS, OFFERING_DEFS, OFFERING_KEYS } = require('./seed');

| Export | Type | Purpose |
|--------|------|---------|
| CURRENT_TERM | "2026-1" | Shared term string used in offerings, registrations and records |
| COURSE_DEFS | Array | 10 course objects with _key lookup handles |
| OFFERING_DEFS | Array | 12 offering objects with _key and courseKey handles |
| OFFERING_KEYS | Object | String constants for stable referencing in D7 registration lists |

---

### Handoff to Leader - Specific Offering Cases

| Key | Use |
|-----|-----|
| CLASH_A | Try to register same student for CLASH_B - expect time-clash rejection |
| CLASH_B | Partner to CLASH_A clash test |
| BACK_TO_BACK | Back-to-back schedule edge case (allowed; not a clash) |
| DIFF_DAY | Control case - no clash expected |
| FULL_DEMO | After D7 runs: seats=3, seatsTaken=3 - registration must be rejected |
| ONE_LEFT | After D7 runs: seats=25, seatsTaken=24 - exactly one registration succeeds, next fails |
| OPEN_A to OPEN_E | Normal happy-path registrations |

F9 must set addDropOpen to true and a future addDropClosesAt date on any section to demonstrate the window. Current state: all closed.

---

### D5 Pre-commit Check

- All course names/codes have a documented source (CSC220 confirmed; others noted as demo codes)
- Schedules cover clash, back-to-back, different-day, full-seat, one-left and open cases
- server/scripts/seed.js contains no deleteMany, create or insertMany calls - data preparation only
- seatsTaken is not set above 0 in any offering definition
- addDropOpen is false and addDropClosesAt is null on every section
- module.exports exposes CURRENT_TERM, COURSE_DEFS, OFFERING_DEFS, OFFERING_KEYS
- No real student identities, emails or grades appear in D5 definitions
