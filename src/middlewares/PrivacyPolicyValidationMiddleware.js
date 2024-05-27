const { body, validationResult, query } = require("express-validator");

exports.validatePrivacyPolicyMiddleware = [
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
      en: "Privacy policy content is required.",
      ar: "محتوى سياسة الخصوصية مطلوب",
    })
    .isString()
    .withMessage({
      en: "Privacy policy content must be a string.",
      ar: "يجب أن يكون محتوى سياسة الخصوصية سلسلة نصية",
    })
    .trim(),
];
