// Importing necessary modules from express-validator
const { body, validationResult } = require("express-validator");

// Function to generate common validators for user data
const generateCommonValidator = () => [
  // Validator for 'weight' field
  body("weight")
    .notEmpty()
    .withMessage({ en: "Weight is required", ar: "الوزن مطلوب" })
    .isNumeric()
    .withMessage({
      en: "Weight must be a number",
      ar: "يجب أن يكون الوزن رقمًا",
    })
    .trim(),
  // Validator for 'height' field
  body("height")
    .notEmpty()
    .withMessage({ en: "Height is required", ar: "الطول مطلوب" })
    .isNumeric()
    .withMessage({
      en: "Height must be a number",
      ar: "يجب أن يكون الطول رقمًا",
    })
    .trim(),
  // Validator for 'age' field
  body("age")
    .notEmpty()
    .withMessage({ en: "Age is required", ar: "العمر مطلوب" })
    .isNumeric()
    .withMessage({ en: "Age must be a number", ar: "يجب أن يكون العمر رقمًا" })
    .trim(),
  // Validator for 'gender' field
  body("gender")
    .notEmpty()
    .withMessage({ en: "Gender is required", ar: "الجنس مطلوب" })
    .isIn(["man", "woman"])
    .withMessage({
      en: "Gender must be 'man' or 'woman'",
      ar: "يجب أن يكون الجنس 'رجل' أو 'امرأة'",
    }),

  // Validator for 'fat_percentage' field
  body("fat_percentage")
    .notEmpty()
    .withMessage({ en: "Fat percentage is required", ar: "نسبة الدهون مطلوبة" })
    .isNumeric()
    .withMessage({
      en: "Fat percentage must be a number",
      ar: "يجب أن تكون نسبة الدهون رقمًا",
    })
    .custom((value) => {
      const minFatPercentage = 5;
      if (parseFloat(value) < minFatPercentage) {
        throw new Error({
          en: `Fat percentage must be greater than or equal to ${minFatPercentage}`,
          ar: `يجب أن تكون نسبة الدهون أكبر من أو تساوي ${minFatPercentage}`,
        });
      }
      return true;
    })
    .trim(),
  // Validator for 'ALF' field
  body("ALF")
    .notEmpty()
    .withMessage({ en: "ALF is required", ar: "ALF مطلوب" })
    .toInt()
    .isInt({ min: 1, max: 6 })
    .withMessage({
      en: "ALF must be an integer between 1 and 6",
      ar: "يجب أن يكون ALF عددًا صحيحًا بين 1 و 6",
    })
    .trim(),
];

// Validator for user keto data, extending common validators
const validateUserKetoData = generateCommonValidator().concat([
  // Validator for 'diet_goal' field specific to user keto data
  body("diet_goal")
    .notEmpty()
    .withMessage({ en: "Diet goal is required", ar: "الهدف الغذائي مطلوب" })
    .isIn(["maintain weight & muscles", "loss fat"])
    .withMessage({
      en: "Diet goal must be 'maintain weight & muscles' or 'loss fat'",
      ar: "يجب أن يكون الهدف الغذائي 'الحفاظ على الوزن والعضلات' أو 'فقدان الدهون'",
    }),
]);

// Validator for user macro data, extending common validators
// Validator for user macro data, extending common validators
const validateUserMacroData = generateCommonValidator().concat([
  // Validator for 'diet_goal' field specific to user macro data
  body("diet_goal")
    .notEmpty()
    .withMessage({ en: "Diet goal is required", ar: "الهدف الغذائي مطلوب" })
    .isIn(["gain muscles", "maintain muscles", "loss fat"])
    .withMessage({
      en: "Diet goal must be 'maintain muscles', 'gain muscles', or 'loss fat'",
      ar: "يجب أن يكون الهدف الغذائي 'الحفاظ على العضلات', 'زيادة العضلات', أو 'فقدان الدهون'",
    }),

  // Validator for 'body_type' field specific to user macro data
  body("body_type")
    .notEmpty()
    .withMessage({ en: "Body type is required", ar: "نوع الجسم مطلوب" })
    .isIn(["ectomorph", "mesomorph", "andromorph"])
    .withMessage({
      en: "Body type must be 'ectomorph', 'mesomorph', or 'andromorph'",
      ar: "يجب أن يكون نوع الجسم 'إيكتومورف', 'ميزومورف', أو 'أندرومورف'",
    }),
]);

// List of fields to validate for admin keto data
const fieldsToValidate = [
  "ALF1",
  "ALF2",
  "ALF3",
  "ALF4",
  "ALF5",
  "ALF6",
  "cam",
  "pm",
  "cm",
  "fm",
  "cal",
  "pl",
  "cl",
  "fl",
  "cage",
  "cagm",
  "caga",
  "came",
  "camm",
  "cama",
  "cale",
  "calm",
  "cala",
  "pge",
  "pgm",
  "pga",
  "pme",
  "pmm",
  "pma",
  "ple",
  "plm",
  "pla",
  "cge",
  "cgm",
  "cga",
  "cme",
  "cmm",
  "cma",
  "cle",
  "clm",
  "cla",
  "fge",
  "fgm",
  "fga",
  "fme",
  "fmm",
  "fma",
  "fle",
  "flm",
  "fla",
];

// Validator for admin keto data, validating each field
const validateAdminKetoData = fieldsToValidate.map((field) => {
  return body(field)
    .notEmpty()
    .withMessage({ en: `${field} is required`, ar: `ال${field} مطلوب` })
    .isNumeric()
    .withMessage({
      en: `${field} must be a number`,
      ar: `${field} يجب أن يكون رقمًا`,
    })
    .trim();
});

module.exports = {
  validateUserKetoData,
  validateUserMacroData,
  validateAdminKetoData,
};
