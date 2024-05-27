// Importing necessary modules from express-validator and mongoose
const { body, validationResult, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

/**
 * Validator for creating a new MealsPerDay record.
 */
exports.validateCreateMealsPerDay = [
  // Meals count validation
  body("meals_count")
    .notEmpty()
    .withMessage({ en: "Meals Count is required", ar: "عدد الوجبات مطلوب" })
    .isInt({ min: 1 })
    .withMessage({
      en: "Meals count must be a positive integer",
      ar: "يجب أن يكون عدد الوجبات عددًا صحيحًا موجبًا",
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
 * Validator for updating details of a specific MealsPerDay record by ID.
 */
exports.validateUpdateMealsPerDay = [
  // Meals count validation
  body("meals_count")
    .notEmpty()
    .withMessage({ en: "Meals Count is required", ar: "عدد الوجبات مطلوب" })

    .isInt({ min: 1 })
    .withMessage({
      en: "Meals count must be a positive integer",
      ar: "يجب أن يكون عدد الوجبات عددًا صحيحًا موجبًا",
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
