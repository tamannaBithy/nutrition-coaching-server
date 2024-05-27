// Importing necessary modules from express-validator and mongoose
const { body, validationResult, param, query } = require("express-validator");
const { default: mongoose } = require("mongoose");

exports.validateGetNotifications = [
  // Validate limit
  query("limit").optional().isInt({ min: 1 }).withMessage({
    en: "Limit must be a positive integer",
    ar: "يجب أن يكون الحد قيمة صحيحة موجبة",
  }),
];

// Middleware for validating MongoDB ObjectId parameter
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
