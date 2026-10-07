const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const validateId = require("../middlewares/validateId");

router.get("/", courseController.getAllCourses);
router.post("/", courseController.createCourse);
router.get("/:id", validateId("id"), courseController.getCourseById);
router.put("/:id", validateId("id"), courseController.updateCourse);
router.delete("/:id", validateId("id"), courseController.deleteCourse);

module.exports = router;
