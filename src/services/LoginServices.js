const { default: mongoose } = require("mongoose");
const UserModel = require("../models/UserModel");
const { generateToken } = require("../utils/JWTUtils");
const { comparePassword } = require("../utils/passwordUtils");

/**
 * Service function to handle user login.
 * @param {string} emailOrPhone - The user's email or phone.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - A promise that resolves to an object with status, data, and message.
 */
exports.loginService = async (emailOrPhone, password) => {
  try {
    // Find the user by email or phone
    const user = await UserModel.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    // If user not found, return an error
    if (!user) {
      return {
        status: false,
        message: {
          en: "Invalid email or phone.",
          ar: "البريد الإلكتروني أو رقم الهاتف غير صالح",
        },
      };
    }

    // Check if the user is disabled by the admin
    if (user.disabled_by_admin === true) {
      return {
        status: false,
        message: {
          en: "User is disabled by admin.",
          ar: "تم تعطيل المستخدم بواسطة المسؤول",
        },
      };
    }

    // Verify the password
    const isPasswordMatch = await comparePassword(password, user.password);

    // If password doesn't match, return an error
    if (!isPasswordMatch) {
      return {
        status: false,
        message: {
          en: "Invalid password.",
          ar: "كلمة مرور غير صالحة",
        },
      };
    }

    // Stage 1: Match user by ID
    const matchStage = {
      $match: {
        _id: new mongoose.Types.ObjectId(user._id),
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
        _id: 1,
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
    // Generate a JWT token for the user
    const token = await generateToken(userData[0]);
    // Return success message with the generated token
    return {
      status: true,
      accessToken: `Bearer ${token}`,
      message: {
        en: "Login successful.",
        ar: "تم تسجيل الدخول بنجاح",
      },
    };
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

exports.socialLoginService = async (email) => {
  try {
    // Find the user by email or phone
    const user = await UserModel.findOne({ email });

    if (!user) {
      const newUser = new UserModel({
        email: email ?? "",
      });

      await newUser.save();

      return {
        status: true,
        message: {
          en: "User registered successfully.",
          ar: "تم تسجيل المستخدم بنجاح",
        },
      };
    }

    // Check if the user is disabled by the admin
    if (user.disabled_by_admin === true) {
      return {
        status: false,
        message: {
          en: "User is disabled by admin.",
          ar: "تم تعطيل المستخدم من قبل المسؤول",
        },
      };
    }

    // Stage 1: Match user by ID
    const matchStage = {
      $match: {
        _id: new mongoose.Types.ObjectId(user._id),
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
        _id: 1,
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
    // Generate a JWT token for the user
    const token = await generateToken(userData[0]);
    // Return success message with the generated token
    return {
      status: true,
      accessToken: `Bearer ${token}`,
      message: {
        en: "Login successful.",
        ar: "تم تسجيل الدخول بنجاح",
      },
    };
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};
