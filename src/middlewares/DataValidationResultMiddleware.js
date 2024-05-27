// Importing necessary module from express-validator
const { validationResult } = require("express-validator");

/**
 * Middleware Validate Handler to handle validation errors.
 */
exports.validateErrorResult = (req, res, next) => {
  // Retrieve validation errors
  const errors = validationResult(req).mapped();

  // If there are no errors, proceed to the next middleware
  if (Object.keys(errors).length === 0) {
    next();
  } else {
    // If there are errors, format them and send as response
    let errorObj = {};
    for (let error in errors) {
      errorObj[error] = errors[error].msg;
    }
    res.status(200).json({
      status: false,
      errors: errorObj,
    });
  }
};
