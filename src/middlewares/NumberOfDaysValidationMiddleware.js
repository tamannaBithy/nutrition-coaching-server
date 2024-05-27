// Importing necessary modules from express-validator and mongoose
const { body, validationResult, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

/**
 * Validator for creating a new Number of Days Record.
 */
exports.validateCreateNumberOfDays = [
  // Days number validation
  body("days_number")
    .notEmpty()
    .withMessage({ en: "Days number is required", ar: "العدد اليومي مطلوب" })
    .isInt({ min: 1 })
    .withMessage({
      en: "Days number must be a positive integer",
      ar: "يجب أن يكون العدد اليومي عددًا صحيحًا إيجابيًا",
    })
    .trim(),
  // Validate visible field
  body("visible")
    .notEmpty()
    .withMessage({
      en: "Visibility status is required.",
      ar: "حالة الظهور مطلوبة.",
    })
    .isBoolean()
    .withMessage({
      en: "Visibility status must be a boolean.",
      ar: "يجب أن تكون حالة الظهور قيمة بولية (صحيحة/خاطئة).",
    }),
];

/**
 * Validator for updating details of a specific Number of Days Record.
 */
exports.validateUpdateNumberOfDays = [
  // Days number validation
  body("days_number")
    .notEmpty()
    .withMessage({ en: "Days number is required", ar: "العدد اليومي مطلوب" })
    .isInt({ min: 1 })
    .withMessage({
      en: "Days number must be a positive integer",
      ar: "يجب أن يكون العدد اليومي عددًا صحيحًا إيجابيًا",
    })
    .trim(),
  // Validate visible field
  body("visible")
    .notEmpty()
    .withMessage({
      en: "Visibility status is required.",
      ar: "حالة الظهور مطلوبة.",
    })
    .isBoolean()
    .withMessage({
      en: "Visibility status must be a boolean.",
      ar: "يجب أن تكون حالة الظهور قيمة بولية (صحيحة/خاطئة).",
    }),
];

// Validation middleware for checking valid MongoDB ObjectId
exports.validateMongooseIdMiddleware = [
  // Custom validator for id parameter
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error({ en: "Invalid ID", ar: "معرف غير صالح" });
    }
    return true;
  }),
];
