// Importing necessary modules from express-validator and mongoose
const { body, validationResult, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

// Middleware for validating adding to main meal cart
exports.addToMainMealCartValidationMiddleware = [
  // Validate mainMealsMenu field
  body("mainMealsMenu")
    .notEmpty()
    .withMessage({
      en: "Main meal menu ID is required.",
      ar: "معرف قائمة الوجبات الرئيسية مطلوب.",
    })
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error({
          en: "Invalid ID",
          ar: "معرف غير صالح",
        });
      }
      return true;
    }),

  // Validate quantity field
  body("quantity")
    .notEmpty()
    .withMessage({
      en: "Quantity is required.",
      ar: "الكمية مطلوبة.",
    })
    .isInt({ min: 1 })
    .withMessage({
      en: "Quantity must be a positive integer.",
      ar: "يجب أن تكون الكمية عدد صحيح إيجابي.",
    })
    .trim(),
];

// Middleware for validating adding to offered meal cart
exports.addToOfferedMealCartValidationMiddleware = [
  // Validate offeredMealsMenu field
  body("offeredMealsMenu")
    .notEmpty()
    .withMessage({
      en: "Offered meal menu ID is required.",
      ar: "معرف قائمة الوجبات المقدمة مطلوب.",
    })
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error({
          en: "Invalid ID",
          ar: "معرف غير صالح",
        });
      }
      return true;
    }),

  // Validate quantity field
  body("quantity")
    .notEmpty()
    .withMessage({
      en: "Quantity is required.",
      ar: "الكمية مطلوبة.",
    })
    .isInt({ min: 1 })
    .withMessage({
      en: "Quantity must be a positive integer.",
      ar: "يجب أن تكون الكمية عدد صحيح إيجابي.",
    })
    .trim(),
];

// Middleware for validating cart MongoDB ObjectId parameter
exports.validateCartMongooseIdMiddleware = [
  // Custom validator for cartId parameter
  param("cartId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error({
        en: "Invalid ID",
        ar: "معرف غير صالح",
      });
    }
    return true;
  }),
];

// Middleware for validating menu MongoDB ObjectId parameter
exports.validateMenuMongooseIdMiddleware = [
  // Custom validator for menuId parameter
  param("menuId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error({
        en: "Invalid ID",
        ar: "معرف غير صالح",
      });
    }
    return true;
  }),
];
