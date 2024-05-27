// Importing necessary modules from express-validator
const { body, validationResult, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

// Validation middleware for user registration
exports.userRegistrationValidator = [
  // Middleware to trim email and phone values
  (req, res, next) => {
    req.body.email = req?.body?.email.trim();
    req.body.phone = req?.body?.phone.trim();
    next();
  },
  // Custom validator for checking if at least one of email or phone is provided
  body("error").custom((value, { req }) => {
    const { email, phone } = req.body;

    if (!email && !phone) {
      throw new Error({
        en: "At least one of email or phone must be provided",
        ar: "يجب توفير عنوان البريد الإلكتروني أو رقم الهاتف على الأقل",
      });
    } else if (!email && phone === "") {
      throw new Error({
        en: "Phone cannot be empty if email is not provided",
        ar: "لا يمكن أن يكون رقم الهاتف فارغًا إذا لم يتم تقديم عنوان البريد الإلكتروني",
      });
    } else if (email === "" && !phone) {
      throw new Error({
        en: "Email cannot be empty if phone is not provided",
        ar: "لا يمكن أن يكون عنوان البريد الإلكتروني فارغًا إذا لم يتم تقديم رقم الهاتف",
      });
    }

    return true;
  }),

  // Validator for password field
  body("password")
    .notEmpty()
    .withMessage({ en: "Password is required", ar: "كلمة المرور مطلوبة" })
    .isLength({ min: 6 })
    .withMessage({
      en: "Password must be at least 6 characters long",
      ar: "يجب أن تتكون كلمة المرور من ما لا يقل عن 6 أحرف",
    }),
];

/// Validation middleware for forget password otp service
exports.forgetPasswordOTPValidator = [
  // Validator for phone field
  body("phone")
    .notEmpty()
    .withMessage({ en: "Phone number is required", ar: "رقم الهاتف مطلوب" })
    .isMobilePhone()
    .withMessage({
      en: "Invalid phone number format",
      ar: "صيغة رقم الهاتف غير صالح",
    })
    .trim(),

  // Validator for smsViaMethod field
  body("smsViaMethod")
    .notEmpty()
    .withMessage({
      en: "SMS method is required",
      ar: "طريقة إرسال الرسائل القصيرة مطلوبة",
    })
    .isString()
    .withMessage({
      en: "SMS method must be a string",
      ar: "يجب أن تكون طريقة إرسال الرسائل القصيرة سلسلة نصية",
    })
    .isIn(["whatsapp", "smsToPhone"])
    .withMessage({
      en: "Invalid SMS method value. It must be either 'whatsapp' or 'smsToPhone'",
      ar: "قيمة طريقة إرسال الرسائل القصيرة غير صالحة. يجب أن تكون 'whatsapp' أو 'smsToPhone'",
    })
    .trim(),
];

// Validation middleware for updateUserService
exports.updateUserValidator = [
  // Validator for userInfos.phone field
  body("userInfos.phone")
    .notEmpty()
    .withMessage({ en: "Phone is required", ar: "الهاتف مطلوب" })
    .isString()
    .withMessage({
      en: "Phone must be a string",
      ar: "يجب أن يكون الهاتف سلسلة نصية",
    })
    .trim(),

  // Validator for userInfos.email field
  body("userInfos.email")
    .notEmpty()
    .withMessage({ en: "Email is required", ar: "البريد الإلكتروني مطلوب" })
    .isEmail()
    .withMessage({
      en: "Invalid email address",
      ar: "عنوان البريد الإلكتروني غير صالح",
    })
    .trim(),

  // Validator for profileInfos.name field
  body("profileInfos.name")
    .notEmpty()
    .withMessage({ en: "Name is required", ar: "الاسم مطلوب" })
    .isString()
    .withMessage({
      en: "Name must be a string",
      ar: "يجب أن يكون الاسم سلسلة نصية",
    })
    .trim(),

  // Validator for profileInfos.gender field
  body("profileInfos.gender")
    .notEmpty()
    .withMessage({ en: "Gender is required", ar: "الجنس مطلوب" })
    .isIn(["male", "female"])
    .withMessage({ en: "Invalid gender", ar: "جنس غير صالح" }),

  // Validator for profileInfos.father_name field
  body("profileInfos.father_name")
    .optional()
    .isString()
    .withMessage({
      en: "Father's name must be a string",
      ar: "يجب أن يكون اسم الأب سلسلة نصية",
    })
    .trim(),

  // Validator for profileInfos.grandfather_name field
  body("profileInfos.grandfather_name")
    .optional()
    .isString()
    .withMessage({
      en: "Grandfather's name must be a string",
      ar: "يجب أن يكون اسم الجد سلسلة نصية",
    })
    .trim(),

  // Validator for profileInfos.date_of_birth field
  body("profileInfos.date_of_birth")
    .notEmpty()
    .withMessage({ en: "Date of birth is required", ar: "تاريخ الميلاد مطلوب" })
    .isISO8601()
    .withMessage({
      en: "Invalid date format for date_of_birth",
      ar: "صيغة التاريخ لتاريخ الميلاد غير صالح ",
    }),

  // Validator for profileInfos.province field
  body("profileInfos.province")
    .notEmpty()
    .withMessage({ en: "Province is required", ar: "المحافظة مطلوبة" })
    .isString()
    .withMessage({
      en: "Province must be a string",
      ar: "يجب أن تكون المحافظة سلسلة نصية",
    })
    .trim(),

  // Validator for profileInfos.district field
  body("profileInfos.district")
    .notEmpty()
    .withMessage({ en: "District is required", ar: "المنطقة مطلوبة" })
    .isString()
    .withMessage({
      en: "District must be a string",
      ar: "يجب أن تكون المنطقة سلسلة نصية",
    })
    .trim(),

  // Validator for profileInfos.locality field
  body("profileInfos.locality")
    .optional()
    .isString()
    .withMessage({
      en: "Locality must be a string",
      ar: "يجب أن يكون الحي سلسلة نصية",
    })
    .trim(),

  // Validator for profileInfos.neighborhood field
  body("profileInfos.neighborhood")
    .optional()
    .isString()
    .withMessage({
      en: "Neighborhood must be a string",
      ar: "يجب أن تكون المحلة سلسلة نصية",
    })
    .trim(),

  // Validator for profileInfos.alley field
  body("profileInfos.alley")
    .optional()
    .isString()
    .withMessage({
      en: "Alley must be a string",
      ar: "يجب أن يكون الزقاق سلسلة نصية",
    })
    .trim(),

  // Validator for profileInfos.house_number field
  body("profileInfos.house_number")
    .optional()
    .isString()
    .withMessage({
      en: "House number must be a string",
      ar: "يجب أن يكون رقم المنزل سلسلة نصية",
    })
    .trim(),
];

// Validation middleware for resetOldPasswordService
exports.resetForgetPasswordValidator = [
  // Validator for user_id field
  body("user_id")
    .notEmpty()
    .withMessage({ en: "User Id is required", ar: "معرف المستخدم مطلوب" })
    .isMongoId()
    .withMessage({
      en: "User Id should be a valid Mongoose objectId",
      ar: "معرف المستخدم يجب أن يكون كائن خاص ب منكوديبي (قاعدة البيانات) صالحًا",
    }),
  // Validator for otp field
  body("otp")
    .notEmpty()
    .withMessage({ en: "Otp is required", ar: "مطلوب Otp" })
    .isNumeric()
    .withMessage({
      en: "OTP is required and must be a number",
      ar: "OTP مطلوبً ويجب أن يكون رقمًا",
    })
    .trim(),
  // Validator for newPassword field
  body("newPassword")
    .notEmpty()
    .withMessage({
      en: "New Password is required",
      ar: "كلمة المرور الجديدة مطلوبة",
    })
    .isString()
    .withMessage({
      en: "New Password must be a string",
      ar: "يجب أن تكون كلمة المرور الجديدة سلسلة نصية",
    })
    .isLength({ min: 6 })
    .withMessage({
      en: "New password must be at least 6 characters long",
      ar: "يجب أن تتكون كلمة المرور الجديدة من ما لا يقل عن 6 أحرف",
    }),
];

// Validation middleware for changeOldPasswordService
exports.changeOldPasswordValidator = [
  // Validator for oldPassword field
  body("oldPassword")
    .notEmpty()
    .withMessage({
      en: "Old Password is required",
      ar: "كلمة المرور القديمة مطلوبة",
    })
    .isString()
    .withMessage({
      en: "Old password must be a string",
      ar: "يجب أن تكون كلمة المرور القديمة سلسلة نصية",
    }),

  // Validator for newPassword field
  body("newPassword")
    .notEmpty()
    .withMessage({
      en: "New Password is required",
      ar: "كلمة المرور الجديدة مطلوبة",
    })
    .isString()
    .withMessage({
      en: "New password must be a string",
      ar: "يجب أن تكون كلمة المرور الجديدة سلسلة نصية",
    }),
];

// Validation middleware for checking valid MongoDB ObjectId
exports.validateMongooseIdMiddleware = [
  // Custom validator for userId parameter
  param("userId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error({ en: "Invalid ID", ar: "معرف غير صالح" });
    }
    return true;
  }),
];
