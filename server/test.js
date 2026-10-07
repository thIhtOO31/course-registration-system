process.env.NODE_ENV = "test";
require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");
const User = require("./models/User");
const Course = require("./models/Course");
const bcrypt = require("bcrypt");

const TEST_PORT = 3001;

function makeRequest(options, bodyData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on("error", reject);

    if (bodyData) {
      req.write(bodyData);
    }
    req.end();
  });
}

async function runTests() {
  console.log("Connecting to database for test run...");
  await connectDB();

  console.log(`Starting test server on port ${TEST_PORT}...`);
  const server = app.listen(TEST_PORT);

  const results = [];
  const test = (name, passed, message = "") => {
    if (passed) {
      console.log(`✓ PASS: ${name}`);
      results.push({ name, passed: true });
    } else {
      console.error(`✗ FAIL: ${name} -> ${message}`);
      results.push({ name, passed: false, message });
    }
  };

  try {
    // 1. Health route check
    const health = await makeRequest({
      hostname: "localhost",
      port: TEST_PORT,
      path: "/api/health",
      method: "GET",
    });
    test(
      "Health route works (GET /api/health -> 200)",
      health.statusCode === 200 && health.data.status === "ok",
      `Got status ${health.statusCode}`
    );

    // 2. Unknown route -> 404 JSON
    const notFound = await makeRequest({
      hostname: "localhost",
      port: TEST_PORT,
      path: "/api/non-existent-route",
      method: "GET",
    });
    test(
      "Unknown route returns 404 JSON response",
      notFound.statusCode === 404 && notFound.data.error === "Not Found",
      `Got status ${notFound.statusCode}: ${JSON.stringify(notFound.data)}`
    );

    // 3. Malformed JSON payload -> 400 Bad Request without server crashing
    const malformedJson = await makeRequest(
      {
        hostname: "localhost",
        port: TEST_PORT,
        path: "/api/courses",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      "{\"broken_json\": "
    );
    test(
      "Malformed JSON body does not crash server and returns 400",
      malformedJson.statusCode === 400 && malformedJson.data.error === "Bad Request",
      `Got status ${malformedJson.statusCode}: ${JSON.stringify(malformedJson.data)}`
    );

    // 4. Malformed IDs do not crash server and return 400 Bad Request
    const malformedIdCourse = await makeRequest({
      hostname: "localhost",
      port: TEST_PORT,
      path: "/api/courses/not-a-valid-id",
      method: "GET",
    });
    test(
      "Malformed Course ID returns 400 Bad Request",
      malformedIdCourse.statusCode === 400 && malformedIdCourse.data.error === "Bad Request",
      `Got status ${malformedIdCourse.statusCode}: ${JSON.stringify(malformedIdCourse.data)}`
    );

    const malformedIdUser = await makeRequest({
      hostname: "localhost",
      port: TEST_PORT,
      path: "/api/users/123-bad-id",
      method: "GET",
    });
    test(
      "Malformed User ID returns 400 Bad Request",
      malformedIdUser.statusCode === 400 && malformedIdUser.data.error === "Bad Request",
      `Got status ${malformedIdUser.statusCode}: ${JSON.stringify(malformedIdUser.data)}`
    );

    // 5. Missing required body inputs -> 400 Bad Request
    const emptyCourseBody = await makeRequest(
      {
        hostname: "localhost",
        port: TEST_PORT,
        path: "/api/courses",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      JSON.stringify({})
    );
    test(
      "Empty body for course creation returns 400 Bad Request",
      emptyCourseBody.statusCode === 400 && emptyCourseBody.data.error === "Bad Request",
      `Got status ${emptyCourseBody.statusCode}: ${JSON.stringify(emptyCourseBody.data)}`
    );

    // 6. Non-existent valid ObjectId -> 404 Not Found
    const validNonExistentId = "507f1f77bcf86cd799439011";
    const courseNotFound = await makeRequest({
      hostname: "localhost",
      port: TEST_PORT,
      path: `/api/courses/${validNonExistentId}`,
      method: "GET",
    });
    test(
      "Valid but non-existent ObjectId returns 404 Not Found",
      courseNotFound.statusCode === 404 && courseNotFound.data.error === "Not Found",
      `Got status ${courseNotFound.statusCode}: ${JSON.stringify(courseNotFound.data)}`
    );

    // 7. Protected route without token -> 401 Unauthorized
    const unauthorized = await makeRequest({
      hostname: "localhost",
      port: TEST_PORT,
      path: "/api/auth/me",
      method: "GET",
    });
    test(
      "Accessing protected route without token returns 401 Unauthorized",
      unauthorized.statusCode === 401 && unauthorized.data.error === "Unauthorized",
      `Got status ${unauthorized.statusCode}: ${JSON.stringify(unauthorized.data)}`
    );

    // 8. Invalid login credentials -> 401 Unauthorized
    const invalidLogin = await makeRequest(
      {
        hostname: "localhost",
        port: TEST_PORT,
        path: "/api/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      JSON.stringify({ email: "ghost.user@stamford.edu", password: "BadPassword123!" })
    );
    test(
      "Invalid login credentials return 401 Unauthorized",
      invalidLogin.statusCode === 401 && invalidLogin.data.error === "Unauthorized",
      `Got status ${invalidLogin.statusCode}: ${JSON.stringify(invalidLogin.data)}`
    );

    // 9. Deactivated user login -> 403 Forbidden
    const testInactive = await User.create({
      name: "Inactive Test User",
      email: "inactive.test@stamford.edu",
      passwordHash: await bcrypt.hash("Password123!", 10),
      role: "student",
      studentId: "INACT001",
      active: false,
    });

    const inactiveLogin = await makeRequest(
      {
        hostname: "localhost",
        port: TEST_PORT,
        path: "/api/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      JSON.stringify({ email: "inactive.test@stamford.edu", password: "Password123!" })
    );
    test(
      "Deactivated user account returns 403 Forbidden",
      inactiveLogin.statusCode === 403 && inactiveLogin.data.error === "Forbidden",
      `Got status ${inactiveLogin.statusCode}: ${JSON.stringify(inactiveLogin.data)}`
    );
    await User.findByIdAndDelete(testInactive._id);

    // 10. Duplicate course code -> 409 Conflict
    const existingCourse = await Course.findOne();
    if (existingCourse) {
      const duplicateCourse = await makeRequest(
        {
          hostname: "localhost",
          port: TEST_PORT,
          path: "/api/courses",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        JSON.stringify({
          code: existingCourse.code,
          title: "Duplicate Test Course",
          credits: 3,
        })
      );
      test(
        "Duplicate course code returns 409 Conflict",
        duplicateCourse.statusCode === 409 && duplicateCourse.data.error === "Conflict",
        `Got status ${duplicateCourse.statusCode}: ${JSON.stringify(duplicateCourse.data)}`
      );
    }

    // 11. Normal list routes return 200 arrays
    const coursesList = await makeRequest({
      hostname: "localhost",
      port: TEST_PORT,
      path: "/api/courses",
      method: "GET",
    });
    test(
      "GET /api/courses returns 200 array",
      coursesList.statusCode === 200 && Array.isArray(coursesList.data.courses),
      `Got status ${coursesList.statusCode}`
    );

    const failures = results.filter((r) => !r.passed);
    console.log(`\n================================`);
    console.log(`Test Results: ${results.length - failures.length}/${results.length} passed`);
    console.log(`================================`);

    if (failures.length > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runTests();
