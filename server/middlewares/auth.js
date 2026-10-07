const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Authentication required. Please provide a Bearer token.", 401));
  }

  const secret = process.env.JWT_SECRET || "default_jwt_secret";
  const decoded = jwt.verify(token, secret);

  const currentUser = await User.findById(decoded.id).select("-passwordHash");
  if (!currentUser) {
    return next(new AppError("User belonging to this token no longer exists.", 401));
  }

  if (!currentUser.active) {
    return next(new AppError("This account has been deactivated.", 403));
  }

  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Forbidden: You do not have permission to perform this action.", 403));
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};
