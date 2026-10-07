const Course = require("../models/Course");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const getAllCourses = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = {};

  if (search) {
    const searchRegex = new RegExp(search, "i");
    filter.$or = [{ code: searchRegex }, { title: searchRegex }];
  }

  const courses = await Course.find(filter).populate("prerequisites", "code title credits");
  res.status(200).json({
    success: true,
    count: courses.length,
    courses,
  });
});

const getCourseById = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate("prerequisites", "code title credits");
  if (!course) {
    return next(new AppError(`Course not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    course,
  });
});

const createCourse = asyncHandler(async (req, res, next) => {
  const { code, title, credits, description = "", prerequisites = [] } = req.body;

  if (!code || !title || credits === undefined || credits === null) {
    return next(new AppError("Course code, title, and credits are required", 400));
  }

  if (typeof credits !== "number" || credits < 1) {
    return next(new AppError("Credits must be a number greater than or equal to 1", 400));
  }

  const formattedCode = code.toUpperCase().trim();
  const existingCourse = await Course.findOne({ code: formattedCode });
  if (existingCourse) {
    return next(new AppError(`Course with code '${formattedCode}' already exists`, 409));
  }

  const newCourse = await Course.create({
    code: formattedCode,
    title: title.trim(),
    credits,
    description: description.trim(),
    prerequisites,
  });

  res.status(201).json({
    success: true,
    course: newCourse,
  });
});

const updateCourse = asyncHandler(async (req, res, next) => {
  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedCourse) {
    return next(new AppError(`Course not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    course: updatedCourse,
  });
});

const deleteCourse = asyncHandler(async (req, res, next) => {
  const deletedCourse = await Course.findByIdAndDelete(req.params.id);
  if (!deletedCourse) {
    return next(new AppError(`Course not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
