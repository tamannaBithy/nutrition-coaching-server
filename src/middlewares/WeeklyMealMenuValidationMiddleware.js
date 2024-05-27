// Importing necessary modules from express-validator
const { body, param, validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

/**
 * Validation middleware for createWeeklyMealMenuValidateMiddleware
 */
exports.createWeeklyMealMenuValidateMiddleware = [
  // Language code validation
  body("lang")
    .notEmpty()
    .withMessage({ en: "Language is required", ar: "اللغة مطلوبة" })
    .isIn(["ar", "en"])
    .withMessage({ en: "Invalid language code", ar: "رمز اللغة غير صالح" }),

  // Category validation
  body("category")
    .notEmpty()
    .withMessage({ en: "Category is required", ar: "الفئة مطلوبة" })
    .isMongoId()
    .withMessage({
      en: "Category must be a valid MongoDB object ID",
      ar: "يجب أن تكون الفئة معرف خاص بكائن ل منكوديبي (قاعدة البيانات) صالحً",
    }),

  // Meal name validation
  body("meal_name")
    .notEmpty()
    .withMessage({ en: "Meal name is required", ar: "اسم الوجبة مطلوب" })
    .trim(),
  // Main badge tag validation
  body("main_badge_tag")
    .optional()
    .isString()
    .withMessage({
      en: "Main badge tag must be a string",
      ar: "يجب أن يكون تاغ الباج الرئيسي سلسلة نصية",
    })
    .trim(),
  // Preprocess tags field
  (req, res, next) => {
    // Check if tags is a string, if so convert it to an array
    if (typeof req.body.tags === "string") {
      req.body.tags = [req.body.tags];
    }
    next();
  },
  // Validate tags field
  body("tags").isArray().withMessage({
    en: "Tags must be an array with at least one element.",
    ar: "يجب أن تكون التاغات مصفوفة تحتوي على عنصر واحد على الأقل.",
  }),

  // Protein validation
  body("protein")
    .notEmpty()
    .withMessage({ en: "Protein is required", ar: "البروتين مطلوب" })
    .isNumeric()
    .withMessage({
      en: "Protein must be a number",
      ar: "يجب أن يكون البروتين رقمًا",
    })
    .trim(),

  // Fat validation
  body("fat")
    .notEmpty()
    .withMessage({ en: "Fat is required", ar: "الدهون مطلوبة" })
    .isNumeric()
    .withMessage({
      en: "Fat must be a number",
      ar: "يجب أن تكون الدهون رقمية",
    })
    .trim(),

  // Carbs validation
  body("carbs")
    .notEmpty()
    .withMessage({ en: "Carbs is required", ar: "الكربوهيدرات مطلوبة" })
    .isNumeric()
    .withMessage({
      en: "Carbs must be a number",
      ar: "يجب أن تكون الكربوهيدرات رقمية",
    })
    .trim(),

  // Ingredients validation
  body("ingredients")
    .notEmpty()
    .withMessage({ en: "Ingredients are required", ar: "المكونات مطلوبة" })
    .isString()
    .withMessage({
      en: "Ingredients must be a string",
      ar: "يجب أن تكون المكونات سلسلة نصية",
    })
    .trim(),
  // Heating instruction validation
  body("heating_instruction")
    .notEmpty()
    .withMessage({
      en: "Heating instruction is required",
      ar: "تعليمات التسخين مطلوبة",
    })
    .isString()
    .withMessage({
      en: "Heating instruction must be a string",
      ar: "يجب أن تكون تعليمات التسخين سلسلة نصية",
    })
    .trim(),
  // Available from date validation
  body("available_from")
    .notEmpty()
    .withMessage({
      en: "Available From date is required",
      ar: "تاريخ التوفر (البدأ) مطلوب",
    })
    .isISO8601()
    .withMessage({
      en: "Invalid date format for available_from",
      ar: "صيغة تاريخ غير صالحة ل available_from",
    }),

  // Unavailable from date validation
  body("unavailable_from")
    .notEmpty()
    .withMessage({
      en: "Unavailable From date is required",
      ar: "تاريخ عدم التوفر (البدأ) مطلوب",
    })
    .isISO8601()
    .withMessage({
      en: "Invalid date format for unavailable_from",
      ar: "صيغة تاريخ غير صالحة ل unavailable_from",
    }),

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
      ar: "يجب أن تكون حالة الظهور قيمة بولية (صحيحة/خاطئة) ().",
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
