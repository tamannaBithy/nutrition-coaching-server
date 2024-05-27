// Importing necessary modules from express-validator and mongoose
const { body, validationResult, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

// Validation middleware for createOfferedMealPackageService
exports.validateCreateOfferedMeal = [
  // Package Name Validation
  body("package_name")
    .isString()
    .withMessage({
      en: "Package name must be a string.",
      ar: "يجب أن يكون اسم الباكج سلسلة نصية.",
    })
    .notEmpty()
    .withMessage({
      en: "Package name is required.",
      ar: "اسم الباكج مطلوب.",
    })
    .trim(),
  // Price Validation
  body("price")
    .notEmpty()
    .withMessage({
      en: "Price is required.",
      ar: "السعر مطلوب.",
    })
    .isNumeric()
    .withMessage({
      en: "Price must be a numeric value.",
      ar: "يجب أن يكون السعر قيمة رقمية.",
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
  // Tags validation
  body("tags").isArray().withMessage({
    en: "Tags must be an array with at least one element.",
    ar: "يجب أن تكون التاغات مصفوفة تحتوي على عنصر واحد على الأقل.",
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
      ar: "يجب أن تكون حالة الظهور قيمة بولية (صحيحة/خاطئة).",
    }),
];

// Validation middleware for checking valid MongoDB ObjectId
exports.validateMongooseIdMiddleware = [
  param("mealId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error({ en: "Invalid ID", ar: "معرف غير صالح" });
    }
    return true;
  }),
];
