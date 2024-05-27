// Importing necessary modules from express-validator
const { body, validationResult, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

// Validation middleware for createWeeklyMealCategoryValidationMiddleware
exports.createWeeklyMealCategoryValidationMiddleware = [
  // Language code validation
  body("lang")
    .notEmpty()
    .withMessage({ en: "Language is required", ar: "اللغة مطلوبة" })
    .isString()
    .isIn(["ar", "en"])
    .withMessage({ en: "Invalid language code", ar: "رمز اللغة غير صالح" }),

  // Weekly Meal Category validation
  body("weekly_meal_category")
    .notEmpty()
    .withMessage({
      en: "Weekly Meal Category is required",
      ar: "التصنيف الخاص بالوجبات الأسبوعي مطلوب",
    })
    .isString()
    .withMessage({
      en: "Weekly Meal Category must be a string",
      ar: "يجب أن يكون التصنيف الخاص بالوجبات الأسبوعي سلسلة نصية",
    })
    .trim(),
];

// Validation middleware for updateWeeklyMealCategoryValidationMiddleware
exports.updateWeeklyMealCategoryValidationMiddleware = [
  // Language code validation
  body("lang")
    .notEmpty()
    .withMessage({ en: "Language is required", ar: "اللغة مطلوبة" })
    .isString()
    .isIn(["ar", "en"])
    .withMessage({ en: "Invalid language code", ar: "رمز اللغة غير صالح" }),

  // Weekly Meal Category validation
  body("weekly_meal_category")
    .notEmpty()
    .withMessage({
      en: "Weekly Meal Category is required",
      ar: "التصنيف الخاص بالوجبات الأسبوعي مطلوب",
    })
    .isString()
    .withMessage({
      en: "Weekly Meal Category must be a string",
      ar: "يجب أن يكون التصنيف الخاص بالوجبات الأسبوعي سلسلة نصية",
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
