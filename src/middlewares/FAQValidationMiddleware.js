const { body, param, query } = require("express-validator");
const mongoose = require("mongoose");

/**
 * Middleware to validate the data when creating a new FAQ.
 */
exports.validateCreateFAQMiddleware = [
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
      ar: "يجب أن تكون اللغة سلسلة نصية",
    })
    .isIn(["en", "ar"])
    .withMessage({
      en: "Invalid language code. Must be 'en' or 'ar'.",
      ar: "رمز لغة غير صالح يجب أن يكون 'en' أو 'ar'",
    }),
  body("title").notEmpty().withMessage({
    en: "Title is required.",
    ar: "العنوان مطلوب",
  }),
  body("description").notEmpty().withMessage({
    en: "Description is required.",
    ar: "الوصف مطلوب",
  }),
];

/**
 * Middleware to validate the data when updating an existing FAQ.
 */
exports.validateUpdateFAQMiddleware = [
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error({
        en: "Invalid FAQ ID.",
        ar: "معرف الأسئلة الشائعة غير صالح",
      });
    }
    return true;
  }),
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
      ar: "يجب أن تكون اللغة سلسلة نصية",
    })
    .isIn(["en", "ar"])
    .withMessage({
      en: "Invalid language code. Must be 'en' or 'ar'.",
      ar: "رمز لغة غير صالح يجب أن يكون 'en' أو 'ar'",
    }),
  body("title").notEmpty().withMessage({
    en: "Title is required.",
    ar: "العنوان مطلوب",
  }),
  body("description").notEmpty().withMessage({
    en: "Description is required.",
    ar: "الوصف مطلوب",
  }),
];
