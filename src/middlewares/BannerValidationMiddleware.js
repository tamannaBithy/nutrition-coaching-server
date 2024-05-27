// Importing necessary modules from express-validator and mongoose
const { body, validationResult, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

// Middleware for validating the creation of a banner
exports.createBannerValidationMiddleware = [
  // Validate banner_heading field
  body("banner_heading")
    .notEmpty()
    .withMessage({
      en: "Banner heading is required.",
      ar: "عنوان البانر مطلوب.",
    })
    .trim(),

  // Validate banner_paragraph field
  body("banner_paragraph")
    .notEmpty()
    .withMessage({
      en: "Banner paragraph is required.",
      ar: "فقرة البانر مطلوبة.",
    })
    .isString()
    .withMessage({
      en: "Banner paragraph must be a string.",
      ar: "يجب أن تكون فقرة البانر سلسلة نصية.",
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

  // Validate lang field, which is optional
  body("lang")
    .trim()
    .notEmpty()
    .withMessage({
      en: "Language is required.",
      ar: "اللغة مطلوبة",
    })
    .isString()
    .withMessage({
      en: "Language must be a string.",
      ar: "يجب أن تكون اللغة سلسلة نصية.",
    })
    .isIn(["en", "ar"])
    .withMessage({
      en: "Invalid language code. Must be 'en' or 'ar'.",
      ar: "رمز لغة غير صالح يجب أن يكون 'en' أو 'ar'",
    }),
];

// Middleware for validating the update of a banner
exports.updateBannerValidationMiddleware = [
  // Validate banner_heading field
  body("banner_heading")
    .notEmpty()
    .withMessage({
      en: "Banner heading is required.",
      ar: "عنوان البانر مطلوب.",
    })
    .trim(),

  // Validate banner_paragraph field
  body("banner_paragraph")
    .notEmpty()
    .withMessage({
      en: "Banner paragraph is required.",
      ar: "فقرة البانر مطلوبة.",
    })
    .isString()
    .withMessage({
      en: "Banner paragraph must be a string.",
      ar: "يجب أن تكون فقرة البانر سلسلة نصية.",
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

  // Validate lang field, which is optional
  body("lang")
    .trim()
    .notEmpty()
    .withMessage({
      en: "Language is required.",
      ar: "اللغة مطلوبة",
    })
    .isString()
    .withMessage({
      en: "Language must be a string.",
      ar: "يجب أن تكون اللغة سلسلة نصية.",
    })
    .isIn(["en", "ar"])
    .withMessage({
      en: "Invalid language code. Must be 'en' or 'ar'.",
      ar: "رمز لغة غير صالح يجب أن يكون 'en' أو 'ar'",
    }),
];

// Middleware for validating mongoose ID parameter
exports.validateMongooseIdMiddleware = [
  // Custom validator for ID parameter
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid ID");
    }
    return true;
  }),
];
