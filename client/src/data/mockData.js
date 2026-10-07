export const DEMO_USERS = {
  student: {
    id: "usr_student_01",
    name: "Aung Kaung Myat",
    email: "2310030015@students.stamford.edu",
    role: "student",
    studentId: "2310030015",
    major: "Information Technology",
    year: "Year 3",
    advisor: "Dr. Somchai Prasert",
    currentTerm: "Semester 1 / 2026",
    maxCredits: 18,
    enrolledCredits: 15,
    gpa: "3.75"
  },
  advisor: {
    id: "usr_advisor_01",
    name: "Dr. Somchai Prasert",
    email: "somchai.prasert@stamford.edu",
    role: "advisor",
    department: "Computer Science & IT",
    office: "Building 3, Room 412",
    adviseeCount: 28,
    pendingApprovalsCount: 3
  },
  admin: {
    id: "usr_admin_01",
    name: "Academic Registrar",
    email: "registrar@stamford.edu",
    role: "admin",
    office: "Office of the Registrar",
    termStatus: "Active Registration Window",
    systemStatus: "Healthy / Online"
  }
};

export const STUDENT_ENROLLED_COURSES = [
  {
    id: "enr_1",
    code: "ITE220",
    title: "Web Application Development",
    credits: 3,
    section: "SEC-1",
    instructor: "Ajarn Thi Htoo Naing",
    schedule: "Mon & Wed 10:00 - 11:30 AM",
    room: "Lab 502",
    status: "Approved"
  },
  {
    id: "enr_2",
    code: "CS202",
    title: "Data Structures & Algorithms",
    credits: 3,
    section: "SEC-2",
    instructor: "Dr. Somchai Prasert",
    schedule: "Tue & Thu 09:00 - 10:30 AM",
    room: "Room 304",
    status: "Approved"
  },
  {
    id: "enr_3",
    code: "ITE310",
    title: "Database Systems & Design",
    credits: 3,
    section: "SEC-1",
    instructor: "Ajarn Wai Yan Moe Aung",
    schedule: "Tue & Thu 01:30 - 03:00 PM",
    room: "Lab 504",
    status: "Approved"
  },
  {
    id: "enr_4",
    code: "MTH102",
    title: "Discrete Mathematics",
    credits: 3,
    section: "SEC-1",
    instructor: "Ajarn Kanyarat S.",
    schedule: "Wed & Fri 01:00 - 02:30 PM",
    room: "Room 201",
    status: "Approved"
  },
  {
    id: "enr_5",
    code: "ENG201",
    title: "Technical & Professional Writing",
    credits: 3,
    section: "SEC-3",
    instructor: "Prof. David Miller",
    schedule: "Friday 09:00 AM - 12:00 PM",
    room: "Room 105",
    status: "Approved"
  }
];

export const ADVISOR_PENDING_REQUESTS = [
  {
    id: "req_1",
    studentName: "Thet Min Khant",
    studentId: "2405210015",
    major: "Information Technology",
    courseCode: "ITE220",
    courseTitle: "Web Application Development",
    credits: 3,
    reason: "Core curriculum prerequisite clearance for final project",
    requestDate: "2026-10-06",
    status: "Pending"
  },
  {
    id: "req_2",
    studentName: "Lin Htet Aung",
    studentId: "2310030042",
    major: "Computer Science",
    courseCode: "CS401",
    courseTitle: "Cloud Computing & DevOps",
    credits: 3,
    reason: "Requesting credit overload approval (18 -> 21 credits for graduation track)",
    requestDate: "2026-10-05",
    status: "Pending"
  },
  {
    id: "req_3",
    studentName: "Su Myat Noe",
    studentId: "2401120019",
    major: "Information Technology",
    courseCode: "ITE315",
    courseTitle: "Network Security & Protocols",
    credits: 3,
    reason: "Late add request due to schedule conflict resolution",
    requestDate: "2026-10-07",
    status: "Pending"
  }
];

export const ADMIN_METRICS = {
  totalStudents: 1248,
  activeOfferings: 84,
  totalRegistrations: 4960,
  pendingApprovals: 17,
  registrationWindowOpen: true,
  termName: "Fall Semester 2026",
  windowDeadline: "October 18, 2026 (11:59 PM)"
};

export const RECENT_OFFERINGS = [
  {
    id: "off_1",
    code: "ITE220",
    title: "Web Application Development",
    instructor: "Thi Htoo Naing",
    capacity: 35,
    enrolled: 32,
    status: "Active"
  },
  {
    id: "off_2",
    code: "CS202",
    title: "Data Structures & Algorithms",
    instructor: "Dr. Somchai Prasert",
    capacity: 40,
    enrolled: 40,
    status: "Full"
  },
  {
    id: "off_3",
    code: "ITE310",
    title: "Database Systems & Design",
    instructor: "Wai Yan Moe Aung",
    capacity: 35,
    enrolled: 29,
    status: "Active"
  },
  {
    id: "off_4",
    code: "ITE325",
    title: "Mobile Application Engineering",
    instructor: "Dr. Narong K.",
    capacity: 30,
    enrolled: 18,
    status: "Active"
  }
];
