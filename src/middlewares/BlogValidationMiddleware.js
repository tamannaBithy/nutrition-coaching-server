// Importing necessary modules from express-validator
const { body, validationResult, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

// Middleware for validating the creation of a blog
exports.createBlogValidationMiddleware = [
  // Validate blog_title field
  body("blog_title")
    .notEmpty()
    .withMessage({
      en: "Blog title is required.",
      ar: "عنوان المدونة مطلوب.",
    })
    .isString()
    .withMessage({
      en: "Blog title must be a string.",
      ar: "يجب أن يكون عنوان المدونة سلسلة نصية.",
    })
    .trim(),
  // Validate blog_description field
  body("blog_description")
    .notEmpty()
    .withMessage({
      en: "Blog description is required.",
      ar: "وصف المدونة مطلوب.",
    })
    .isString()
    .withMessage({
      en: "Blog description must be a string.",
      ar: "يجب أن يكون وصف المدونة سلسلة نصية.",
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

// Middleware for validating the update of a blog
exports.updateBlogValidationMiddleware = [
  // Validate blog_title field
  body("blog_title")
    .notEmpty()
    .withMessage({
      en: "Blog title is required.",
      ar: "عنوان المدونة مطلوب.",
    })
    .isString()
    .withMessage({
      en: "Blog title must be a string.",
      ar: "يجب أن يكون عنوان المدونة سلسلة نصية.",
    })
    .trim(),
  // Validate blog_description field
  body("blog_description")
    .notEmpty()
    .withMessage({
      en: "Blog description is required.",
      ar: "وصف المدونة مطلوب.",
    })
    .isString()
    .withMessage({
      en: "Blog description must be a string.",
      ar: "يجب أن يكون وصف المدونة سلسلة نصية.",
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
