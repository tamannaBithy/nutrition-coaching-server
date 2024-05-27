/**
 * Middleware to check if the logged-in user is an admin.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * @returns {void}
 */
exports.isAdminMiddleware = (req, res, next) => {
  try {
    // Check if user is logged in
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: {
          en: "Unauthorized - User not logged in.",
          ar: "غير مصرح - المستخدم غير مسجل الدخول.",
        },
      });
    }

    // Check if the logged-in user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: false,
        message: {
          en: "Forbidden - User is not an admin.",
          ar: "ممنوع - المستخدم ليس ادمن.",
        },
      });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: {
        en: "Internal Server Error.",
        ar: "خطأ داخلي في الخادم.",
      },
    });
  }
};
