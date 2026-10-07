const Offering = require("../models/Offering");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const getAllOfferings = asyncHandler(async (req, res) => {
  const { term, courseId } = req.query;
  const filter = {};
  if (term) filter.term = term;
  if (courseId) filter.courseId = courseId;

  const offerings = await Offering.find(filter).populate("courseId", "code title credits description");
  res.status(200).json({
    success: true,
    count: offerings.length,
    offerings,
  });
});

const getOfferingById = asyncHandler(async (req, res, next) => {
  const offering = await Offering.findById(req.params.id).populate("courseId", "code title credits description");
  if (!offering) {
    return next(new AppError(`Offering not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    offering,
  });
});

const createOffering = asyncHandler(async (req, res, next) => {
  const {
    courseId,
    term,
    section = 1,
    day,
    startTime,
    endTime,
    room,
    instructor,
    seats,
    capacity,
  } = req.body;

  const totalSeats = seats !== undefined ? seats : capacity;

  if (!courseId || !term || !day || !startTime || !endTime || !room || !instructor || totalSeats === undefined) {
    return next(new AppError("Missing required fields for course offering", 400));
  }

  // Check if offering already exists for this course, term, section
  const existing = await Offering.findOne({ courseId, term, section });
  if (existing) {
    return next(new AppError(`Offering for section ${section} in ${term} already exists`, 409));
  }

  const offering = await Offering.create({
    courseId,
    term,
    section,
    day,
    startTime,
    endTime,
    room,
    instructor,
    seats: totalSeats,
  });

  res.status(201).json({
    success: true,
    offering,
  });
});

const updateOffering = asyncHandler(async (req, res, next) => {
  const offering = await Offering.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!offering) {
    return next(new AppError(`Offering not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    offering,
  });
});

const deleteOffering = asyncHandler(async (req, res, next) => {
  const offering = await Offering.findByIdAndDelete(req.params.id);
  if (!offering) {
    return next(new AppError(`Offering not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "Offering deleted successfully",
  });
});

module.exports = {
  getAllOfferings,
  getOfferingById,
  createOffering,
  updateOffering,
  deleteOffering,
};
