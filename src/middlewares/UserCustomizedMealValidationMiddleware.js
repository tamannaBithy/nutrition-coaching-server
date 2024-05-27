const { body } = require("express-validator");

exports.createUserCustomizedMealValidationMiddleware = [
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

  // Validate fat field
  body("fat")
    .notEmpty()
    .withMessage({
      en: "Fat amount is required.",
      ar: "الدهون مطلوبة.",
    })
    .isNumeric()
    .withMessage({
      en: "Fat must be a number.",
      ar: "يجب أن تكون الدهون رقمًا.",
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

  // Validate category field
  body("category")
    .notEmpty()
    .withMessage({
      en: "Category is required.",
      ar: "التصنيف مطلوب.",
    })
    .isIn(["keto diet", "clean diet"])
    .withMessage({
      en: "Category must be either 'keto' or 'clean'.",
      ar: "يجب أن يكون التصنيف إما 'كيتو' أو 'نظيف'.",
    }),
];
