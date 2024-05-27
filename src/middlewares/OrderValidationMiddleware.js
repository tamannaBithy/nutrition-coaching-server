// Importing necessary modules from express-validator
const { body, validationResult, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

// Validation middleware for placing an order
exports.placeOrderValidation = [
  // Validate optional note_from_user field
  body("note_from_user")
    .optional()
    .isString()
    .withMessage({
      en: "Note from user must be a string",
      ar: "يجب أن يكون الملاحظة من المستخدم سلسلة نصية",
    })
    .trim(),

  // Validate delivery_address field
  body("delivery_address")
    .notEmpty()
    .withMessage({
      en: "Delivery Address is required",
      ar: "عنوان التوصيل مطلوب",
    })
    .isString()
    .withMessage({
      en: "Delivery address must be a non-empty string",
      ar: "يجب أن يكون عنوان التسليم سلسلة نصية غير فارغة",
    })
    .trim(),
  // Validate optional payment_method field
  body("payment_method")
    .optional()
    .isString()
    .withMessage({
      en: "Payment method must be a non-empty string",
      ar: "يجب أن يكون طريقة الدفع سلسلة نصية غير فارغة",
    })
    .trim(),

  // Validate optional number_of_meals_per_day field
  body("number_of_meals_per_day")
    .optional()
    .isNumeric()
    .withMessage({
      en: "Number of meals per day must be a numeric value",
      ar: "يجب أن يكون عدد الوجبات في اليوم قيمة رقمية",
    })
    .trim(),

  // Validate optional plan_duration field
  body("plan_duration")
    .optional()
    .isNumeric()
    .withMessage({
      en: "Plan duration must be a numeric value",
      ar: "يجب أن يكون مدة الخطة قيمة رقمية",
    })
    .trim(),
];

// Validation middleware for validating order status update
exports.validateOrderStatus = [
  // Validate newStatus field
  body("newStatus")
    .notEmpty()
    .withMessage({ en: "New Status is required", ar: "الحالة الجديدة مطلوبة" })
    .isString()
    .withMessage({
      en: "New Status must be a string",
      ar: "يجب أن تكون الحالة الجديدة سلسلة نصية",
    })
    .isIn(["pending", "confirm", "rejected"])
    .withMessage({
      en: "Invalid status value. Please provide a valid status.",
      ar: "قيمة الحالة غير صالحة. يرجى تقديم حالة صالحة.",
    })
    .trim(),
];

// Validation middleware for validating delivery status update
exports.validateDeliveryStatus = [
  // Validate newStatus field
  body("newStatus")
    .notEmpty()
    .withMessage({ en: "New Status is required", ar: "الحالة الجديدة مطلوبة" })
    .isString()
    .withMessage({
      en: "New Status must be a string",
      ar: "يجب أن تكون الحالة الجديدة سلسلة نصية",
    })
    .isIn(["pending", "shipped", "delivered"])
    .withMessage({
      en: "Invalid delivery status value. Please provide a valid status.",
      ar: "قيمة حالة التسليم غير صالحة. يرجى تقديم حالة صالحة.",
    })
    .trim(),
];

// Validation middleware for validating payment status update
exports.validatePaymentStatus = [
  // Validate newStatus field
  body("newStatus")
    .custom((value) => {
      if (typeof value !== "boolean") {
        throw new Error({
          en: "Invalid payment status value. Please provide a valid boolean value.",
          ar: "قيمة حالة الدفع غير صالحة. يرجى تقديم قيمة بولية (صحيحة/خاطئة) صالحة.",
        });
      }
      return true;
    })
    .withMessage({
      en: "Invalid payment status value. Please provide a valid boolean value.",
      ar: "قيمة حالة الدفع غير صالحة. يرجى تقديم قيمة بولية (صحيحة/خاطئة) صالحة.",
    }),
];

// Middleware for validating MongoDB ObjectId parameter
exports.validateMongooseIdMiddleware = [
  // Custom validator for orderId parameter
  param("orderId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error({
        en: "Invalid ID",
        ar: "معرف غير صالح",
      });
    }
    return true;
  }),
];
