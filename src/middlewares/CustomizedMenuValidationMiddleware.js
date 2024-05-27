const { body, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

// Middleware for validating creating customized meals
exports.createCustomizedMealMenuValidationMiddleware = [
  // Validate lang field
  body("lang")
    .isIn(["ar", "en"])
    .withMessage({
      en: "Language must be 'ar' or 'en'.",
      ar: "يجب أن يكون اللغة 'ar' أو 'en'.",
    })
    .notEmpty()
    .withMessage({
      en: "Language is required.",
      ar: "اللغة مطلوبة",
    }),

  // Validate meal_name field
  body("meal_name").notEmpty().withMessage({
    en: "Meal name is required.",
    ar: "اسم الوجبة مطلوب.",
  }),

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
      en: "Protein amount is required.",
      ar: "البروتين مطلوب.",
    })
    .isNumeric()
    .withMessage({
      en: "Protein must be a number.",
      ar: "يجب أن يكون البروتين رقمًا.",
    }),

  // Validate fadd field
  body("fadd")
    .notEmpty()
    .withMessage({
      en: "Added fat amount is required.",
      ar: "الدهون المضافة مطلوبة.",
    })
    .isNumeric()
    .withMessage({
      en: "Added fat must be a number.",
      ar: "يجب أن تكون الدهون المضافة رقمًا.",
    }),

  // Validate carbs field
  body("carbs")
    .notEmpty()
    .withMessage({
      en: "Carbohydrates amount is required.",
      ar: "الكربوهيدرات مطلوبة.",
    })
    .isNumeric()
    .withMessage({
      en: "Carbohydrates must be a number.",
      ar: "يجب أن تكون الكربوهيدرات رقمًا.",
    }),

  // Validate prp field
  body("prp")
    .notEmpty()
    .withMessage({
      en: "Price per gram of protein is required.",
      ar: "سعر البروتين لكل غرام مطلوب.",
    })
    .isNumeric()
    .withMessage({
      en: "Price per gram of protein must be a number.",
      ar: "يجب أن يكون سعر البروتين لكل غرام رقمًا.",
    }),

  // Validate prc field
  body("prc")
    .notEmpty()
    .withMessage({
      en: "Price per gram of carb is required.",
      ar: "سعر الكربوهيدرات لكل غرام مطلوب.",
    })
    .isNumeric()
    .withMessage({
      en: "Price per gram of carb must be a number.",
      ar: "يجب أن يكون سعر الكربوهيدرات لكل غرام رقمًا.",
    }),

  // Validate prf field
  body("prf")
    .notEmpty()
    .withMessage({
      en: "Price per gram of fat is required.",
      ar: "سعر الدهون لكل غرام مطلوب.",
    })
    .isNumeric()
    .withMessage({
      en: "Price per gram of fat must be a number.",
      ar: "يجب أن يكون سعر الدهون لكل غرام رقمًا.",
    }),

  // Validate mf field
  body("mf")
    .notEmpty()
    .withMessage({
      en: "Meat factor is required.",
      ar: "عامل اللحوم مطلوب.",
    })
    .isNumeric()
    .withMessage({
      en: "Meat factor must be a number.",
      ar: "يجب أن يكون عامل اللحوم رقمًا.",
    }),

  // Validate sf field
  body("sf")
    .notEmpty()
    .withMessage({
      en: "Starch factor is required.",
      ar: "عامل النشويات مطلوب.",
    })
    .isNumeric()
    .withMessage({
      en: "Starch factor must be a number.",
      ar: "يجب أن يكون عامل النشويات رقمًا.",
    }),

  // Validate of field
  body("of")
    .notEmpty()
    .withMessage({
      en: "Oil factor is required.",
      ar: "عامل الزيوت مطلوب.",
    })
    .isNumeric()
    .withMessage({
      en: "Oil factor must be a number.",
      ar: "يجب أن يكون عامل الزيوت رقمًا.",
    }),

  // Validate fmf field
  body("fmf")
    .notEmpty()
    .withMessage({
      en: "Fat in meat factor is required.",
      ar: "عامل الدهون في اللحم مطلوب.",
    })
    .isNumeric()
    .withMessage({
      en: "Fat in meat factor must be a number.",
      ar: "يجب أن يكون عامل الدهون في اللحم رقمًا.",
    }),

  // Validate select_diet field
  body("select_diet")
    .notEmpty()
    .withMessage({
      en: "Select diet is required.",
      ar: "يجب تحديد نوع النظام الغذائي.",
    })
    .isIn(["keto diet", "clean diet"])
    .withMessage({
      en: "Select diet must be 'keto diet' or 'clean diet'.",
      ar: "يجب أن يكون نوع النظام الغذائي 'كيتو دايت' أو 'دايت نظيف'.",
    }),

  // Validate ingredients field
  body("ingredients").notEmpty().withMessage({
    en: "Ingredients are required.",
    ar: "المكونات مطلوبة.",
  }),

  // Validate heating_instruction field
  body("heating_instruction").notEmpty().withMessage({
    en: "Heating instructions are required.",
    ar: "تعليمات التسخين مطلوبة.",
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

// Middleware for validating updating customized meals
exports.updateCustomizedMealServiceValidationMiddleware = [
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
exports.validateMongooseIdIdMiddleware = [
  // Custom validator for rangeId parameter
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
