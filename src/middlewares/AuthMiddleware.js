const UserModel = require("../models/UserModel");
const ProfileModel = require("../models/ProfileModel");
const { verifyToken } = require("../utils/JWTUtils");
const { default: mongoose } = require("mongoose");

/**
 * Middleware to verify user authentication and fetch user details.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * @returns {void}
 */
exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: {
        en: "Unauthorized - Token missing or invalid.",
        ar: "غير مصرح - الرمز مفقود أو غير صالح.",
      },
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: {
        en: "Unauthorized - Token missing.",
        ar: "غير مصرح به - الرمز مفقود.",
      },
    });
  }

  const userId = await verifyToken(token);
  if (!userId) {
    return res.status(401).json({
      status: false,
      message: {
        en: "Unauthorized - Invalid token.",
        ar: "غير مصرح به - الرمز غير صالح.",
      },
    });
  }

  try {
    // Define aggregate stages as variables

    // Stage 1: Match user by ID
    const matchStage = {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    };

    // Stage 2: Lookup profile data based on user ID
    const lookupStage = {
      $lookup: {
        from: "profiles",
        localField: "_id",
        foreignField: "user_Id",
        as: "profile",
      },
    };

    // Stage 3: Unwind the profile array (preserving null and empty arrays)
    const unwindStage = {
      $unwind: {
        path: "$profile",
        preserveNullAndEmptyArrays: true,
      },
    };

    // Stage 4: Project the desired fields for the output
    const projectStage = {
      $project: {
        phone: 1,
        email: 1,
        disabled_by_admin: 1,
        role: 1,
        name: "$profile.name",
        gender: "$profile.gender",
        father_name: "$profile.father_name",
        grandfather_name: "$profile.grandfather_name",
        date_of_birth: "$profile.date_of_birth",
        province: "$profile.province",
        district: "$profile.district",
        locality: "$profile.locality",
        neighborhood: "$profile.neighborhood",
        alley: "$profile.alley",
        house_number: "$profile.house_number",
        verified: "$profile.verified",
      },
    };

    // Use aggregate pipeline with defined stages
    const userData = await UserModel.aggregate([
      matchStage,
      lookupStage,
      unwindStage,
      projectStage,
    ]);

    // If user not found, return an error
    if (!userData || userData.length === 0) {
      return res.status(401).json({
        status: false,
        message: {
          en: "Unauthorized - User not found.",
          ar: "غير مصرح به - المستخدم غير موجود.",
        },
      });
    }

    // Attach user details to the request for further processing
    req.user = userData[0];
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
