// Importing necessary modules from express-validator and mongoose
const {
  validationResult,
  param,
  body,
  isMongoId,
} = require("express-validator");
const mongoose = require("mongoose");

// Create Main Meal Menu Validation Middleware
exports.createMainMealMenuValidationMiddleware = [
  // Validate lang field
  body("lang")
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
    .isIn(["ar", "en"])
    .withMessage({
      en: "Invalid language code.",
      ar: "رمز اللغة غير صالح.",
    }),

  // Validate preference field
  body("preference")
    .notEmpty()
    .withMessage({
      en: "Preference is required.",
      ar: "التفضيل مطلوب.",
    })
    .isMongoId()
    .withMessage({
      en: "Preference must be a valid MongoDB object ID.",
      ar: "يجب أن يكون التفضيل معرف خاص بكائن ل منكوديبي (قاعدة البيانات) صالحًا.",
    }),

  // Validate type_of_meal field
  body("type_of_meal")
    .notEmpty()
    .withMessage({
      en: "Type of meal is required.",
      ar: "نوع الوجبة مطلوب.",
    })
    .isMongoId()
    .withMessage({
      en: "Type of meal must be a valid MongoDB object ID.",
      ar: "يجب أن يكون نوع الوجبة معرف خاص بكائن ل منكوديبي (قاعدة البيانات) صالحًا.",
    }),

  // Validate meal_name field
  body("meal_name")
    .notEmpty()
    .withMessage({
      en: "Meal name is required.",
      ar: "اسم الوجبة مطلوب.",
    })
    .isString()
    .withMessage({
      en: "Meal name must be a string.",
      ar: "يجب أن يكون اسم الوجبة سلسلة نصية.",
    })
    .trim(),
  // Validate main_badge_tag field (optional)
  body("main_badge_tag")
    .notEmpty()
    .withMessage({
      en: "Main badge tag is required.",
      ar: "تاغ الباج الرئيسي مطلوب.",
    })
    .isString()
    .withMessage({
      en: "Main badge tag must be a string.",
      ar: "يجب أن يكون تاغ الباج الرئيسي سلسلة نصية.",
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

  // Validate protein field
  body("protein")
    .notEmpty()
    .withMessage({
      en: "Protein is required.",
      ar: "البروتين مطلوب.",
    })
    .isNumeric()
    .withMessage({
      en: "Protein must be a number.",
      ar: "يجب أن يكون البروتين رقمًا.",
    })
    .trim(),
  // Validate fat field
  body("fat")
    .notEmpty()
    .withMessage({
      en: "Fat is required.",
      ar: "الدهون مطلوبة.",
    })
    .isNumeric()
    .withMessage({
      en: "Fat must be a number.",
      ar: "يجب أن تكون الدهون رقمًا.",
    })
    .trim(),
  // Validate carbs field
  body("carbs")
    .notEmpty()
    .withMessage({
      en: "Carbs is required.",
      ar: "الكربوهيدرات مطلوبة.",
    })
    .isNumeric()
    .withMessage({
      en: "Carbs must be a number.",
      ar: "يجب أن تكون الكربوهيدرات رقمًا.",
    })
    .trim(),
  // Validate ingredients field
  body("ingredients")
    .notEmpty()
    .withMessage({
      en: "Ingredients are required.",
      ar: "المكونات مطلوبة.",
    })
    .isString()
    .withMessage({
      en: "Ingredients must be a string.",
      ar: "يجب أن تكون المكونات سلسلة نصية.",
    })
    .trim(),
  // Validate heating_instruction field
  body("heating_instruction")
    .notEmpty()
    .withMessage({
      en: "Heating instruction is required.",
      ar: "تعليمات التسخين مطلوبة.",
    })
    .isString()
    .withMessage({
      en: "Heating instruction must be a string.",
      ar: "يجب أن تكون تعليمات التسخين سلسلة نصية.",
    })
    .trim(),
  // Validate old_price field
  body("old_price")
    .optional()
    .isNumeric()
    .withMessage({
      en: "Old price must be a number.",
      ar: "يجب أن يكون السعر القديم رقمًا.",
    })
    .trim(),
  // Validate regular_price field
  body("regular_price")
    .notEmpty()
    .withMessage({
      en: "Regular price is required.",
      ar: "السعر العادي مطلوب.",
    })
    .isNumeric()
    .withMessage({
      en: "Regular price must be a number.",
      ar: "يجب أن يكون السعر العادي رقمًا.",
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

// Update Main Meal Menu Validation Middleware
exports.updateMainMealMenuValidationMiddleware = [
  // Validate lang field
  body("lang")
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
    .isIn(["ar", "en"])
    .withMessage({
      en: "Invalid language code.",
      ar: "رمز لغة غير صالح.",
    }),

  // Validate preference field
  body("preference")
    .notEmpty()
    .withMessage({
      en: "Preference is required.",
      ar: "التفضيل مطلوب.",
    })
    .isMongoId()
    .withMessage({
      en: "Preference must be a valid MongoDB object ID.",
      ar: "يجب أن يكون التفضيل معرف خاص بكائن ل منكوديبي (قاعدة البيانات) صالحًا.",
    }),

  // Validate type_of_meal field
  body("type_of_meal")
    .notEmpty()
    .withMessage({
      en: "Type of meal is required.",
      ar: "نوع الوجبة مطلوب.",
    })
    .isMongoId()
    .withMessage({
      en: "Type of meal must be a valid MongoDB object ID.",
      ar: "يجب أن يكون نوع الوجبة معرف خاص بكائن ل منكوديبي (قاعدة البيانات) صالحًا.",
    }),

  // Validate meal_name field
  body("meal_name")
    .notEmpty()
    .withMessage({
      en: "Meal name is required.",
      ar: "اسم الوجبة مطلوب.",
    })
    .isString()
    .withMessage({
      en: "Meal name must be a string.",
      ar: "يجب أن يكون اسم الوجبة سلسلة نصية.",
    })
    .trim(),
  // Validate main_badge_tag field (optional)
  body("main_badge_tag")
    .notEmpty()
    .withMessage({
      en: "Main badge tag is required.",
      ar: "تاغ الباج الرئيسي مطلوب.",
    })
    .isString()
    .withMessage({
      en: "Main badge tag must be a string.",
      ar: "يجب أن يكون تاغ الباج الرئيسي سلسلة نصية.",
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

  // Validate protein field
  body("protein")
    .notEmpty()
    .withMessage({
      en: "Protein is required.",
      ar: "البروتين مطلوب.",
    })
    .isNumeric()
    .withMessage({
      en: "Protein must be a number.",
      ar: "يجب أن يكون البروتين رقمًا.",
    })
    .trim(),
  // Validate fat field
  body("fat")
    .notEmpty()
    .withMessage({
      en: "Fat is required.",
      ar: "الدهون مطلوبة.",
    })
    .isNumeric()
    .withMessage({
      en: "Fat must be a number.",
      ar: "يجب أن تكون الدهون رقمًا.",
    })
    .trim(),
  // Validate carbs field
  body("carbs")
    .notEmpty()
    .withMessage({
      en: "Carbs is required.",
      ar: "الكربوهيدرات مطلوبة.",
    })
    .isNumeric()
    .withMessage({
      en: "Carbs must be a number.",
      ar: "يجب أن تكون الكربوهيدرات رقمًا.",
    })
    .trim(),
  // Validate ingredients field
  body("ingredients")
    .notEmpty()
    .withMessage({
      en: "Ingredients are required.",
      ar: "المكونات مطلوبة.",
    })
    .isString()
    .withMessage({
      en: "Ingredients must be a string.",
      ar: "يجب أن تكون المكونات سلسلة نصية.",
    })
    .trim(),
  // Validate heating_instruction field
  body("heating_instruction")
    .notEmpty()
    .withMessage({
      en: "Heating instruction is required.",
      ar: "تعليمات التسخين مطلوبة.",
    })
    .isString()
    .withMessage({
      en: "Heating instruction must be a string.",
      ar: "يجب أن تكون تعليمات التسخين سلسلة نصية.",
    })
    .trim(),
  // Validate old_price field
  body("old_price")
    .optional()
    .isNumeric()
    .withMessage({
      en: "Old price must be a number.",
      ar: "يجب أن يكون السعر القديم رقمًا.",
    })
    .trim(),
  // Validate regular_price field
  body("regular_price")
    .notEmpty()
    .withMessage({
      en: "Regular price is required.",
      ar: "السعر العادي مطلوب.",
    })
    .isNumeric()
    .withMessage({
      en: "Regular price must be a number.",
      ar: "يجب أن يكون السعر العادي رقمًا.",
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
      throw new Error({
        en: "Invalid ID",
        ar: "معرف غير صالح",
      });
    }
    return true;
  }),
];
