const { body, validationResult, param } = require("express-validator");
const mongoose = require("mongoose");

const minMaxValidator = (value, { req }) => {
  const { min, max } = req.body.ranges.find((range) => range.max === value);
  if (min >= max) {
    throw new Error("Min must be less than max");
  }
  return true;
};

const discountValidationRules = [
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["mainMenu", "customizeOrder", "offers", "totalOrder"])
    .withMessage("Invalid category")
    .trim(),
  body("ranges")
    .notEmpty()
    .withMessage("Ranges are required")
    .isArray()
    .withMessage("Ranges must be an array")
    .custom((value) => {
      if (!value.length) {
        throw new Error("Ranges array cannot be empty");
      }
      for (const range of value) {
        if (!range.min) {
          throw new Error("Min value is required for each range");
        }
        if (!range.max) {
          throw new Error("Max value is required for each range");
        }
        if (!range.percentage) {
          throw new Error("Percentage value is required for each range");
        }
        if (typeof range.isActive === "undefined") {
          throw new Error("isActive value is required for each range");
        }
      }
      return true;
    }),
];

const updateDiscountValidationRules = [
  body("min")
    .notEmpty()
    .withMessage("Min value is required")
    .isInt()
    .withMessage("Must be an integer."),
  body("max")
    .notEmpty()
    .withMessage("Max value is required")
    .isInt()
    .withMessage("Must be an integer."),
  body("percentage")
    .notEmpty()
    .withMessage("Percentage value is required")
    .isInt()
    .withMessage("Must be an integer."),
  body("isActive")
    .isBoolean()
    .withMessage(
      "Invalid isActive value. Please provide a valid boolean value."
    ),
];

const validateMongooseDiscountIdMiddleware = [
  param("discountId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid ID");
    }
    return true;
  }),
];

const validateMongooseRangeIdIdMiddleware = [
  param("rangeId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid ID");
    }
    return true;
  }),
];

module.exports = {
  validateMongooseRangeIdIdMiddleware,
  validateMongooseDiscountIdMiddleware,
  updateDiscountValidationRules,
  discountValidationRules,
};
