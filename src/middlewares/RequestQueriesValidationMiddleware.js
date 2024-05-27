// Importing necessary modules from express-validator
const { body, query, validationResult } = require("express-validator");

/* ========================== Start: User Query Validation ========================== */
/*
 *
 *
 * Define validation rules for query parameters:
 * - Users: Get All Users Controller
 *
 *
 */
exports.validatePaginationQueryParamsGetAllUser = [
  // Validate showPerPage field
  query("showPerPage").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Show Per Page is required and must be an integer.",
    ar: "يجب تحديد عدد العناصر المعروضة لكل صفحة ويجب أن يكون عدد صحيحًا.",
  }),
  // Validate pageNo field
  query("pageNo").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Page No is required and must be an integer.",
    ar: "رقم الصفحة مطلوب ويجب أن يكون عددًا صحيحًا.",
  }),
  // Validate searchKeyword field (optional)
  query("searchKeyword").optional().isString().withMessage({
    en: "Search Key Word must be a string.",
    ar: "كلمة البحث يجب أن تكون سلسلة نصية.",
  }),
];
/* ========================== End: User Query Validation ========================== */

/* ========================== Start: Main Meal Menus Query Validation ========================== */
/*
 *
 *
 * Define validation rules for query parameters:
 * - Main Meals: Main Meal Menus For Admin Controller
 *
 *
 */
exports.validatePaginationQueryParamsMainMealMenusForAdmin = [
  // Validate langCode field
  query("langCode").notEmpty().isString().withMessage({
    en: "Language Code is required and must be a string.",
    ar: "رمز اللغة مطلوب ويجب أن يكون سلسلة نصية.",
  }),
  // Validate showPerPage field
  query("showPerPage").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Show Per Page is required and must be an integer.",
    ar: "يجب تحديد عدد العناصر المعروضة لكل صفحة ويجب أن يكون عدد صحيحًا.",
  }),
  // Validate pageNo field
  query("pageNo").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Page No is required and must be an integer.",
    ar: "رقم الصفحة مطلوب ويجب أن يكون عددًا صحيحًا.",
  }),
  // Validate searchKeyword field (optional)
  query("searchKeyword").optional().isString().withMessage({
    en: "Search Key Word must be a string.",
    ar: "كلمة البحث يجب أن تكون سلسلة نصية.",
  }),
];
/* ========================== End: Main Meal Menus Query Validation ========================== */

/* ========================== Start: Offered Meal Query Validation ========================== */
/*
 *
 *
 * Define validation rules for query parameters:
 * - Offered Meals: Admin Dashboard Controller
 *
 *
 */
exports.validatePaginationQueryParamsForOfferedMeals = [
  // Validate langCode field
  query("langCode").notEmpty().isString().withMessage({
    en: "Language Code is required and must be a string.",
    ar: "رمز اللغة مطلوب ويجب أن يكون سلسلة نصية.",
  }),
  // Validate showPerPage field
  query("showPerPage").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Show Per Page is required and must be an integer.",
    ar: "يجب تحديد عدد العناصر المعروضة لكل صفحة ويجب أن يكون عدد صحيحًا.",
  }),
  // Validate pageNo field
  query("pageNo").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Page No is required and must be an integer.",
    ar: "رقم الصفحة مطلوب ويجب أن يكون عددًا صحيحًا.",
  }),
  // Validate searchKeyword field (optional)
  query("searchKeyword").optional().isString().withMessage({
    en: "Search Key Word must be a string.",
    ar: "كلمة البحث يجب أن تكون سلسلة نصية.",
  }),
];
/* ========================== End: Offered Meal Query Validation ========================== */

/* ========================== Start: Weekly Meal Query Validation ========================== */
/*
 *
 *
 * Define validation rules for query parameters:
 * - Weekly Meal Menus: Previous Controller, Running Controller & Upcoming Controller
 *
 *
 */
exports.validatePaginationQueryParamsForWeeklyMeals = [
  // Validate langCode field
  query("langCode").notEmpty().isString().withMessage({
    en: "Language Code is required and must be a string.",
    ar: "رمز اللغة مطلوب ويجب أن يكون سلسلة نصية.",
  }),
  // Validate showPerPage field
  query("showPerPage").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Show Per Page is required and must be an integer.",
    ar: "يجب تحديد عدد العناصر المعروضة لكل صفحة ويجب أن يكون عدد صحيحًا.",
  }),
  // Validate pageNo field
  query("pageNo").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Page No is required and must be an integer.",
    ar: "رقم الصفحة مطلوب ويجب أن يكون عددًا صحيحًا.",
  }),
  // Validate searchKeyword field (optional)
  query("searchKeyword").optional().isString().withMessage({
    en: "Search Key Word must be a string.",
    ar: "كلمة البحث يجب أن تكون سلسلة نصية.",
  }),
];
exports.validateDateForPreviousWeeklyMeals = [
  // Validate unavailable_from_start field
  query("unavailable_from_start").notEmpty().isISO8601().toDate().withMessage({
    en: "Unavailable From Start is required (e.g. '2022-01-01).",
    ar: "تاريخ عدم التوفر (البدأ) مطلوب (على سبيل المثال '2022-01-01).",
  }),

  // Validate unavailable_from_end field
  query("unavailable_from_end").notEmpty().isISO8601().toDate().withMessage({
    en: "Unavailable From End is required (e.g. '2022-01-01).",
    ar: "تاريخ عدم التوفر (الانتهاء) مطلوب (على سبيل المثال '2022-01-01).",
  }),
];
exports.validateDateUpcomingWeeklyMeals = [
  // Validate available_from field
  query("available_from").notEmpty().isISO8601().withMessage({
    en: "Available From is required (e.g. '2022-01-01).",
    ar: "تاريخ التوفر (البدأ) مطلوب (على سبيل المثال '2022-01-01).",
  }),

  // Validate unavailable_from field
  query("unavailable_from").notEmpty().isISO8601().withMessage({
    en: "Unavailable From is required (e.g. '2022-01-01).",
    ar: "تاريخ عدم التوفر (البدأ) مطلوب (على سبيل المثال '2022-01-01).",
  }),
];
/* ========================== End: Weekly Meal Query Validation ========================== */

/* ========================== Start: Customized Meal Query Validation ========================== */
/*
 *
 *
 * Define validation rules for query parameters:
 * - Customized Meals: Get All Customized Meals Controller, Admin Dashboard Controller
 *
 *
 */
exports.validatePaginationQueryParamsForAllCustomizedMeals = [
  // Validate langCode field
  query("langCode").notEmpty().isString().withMessage({
    en: "Language Code is required and must be a string.",
    ar: "رمز اللغة مطلوب ويجب أن يكون سلسلة نصية.",
  }),
  // Validate showPerPage field
  query("showPerPage").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Show Per Page is required and must be an integer.",
    ar: "يجب تحديد عدد العناصر المعروضة لكل صفحة ويجب أن يكون عدد صحيحًا.",
  }),
  // Validate pageNo field
  query("pageNo").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Page No is required and must be an integer.",
    ar: "رقم الصفحة مطلوب ويجب أن يكون عددًا صحيحًا.",
  }),
  // Validate searchKeyword field (optional)
  query("searchKeyword").optional().isString().withMessage({
    en: "Search Key Word must be a string.",
    ar: "كلمة البحث يجب أن تكون سلسلة نصية.",
  }),
];
/* ========================== End: Customized Meal Query Validation ========================== */

/* ========================== Start: Orders Query Validation ========================== */
/*
 *
 *
 * Define validation rules for query parameters:
 * - Orders: All Orders Controller
 *
 *
 */
exports.validatePaginationQueryParamsAllOrdersForAdmin = [
  // Validate showPerPage field
  query("showPerPage").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Show Per Page is required and must be an integer.",
    ar: "يجب تحديد عدد العناصر المعروضة لكل صفحة ويجب أن يكون عدد صحيحًا.",
  }),

  // Validate pageNo field
  query("pageNo").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Page No is required and must be an integer.",
    ar: "رقم الصفحة مطلوب ويجب أن يكون عددًا صحيحًا.",
  }),

  // Validate searchKeyword field (optional)
  query("searchKeyword").optional().isString().withMessage({
    en: "Search Key Word must be a string.",
    ar: "يجب أن تكون كلمة البحث سلسلة نصية.",
  }),

  // Validate orders_from field
  query("orders_from").notEmpty().isISO8601().toDate().withMessage({
    en: "Orders From Start is required (e.g. '2022-01-01).",
    ar: "تاريخ بدء الطلبات مطلوب (مثال: '2022-01-01).",
  }),

  // Validate orders_end field
  query("orders_end").notEmpty().isISO8601().toDate().withMessage({
    en: "Orders End Start is required (e.g. '2022-01-01).",
    ar: "تاريخ انتهاء الطلبات مطلوب (مثال: '2022-01-01).",
  }),
];
/*
 *
 *
 * Define validation rules for query parameters:
 * - Orders: My Orders Controller
 *
 *
 */
exports.validatePaginationQueryParamsGetAllMyOrders = [
  // Validate showPerPage field
  query("showPerPage").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Show Per Page is required and must be an integer.",
    ar: "يجب تقديم عدد العناصر لكل صفحة ويجب أن يكون عدد صحيحًا.",
  }),

  // Validate pageNo field
  query("pageNo").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Page No is required and must be an integer.",
    ar: "رقم الصفحة مطلوب ويجب أن يكون عدد صحيحًا.",
  }),

  // Validate orders_from field
  query("orders_from").notEmpty().isISO8601().toDate().withMessage({
    en: "Orders From Start is required (e.g. '2022-01-01).",
    ar: "يجب تقديم تاريخ بدء الطلبات (على سبيل المثال ، '2022-01-01').",
  }),

  // Validate orders_end field
  query("orders_end").notEmpty().isISO8601().toDate().withMessage({
    en: "Orders End Start is required (e.g. '2022-01-01).",
    ar: "يجب تقديم تاريخ نهاية الطلبات (على سبيل المثال ، '2022-01-01').",
  }),
];

/* ========================== Emd: Orders Query Validation ========================== */

/* ========================== Start: All Instructors Query Validation ========================== */
/*
 *
 *
 * Define validation rules for query parameters:
 * - Instructors: Get All Instructors Controller, Admin Dashboard Controller
 *
 *
 */
exports.validatePaginationQueryParamsAllInstructor = [
  // Validate langCode field
  query("langCode").notEmpty().isString().withMessage({
    en: "Language Code is required and must be a string.",
    ar: "رمز اللغة مطلوب ويجب أن يكون سلسلة نصية.",
  }),

  // Validate showPerPage field
  query("showPerPage").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Show Per Page is required and must be an integer.",
    ar: "يجب تحديد عدد العناصر المعروضة لكل صفحة ويجب أن يكون عدد صحيحًا.",
  }),

  // Validate pageNo field
  query("pageNo").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Page No is required and must be an integer.",
    ar: "رقم الصفحة مطلوب ويجب أن يكون عدد صحيحًا.",
  }),

  // Validate searchKeyword field (optional)
  query("searchKeyword").optional().isString().withMessage({
    en: "Search Key Word must be a string.",
    ar: "يجب أن يكون كلمة البحث سلسلة نصية.",
  }),
];

/* ========================== End: All Instructors Query Validation ========================== */

/* ========================== Start: Blogs Query Validation ========================== */
/*
 *
 * Define validation rules for query parameters:
 * - Blogs: Get all blogs, Admin Dashboard Controller
 *
 *
 */
exports.validatePaginationQueryParamsForAllBlogs = [
  // Validate langCode field
  query("langCode").notEmpty().isString().withMessage({
    en: "Language Code is required and must be a string.",
    ar: "رمز اللغة مطلوب ويجب أن يكون سلسلة نصية.",
  }),

  // Validate showPerPage field
  query("showPerPage").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Show Per Page is required and must be an integer.",
    ar: "يجب تحديد عدد العناصر المعروضة لكل صفحة ويجب أن يكون عدد صحيحًا.",
  }),

  // Validate pageNo field
  query("pageNo").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Page No is required and must be an integer.",
    ar: "رقم الصفحة مطلوب ويجب أن يكون عدد صحيحًا.",
  }),

  // Validate searchKeyword field (optional)
  query("searchKeyword").optional().isString().withMessage({
    en: "Search Key Word must be a string.",
    ar: "يجب أن يكون كلمة البحث سلسلة نصية.",
  }),
];

/* ========================== End: Blogs Query Validation ========================== */

/* ========================== Start: All User Meals Input(Customized Meal) Query Validation ========================== */
/*
 *
 *
 * Define validation rules for query parameters:
 * - Admin Inputs For Customized Meals: Get All User Meals Input Controller
 *
 *
 */
exports.validatePaginationQueryParamsAllUserMealsInput = [
  // Validate showPerPage field
  query("showPerPage").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Show Per Page is required and must be an integer.",
    ar: "يجب تحديد عدد العناصر المعروضة لكل صفحة ويجب أن يكون عدد صحيحًا.",
  }),

  // Validate pageNo field
  query("pageNo").notEmpty().isInt({ min: 1 }).toInt().withMessage({
    en: "Page No is required and must be an integer.",
    ar: "رقم الصفحة مطلوبة ويجب أن يكون عددًا صحيحًا.",
  }),

  // Validate searchKeyword field (optional)
  query("searchKeyword").optional().isString().withMessage({
    en: "Search Key Word must be a string.",
    ar: "يجب أن تكون كلمة البحث سلسلة نصية.",
  }),
];

/* ========================== End: All User Meals Input(Customized Meal) Query Validation ========================== */

/* ========================== Start: Language Code Query Validation ========================== */
/*
 *
 *
 * Define validation rules for query parameter langCode:
 * - Banner: All Banner Controller, All Banner Controller
 * - Main Meals: All Main Meal Menus For Users Controller, All Main Meal Menus For Admin Controller
 * - Meal Preferences: All Meal Preferences Controller, All Meal Preferences For Admin Controller
 * - Meal Types: All Meal Types Controller
 * - Offered Meals: All Offered Meals Controller, All Offered Meals Dashboard Controller
 * - Weekly Meals Category: All Weekly Meal Categories Controller
 *
 *
 */
// Define validation rules for query parameter langCode
exports.validateLangCodeQueryParams = [
  // Validate langCode field
  query("langCode").notEmpty().isString().withMessage({
    en: "Language Code is required and must be a string.",
    ar: "رمز اللغة مطلوب ويجب أن يكون سلسلة نصية.",
  }),
];

/* ========================== End: Language Code Query Validation ========================== */

/* ========================== Start: Discount Category Query Validation ========================== */
/*
 *
 *
 * Define validation rules for query parameter discount_category:
 * - Discount For Orders: All Discounts For Order Controller
 *
 */
exports.validateDiscountCategoryQueryParams = [
  // Validate discount_category field
  query("discount_category").notEmpty().isString().withMessage({
    en: "Discount Category is required and must be a string.",
    ar: "فئة الخصم مطلوبة ويجب أن تكون سلسلة نصية.",
  }),
];

/* ========================== End: Discount Category Query Validation ========================== */
