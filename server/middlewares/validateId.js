const AppError = require("../utils/AppError");

const validateId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
      return next(new AppError(`Invalid ID format: '${id}' for parameter '${paramName}'`, 400));
    }
    next();
  };
};

module.exports = validateId;
