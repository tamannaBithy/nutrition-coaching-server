// Importing necessary modules from express-validator and mongoose
const { body, validationResult, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

// Custom validator function to check min and max values
const minMaxValidator = (value, { req }) => {
  const { min, max } = req.body.ranges.find((range) => range.max === value);
  if (min >= max) {
    throw new Error({
      en: "Min must be less than max",
      ar: "يجب أن يكون الحد الأدنى أقل من الحد الأقصى",
    });
  }
  return true;
};

exports.discountValidationRules = [
  // Validate category field
  body("category")
    .notEmpty()
    .withMessage({
      en: "Category is required",
      ar: "الفئة مطلوبة",
    })
    .isIn(["mainMenu", "customizeOrder", "offers", "totalOrder"])
    .withMessage({
      en: "Invalid category",
      ar: "فئة غير صالحة",
    })
    .trim(),
  // Validate ranges field
  body("ranges")
    .notEmpty()
    .withMessage({
      en: "Ranges are required",
      ar: "المدى مطلوب",
    })
    .isArray()
    .withMessage({
      en: "Ranges must be an array",
      ar: "يجب أن تكون المديات مصفوفة",
    })
    .custom((value, { req }) => {
      if (!value.length) {
        throw new Error({
          en: "Ranges array cannot be empty",
          ar: "مصفوفة المديات لا يمكن أن تكون فارغة",
        });
      }
      for (let i = 0; i < value.length; i++) {
        const range = value[i];
        if (!range.hasOwnProperty("min")) {
          throw new Error({
            en: "Min value is required for each range",
            ar: "القيمة الدنيا مطلوبة لكل مدى",
          });
        }
        if (!range.hasOwnProperty("max")) {
          throw new Error({
            en: "Max value is required for each range",
            ar: "القيمة العظمى مطلوبة لكل مدى",
          });
        }
        if (!range.hasOwnProperty("percentage")) {
          throw new Error({
            en: "Percentage value is required for each range",
            ar: "النسبة المئوية مطلوبة لكل مدى",
          });
        }
        if (!range.hasOwnProperty("isActive")) {
          throw new Error({
            en: "isActive value is required for each range",
            ar: "قيمة isActive مطلوبة لكل مدى",
          });
        }
      }
      return true;
    }),
];

exports.updateDiscountValidationRules = [
  // Validate min field
  body("min")
    .notEmpty()
    .withMessage({
      en: "Min value is required",
      ar: "القيمة الدنيا مطلوبة",
    })
    .isInt({
      message: {
        en: "Must be an integer.",
        ar: "يجب أن يكون عددًا صحيحًا.",
      },
    }),

  // Validate max field
  body("max")
    .notEmpty()
    .withMessage({
      en: "Max value is required",
      ar: "القيمة العظمى مطلوبة",
    })
    .isInt({
      message: {
        en: "Must be an integer.",
        ar: "يجب أن يكون عددًا صحيحًا.",
      },
    }),

  // Validate percentage field
  body("percentage")
    .notEmpty()
    .withMessage({
      en: "Percentage value is required",
      ar: "قيمة النسبة المئوية مطلوبة",
    })
    .isInt({
      message: {
        en: "Must be an integer.",
        ar: "يجب أن يكون عددًا صحيحًا.",
      },
    }),

  // Validate isActive field
  body("isActive")
    .custom((value) => {
      if (typeof value !== "boolean") {
        throw new Error({
          en: "Invalid isActive value. Please provide a valid boolean value.",
          ar: "قيمة isActive غير صالحة. يرجى تقديم قيمة قيمة بولية (صحيحة/خاطئة) صالحة.",
        });
      }
      return true;
    })
    .withMessage({
      en: "Invalid isActive value. Please provide a valid boolean value.",
      ar: "قيمة isActive غير صالحة. يرجى تقديم قيمة قيمة بولية (صحيحة/خاطئة) صالحة.",
    }),
];

// Middleware for validating MongoDB ObjectId parameter for discount
exports.validateMongooseDiscountIdMiddleware = [
  // Custom validator for discountId parameter
  param("discountId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error({
        en: "Invalid ID",
        ar: "معرف غير صالح",
      });
    }
    return true;
  }),
];

// Middleware for validating MongoDB ObjectId parameter for range
exports.validateMongooseRangeIdIdMiddleware = [
  // Custom validator for rangeId parameter
  param("rangeId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error({
        en: "Invalid ID",
        ar: "معرف غير صالح",
      });
    }
    return true;
  }),
];
