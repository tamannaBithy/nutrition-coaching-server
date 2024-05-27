const { body, validationResult, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

/**
 * Validator for creating a new Meal Preference.
 */
exports.validateCreateMealPreference = [
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
    .withMessage({ en: "Invalid language code", ar: "رمز اللغة غير صالح" }),

  // Preference validation
  body("preference")
    .notEmpty()
    .withMessage({ en: "Preference is required", ar: "التفضيل مطلوب" })
    .isString()
    .withMessage({
      en: "Preference is required and must be a string",
      ar: "التفضيل مطلوب ويجب أن يكون سلسلة نصية",
    })
    .trim(),
  // Description validation
  body("preference_desc")
    .notEmpty()
    .withMessage({
      en: "Preference description is required",
      ar: "وصف التفضيل مطلوب",
    })
    .isString()
    .withMessage({
      en: "Preference description is required and must be a string",
      ar: "وصف التفضيل مطلوب ويجب أن يكون سلسلة نصية",
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
 * Validator for updating a Meal Preference.
 */
exports.validateUpdateMealPreference = [
  body("lang")
    .notEmpty()
    .withMessage({ en: "Language is required", ar: "اللغة مطلوبة" })
    .isString()
    .withMessage({
      en: "Language must be a string",
      ar: "يجب أن تكون اللغة سلسلة نصية",
    })
    .isIn(["ar", "en"])
    .withMessage({ en: "Invalid language code", ar: "رمز اللغة غير صالح" }),

  // Preference validation
  body("preference")
    .notEmpty()
    .withMessage({ en: "Preference is required", ar: "التفضيل مطلوب" })
    .isString()
    .withMessage({
      en: "Preference is required and must be a string",
      ar: "التفضيل مطلوب ويجب أن يكون سلسلة نصية",
    })
    .trim(),
  // Description validation
  body("preference_desc")
    .notEmpty()
    .withMessage({
      en: "Preference description is required",
      ar: "وصف التفضيل مطلوب",
    })
    .isString()
    .withMessage({
      en: "Preference description is required and must be a string",
      ar: "وصف التفضيل مطلوب ويجب أن يكون سلسلة نصية",
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

exports.validateMongooseIdMiddleware = [
  // Custom validator for id parameter
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error({ en: "Invalid ID", ar: "معرف غير صالح" });
    }
    return true;
  }),
];
