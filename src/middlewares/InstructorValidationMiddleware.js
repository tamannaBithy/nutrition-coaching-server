// Importing necessary modules from express-validator
const { validationResult, param, body } = require("express-validator");
const { default: mongoose } = require("mongoose");

// Middleware for validating the creation of an instructor
exports.createInstructorValidationMiddleware = [
  // Validate lang field
  body("lang")
    .notEmpty()
    .withMessage({
      en: "Language is required",
      ar: "اللغة مطلوبة",
    })
    .isString()
    .withMessage({
      en: "Language must be a string",
      ar: "يجب أن تكون اللغة سلسلة نصية",
    })
    .isIn(["ar", "en"])
    .withMessage({
      en: "Invalid language code",
      ar: "رمز اللغة غير صالح",
    }),

  // Validate instructor_name field
  body("instructor_name")
    .notEmpty()
    .withMessage({
      en: "Instructor name is required",
      ar: "اسم المدرب مطلوب",
    })
    .isString()
    .withMessage({
      en: "Instructor name must be a string",
      ar: "يجب أن يكون اسم المدرب سلسلة نصية",
    })
    .trim(),
  // Validate instructor_qualification field
  body("instructor_qualification")
    .notEmpty()
    .withMessage({
      en: "Instructor qualification is required",
      ar: "المؤهلات للمدرب مطلوبة",
    })
    .isString()
    .withMessage({
      en: "Instructor qualification must be a string",
      ar: "يجب أن تكون المؤهلات الخاصة بالمدرب سلسلة نصية",
    })
    .trim(),
  // Validate instructor_details field
  body("instructor_details")
    .notEmpty()
    .withMessage({
      en: "Instructor details is required",
      ar: "تفاصيل المدرب مطلوبة",
    })
    .isString()
    .withMessage({
      en: "Instructor details must be a string",
      ar: "يجب أن تكون تفاصيل المدرب سلسلة نصية",
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

// Middleware for validating the update of an instructor
exports.updateInstructorValidationMiddleware = [
  // Validate lang field
  body("lang")
    .notEmpty()
    .withMessage({
      en: "Language is required",
      ar: "اللغة مطلوبة",
    })
    .isString()
    .withMessage({
      en: "Language must be a string",
      ar: "يجب أن تكون اللغة سلسلة نصية",
    })
    .isIn(["ar", "en"])
    .withMessage({
      en: "Invalid language code",
      ar: "رمز اللغة غير صالح",
    }),

  // Validate instructor_name field
  body("instructor_name")
    .notEmpty()
    .withMessage({
      en: "Instructor name is required",
      ar: "اسم المدرب مطلوب",
    })
    .isString()
    .withMessage({
      en: "Instructor name must be a string",
      ar: "يجب أن يكون اسم المدرب سلسلة نصية",
    })
    .trim(),
  // Validate instructor_qualification field
  body("instructor_qualification")
    .notEmpty()
    .withMessage({
      en: "Instructor qualification is required",
      ar: "مؤهلات المدرب مطلوبة",
    })
    .isString()
    .withMessage({
      en: "Instructor qualification must be a string",
      ar: "يجب أن تكون المؤهلات الخاصة بالمدرب سلسلة نصية",
    })
    .trim(),
  // Validate instructor_details field
  body("instructor_details")
    .notEmpty()
    .withMessage({
      en: "Instructor details is required",
      ar: "تفاصيل المدرب مطلوبة",
    })
    .isString()
    .withMessage({
      en: "Instructor details must be a string",
      ar: "يجب أن تكون تفاصيل المدرب سلسلة نصية",
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

// Middleware for validating MongoDB ObjectId parameter
exports.validateMongooseIdMiddleware = [
  // Custom validator for id parameter
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error({
        en: "Invalid ID",
        ar: "المعرف غير صالح",
      });
    }
    return true;
  }),
];
