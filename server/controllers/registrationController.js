const Registration = require("../models/Registration");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const getAllRegistrations = asyncHandler(async (req, res) => {
  const { studentId, term } = req.query;
  const filter = {};
  if (studentId) filter.studentId = studentId;
  if (term) filter.term = term;

  const registrations = await Registration.find(filter)
    .populate("studentId", "name studentId email")
    .populate("offeringId");

  res.status(200).json({
    success: true,
    count: registrations.length,
    registrations,
  });
});

const getRegistrationById = asyncHandler(async (req, res, next) => {
  const registration = await Registration.findById(req.params.id)
    .populate("studentId", "name studentId email")
    .populate("offeringId");

  if (!registration) {
    return next(new AppError(`Registration not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    registration,
  });
});

const createRegistration = asyncHandler(async (req, res, next) => {
  const { studentId, offeringId, term, status = "registered" } = req.body;

  if (!studentId || !offeringId || !term) {
    return next(new AppError("Student ID, offering ID, and term are required", 400));
  }

  const existing = await Registration.findOne({ studentId, offeringId });
  if (existing) {
    return next(new AppError("Student is already registered for this offering", 409));
  }

  const registration = await Registration.create({
    studentId,
    offeringId,
    term,
    status,
  });

  res.status(201).json({
    success: true,
    registration,
  });
});

const deleteRegistration = asyncHandler(async (req, res, next) => {
  const registration = await Registration.findByIdAndDelete(req.params.id);
  if (!registration) {
    return next(new AppError(`Registration not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "Registration deleted successfully",
  });
});

module.exports = {
  getAllRegistrations,
  getRegistrationById,
  createRegistration,
  deleteRegistration,
};
