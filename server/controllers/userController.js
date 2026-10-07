const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.active !== undefined) filter.active = req.query.active === "true";

  const users = await User.find(filter).select("-passwordHash");
  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    return next(new AppError(`User not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const allowedUpdates = ["name", "email", "role", "studentId", "advisorId", "active"];
  const updates = {};
  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select("-passwordHash");

  if (!updatedUser) {
    return next(new AppError(`User not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError(`User not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
