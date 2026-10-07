const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const signToken = (user) => {
  const secret = process.env.JWT_SECRET || "default_jwt_secret";
  return jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: "7d",
  });
};

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role = "student", studentId, advisorId } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Name, email, and password are required", 400));
  }

  if (role === "student" && !studentId) {
    return next(new AppError("Student ID is required for student accounts", 400));
  }

  const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingEmail) {
    return next(new AppError("A user with this email already exists", 409));
  }

  if (studentId) {
    const existingStudentId = await User.findOne({ studentId: studentId.trim() });
    if (existingStudentId) {
      return next(new AppError("A student with this Student ID already exists", 409));
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    role,
    studentId: role === "student" ? studentId.trim() : null,
    advisorId: advisorId || null,
  });

  const token = signToken(user);

  res.status(201).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      advisorId: user.advisorId,
      active: user.active,
    },
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }

  if (!user.active) {
    return next(new AppError("This account has been deactivated", 403));
  }

  const token = signToken(user);

  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      advisorId: user.advisorId,
      active: user.active,
    },
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = {
  register,
  login,
  getMe,
};
