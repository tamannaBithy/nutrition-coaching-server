// Importing necessary modules from express-validator and mongoose
const { body, validationResult, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

/**
 * Validator for creating a new meal type.
 */
exports.validateCreateMealType = [
  // Language code validation
  body("lang")
    .notEmpty()
    .withMessage({ en: "Language is required", ar: "اللغة مطلوبة" })
    .isString()
    .withMessage({
      en: "Language must be a string",
      ar: "يجب أن تكون اللغة سلسلة نصية",
    })
    .isIn(["ar", "en"])
    .withMessage({ en: "Invalid language code", ar: "رمز لغة غير صالح" }),

  // Type of meal validation
  body("type_of_meal")
    .notEmpty()
    .withMessage({ en: "Type of meal is required", ar: "نوع الوجبة مطلوب" })
    .isString()
    .withMessage({
      en: "Type of meal is required and must be a string",
      ar: "نوع الوجبة مطلوب ويجب أن يكون سلسلة نصية",
    })
    .trim(),
];

/**
 * Validator for updating details of a specific meal type by ID.
 */
exports.validateUpdateMealType = [
  // Language code validation
  body("lang")
    .notEmpty()
    .withMessage({ en: "Language is required", ar: "اللغة مطلوبة" })
    .isString()
    .withMessage({
      en: "Language must be a string",
      ar: "يجب أن تكون اللغة سلسلة نصية",
    })
    .isIn(["ar", "en"])
    .withMessage({ en: "Invalid language code", ar: "رمز لغة غير صالح" }),

  // Type of meal validation
  body("type_of_meal")
    .notEmpty()
    .withMessage({ en: "Type of meal is required", ar: "نوع الوجبة مطلوب" })
    .isString()
    .withMessage({
      en: "Type of meal is required and must be a string",
      ar: "نوع الوجبة مطلوب ويجب أن يكون سلسلة نصية",
    })
    .trim(),
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
