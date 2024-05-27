const { body, query } = require("express-validator");

exports.validateTermsAndConditionsMiddleware = [
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
  body("content")
    .notEmpty()
    .withMessage({
      en: "Terms and conditions content is required.",
      ar: "محتوى شروط الخدمة مطلوب",
    })
    .isString()
    .withMessage({
      en: "Terms and conditions content must be a string.",
      ar: "يجب أن يكون محتوى شروط الخدمة سلسلة نصية",
    })
    .trim(),
];
