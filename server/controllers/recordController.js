const Record = require("../models/Record");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const getAllRecords = asyncHandler(async (req, res) => {
  const { studentId, courseId, term } = req.query;
  const filter = {};
  if (studentId) filter.studentId = studentId;
  if (courseId) filter.courseId = courseId;
  if (term) filter.term = term;

  const records = await Record.find(filter)
    .populate("studentId", "name studentId")
    .populate("courseId", "code title credits");

  res.status(200).json({
    success: true,
    count: records.length,
    records,
  });
});

const getRecordById = asyncHandler(async (req, res, next) => {
  const record = await Record.findById(req.params.id)
    .populate("studentId", "name studentId")
    .populate("courseId", "code title credits");

  if (!record) {
    return next(new AppError(`Record not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    record,
  });
});

const createRecord = asyncHandler(async (req, res, next) => {
  const { studentId, courseId, term, grade } = req.body;

  if (!studentId || !courseId || !term || !grade) {
    return next(new AppError("Student ID, course ID, term, and grade are required", 400));
  }

  const existing = await Record.findOne({ studentId, courseId, term });
  if (existing) {
    return next(new AppError("Academic record already exists for this course and term", 409));
  }

  const record = await Record.create({
    studentId,
    courseId,
    term,
    grade: grade.toUpperCase().trim(),
  });

  res.status(201).json({
    success: true,
    record,
  });
});

const deleteRecord = asyncHandler(async (req, res, next) => {
  const record = await Record.findByIdAndDelete(req.params.id);
  if (!record) {
    return next(new AppError(`Record not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "Record deleted successfully",
  });
});

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  deleteRecord,
};
