const { default: mongoose } = require("mongoose");
const ProfileModel = require("../models/ProfileModel");
const UserModel = require("../models/UserModel");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const { generateOTP } = require("../utils/otpUtils");
const OTPModel = require("../models/OTPModel");
const { sendSMSToPhone, sendWhatsAppMessage } = require("../utils/twilioSms");

/**
 * Service function to register a new user.
 * @param {Object} userData - User data containing email/phone, password, and other optional details.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and message.
 */
exports.registerUserService = async (userData) => {
  try {
    let query = {};
    if (userData.email === "") {
      query = {
        phone: userData.phone,
      };
    } else if (userData.phone === "") {
      query = {
        email: userData.email,
      };
    } else if (userData.email !== "" && userData.phone !== "") {
      // Separate conditions for email and phone
      query = {
        $or: [{ phone: userData.phone }, { email: userData.email }],
      };
    }

    const existingUser = await UserModel.findOne(query);

    // If user already exists, return an error
    if (existingUser) {
      return {
        status: false,
        message: {
          en: "User already exists with the provided phone or email.",
          ar: "المستخدم موجود بالفعل باستخدام الهاتف أو البريد الإلكتروني المُقدم",
        },
      };
    }

    // Hash the user's password before saving it to the database
    const hashedPassword = await hashPassword(userData.password);

    // Create a new user instance
    const newUser = new UserModel({
      phone: userData?.phone ?? "",
      email: userData?.email ?? "",
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Return success message
    return {
      status: true,
      message: {
        en: "User registered successfully.",
        ar: "تم تسجيل المستخدم بنجاح",
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

/**
 * Service function to update user information.
 * @param {string} userId - The ID of the user to be updated.
 * @param {Object} updateData - User data to be updated.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and message.
 */
exports.updateUserService = async (userId, updateData) => {
  try {
    // Destructured updateData with default values
    const {
      userInfos: { phone: newPhone, email: newEmail },
      profileInfos: {
        name,
        gender,
        father_name,
        grandfather_name,
        date_of_birth,
        province,
        district,
        locality,
        neighborhood,
        alley,
        house_number,
      },
    } = updateData;

    // Check if the user exists
    const existingUser = await UserModel.findById(userId);

    // If user not found, return an error
    if (!existingUser) {
      return {
        status: false,
        message: {
          en: "User not found.",
          ar: "المستخدم غير موجود",
        },
      };
    }

    // Define profile data
    const userProfileData = {
      user_Id: userId,
      name: name ?? "",
      gender: gender ?? "male",
      father_name: father_name ?? "",
      grandfather_name: grandfather_name ?? "",
      date_of_birth: date_of_birth ?? "",
      province: province ?? "",
      district: district ?? "",
      locality: locality ?? "",
      neighborhood: neighborhood ?? "",
      alley: alley ?? "",
      house_number: house_number ?? "",
    };

    // Check if a profile exists for the user
    let existingProfile = await ProfileModel.findOne({ user_Id: userId });

    // If no profile found, create a new profile
    if (!existingProfile) {
      existingProfile = new ProfileModel(userProfileData);
      await existingProfile.save();
    } else {
      // Update existingProfile with userProfileData
      existingProfile.set(userProfileData);
      await existingProfile.save();
    }

    // Conditionally Updated Phone Number
    if (existingUser.phone === "") {
      // Update existingUser with userInfos
      existingUser.set({
        phone: newPhone,
        email: newEmail || existingProfile?.email,
      });
    }
    // Update existingUser with userInfos
    existingUser.set({
      email: newEmail || existingProfile?.email,
    });
    await existingUser.save();

    return {
      status: true,
      message: {
        en: "User updated successfully.",
        ar: "تم تحديث المستخدم بنجاح",
      },
    };
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in updateUserService:", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to delete a user and associated profile data.
 * @param {Object} user - The user to be deleted.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and message.
 */
exports.deleteUserService = async (user) => {
  try {
    // Extract user id from the user parameter
    const { _id } = user;

    if (user.role === "admin") {
      return {
        status: false,
        message: {
          en: "Admin can't delete own ID.",
          ar: "لا يمكن للمسؤول حذف معرفه الخاص",
        },
      };
    }

    // Find the associated profile data and delete it
    const profileDeleteResult = await ProfileModel.findOneAndDelete({
      user_Id: _id,
    });

    // Find the user by ID and delete it
    const userDeleteResult = await UserModel.findByIdAndDelete(_id);

    // If neither the user nor the associated profile data is found, return an error
    if (!userDeleteResult && !profileDeleteResult) {
      return {
        status: false,
        message: {
          en: "User not found.",
          ar: "المستخدم غير موجود",
        },
      };
    }

    // Return success message
    return {
      status: true,
      message: {
        en: "User deleted successfully.",
        ar: "تم حذف المستخدم بنجاح",
      },
    };
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in deleteUserService:", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to get a user by ID along with associated profile data.
 * @param {string} userId - The ID of the user to be retrieved.
 * @returns {Promise<Object>} - A promise that resolves to an object with user and profile data.
 */
exports.getUserByIdService = async (userId) => {
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
        _id: 0,
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
    const result = await UserModel.aggregate([
      matchStage,
      lookupStage,
      unwindStage,
      projectStage,
    ]);

    // If result is empty, return an error
    if (!result.length) {
      return {
        status: false,
        message: {
          en: "User not found.",
          ar: "المستخدم غير موجود",
        },
      };
    }

    // If profile data found, combine user and profile data
    const combinedData = result[0];

    return { status: true, data: combinedData };
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

/**
 * Service function for generating, sending and storing a forget password OTP.
 * @param {Object} requestData - Request data containing user mobile number.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and OTP data.
 */
exports.forgetPasswordOTPService = async (requestData) => {
  try {
    // Find the user by mobile number
    const user = await UserModel.findOne({ phone: requestData?.phone });

    // If user not found, return an error
    if (!user) {
      return {
        status: false,
        message: {
          en: "User not found.",
          ar: "المستخدم غير موجود",
        },
      };
    }

    // Generate a 6-digit OTP
    const otp = await generateOTP(6);

    // Set expiry time to 5 minutes from the current time
    const expiryTime = new Date(+new Date() + 5 * 60 * 1000);

    // Save the OTP to the OTP model with the user ID and expiry time
    const otpData = new OTPModel({
      otp,
      user_id: user._id,
      expiryTime,
    });

    await otpData.save();

    if (requestData?.smsViaMethod === "whatsapp") {
      const sms = await sendWhatsAppMessage(
        requestData?.phone,
        `Here is your verification otp from Giga Diet - ${otp}`
      );

      if (sms?.status === false) {
        // Delete the OTP document if SMS failed to send
        await OTPModel.deleteOne({ _id: otpData?._id, user_id: user?._id });

        return {
          status: false,
          message: {
            en: "Something went wrong.",
            ar: "حدث خطأ ما",
          },
        };
      }
    } else if (requestData?.smsViaMethod === "smsToPhone") {
      // Sending verification otp to the user phone number
      const sms = await sendSMSToPhone(
        requestData?.phone,
        `Here is your verification otp from Giga Diet - ${otp}`
      );

      if (sms?.status === false) {
        // Delete the OTP document if SMS failed to send
        await OTPModel.deleteOne({ _id: otpData?._id, user_id: user?._id });

        return {
          status: false,
          message: {
            en: "Something went wrong.",
            ar: "حدث خطأ ما",
          },
        };
      }
    }

    // Return success message with OTP data
    return {
      status: true,
      message: {
        en: "OTP generated and sent successfully. This OTP will expire in 5 minutes.",
        ar: "تم إنشاء رمز التحقق وإرساله بنجاح. سينتهي صلاحية هذا الرمز خلال 5 دقائق",
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

/**
 * Service function to verify the forget password OTP.
 * @param {string} otp - The OTP to be verified.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and message.
 */
exports.verifyForgetPasswordOTPService = async (otp) => {
  try {
    // Find the OTP by the provided OTP value
    const otpData = await OTPModel.findOne({ otp });

    // If OTP not found, return an error
    if (!otpData) {
      return {
        status: false,
        message: {
          en: "Invalid OTP.",
          ar: "رمز التحقق غير صالح",
        },
      };
    }

    // Check if OTP is expired
    const currentTime = new Date();
    if (currentTime > otpData.expiryTime) {
      return {
        status: false,
        message: {
          en: "OTP has expired.",
          ar: "انتهت صلاحية رمز التحقق",
        },
      };
    }

    // Check if OTP has already been verified
    if (otpData.verified === true) {
      return {
        status: false,
        message: {
          en: "OTP has already been used.",
          ar: "تم استخدام رمز التحقق بالفعل",
        },
      };
    }

    // Mark the OTP as verified
    otpData.verified = true;
    await otpData.save();

    // Return success message
    return {
      status: true,
      message: {
        en: "OTP verified successfully.",
        ar: "تم التحقق من رمز التحقق بنجاح",
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

/**
 * Service function to change the old password using a verified OTP.
 * @param {Object} requestData - Request data containing user ID, OTP, and new password.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and message.
 */
exports.resetForgetPasswordService = async (requestData) => {
  try {
    const { user_id, otp, newPassword } = requestData;

    // Find the verified OTP by user ID and OTP value
    const verifiedOTP = await OTPModel.findOne({
      user_id,
      otp,
      verified: true,
    });

    // If verified OTP not found, return an error
    if (!verifiedOTP) {
      return {
        status: false,
        message: {
          en: "Invalid or unverified OTP.",
          ar: "رمز التحقق غير صالح أو غير مُتحقق",
        },
      };
    }

    // Find the user by ID
    const user = await UserModel.findById(user_id);

    // If user not found, return an error
    if (!user) {
      return {
        status: false,
        message: {
          en: "User not found.",
          ar: "المستخدم غير موجود",
        },
      };
    }

    // Update the user password with the new password
    user.password = await hashPassword(newPassword);
    await user.save();

    // Delete the verified OTP
    await OTPModel.deleteMany({ user_id: user._id });

    // Return success message
    return {
      status: true,
      message: {
        en: "Password changed successfully.",
        ar: "تم تغيير كلمة المرور بنجاح",
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

/**
 * Service function to get all users with their profile details excluding certain details
 * and implement pagination.
 *
 * @param {number} showPerPage - Number of items to show per page.
 * @param {number} pageNo - Current page number.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and user data.
 */
exports.getAllUsersService = async (req) => {
  try {
    // Constants for pagination
    showPerPage = req?.query.showPerPage
      ? parseInt(req?.query.showPerPage)
      : 10;
    pageNo = req?.query?.pageNo ? parseInt(req?.query?.pageNo) : 1;

    // Extract searchKeyword from the request
    const searchKeyword = req?.query?.searchKeyword || "";

    // Aggregation stages
    const lookupStage = {
      $lookup: {
        from: "profiles",
        localField: "_id",
        foreignField: "user_Id",
        as: "profile",
      },
    };

    const unwindStage = {
      $unwind: {
        path: "$profile",
        preserveNullAndEmptyArrays: true,
      },
    };

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

    // Create a match stage for global search
    const matchStage = {
      $match: {
        $or: [
          { name: { $regex: searchKeyword, $options: "i" } },
          { role: { $regex: searchKeyword, $options: "i" } },
          { gender: { $regex: searchKeyword, $options: "i" } },
          { phone: { $regex: searchKeyword, $options: "i" } },
          { email: { $regex: searchKeyword, $options: "i" } },
          { province: { $regex: searchKeyword, $options: "i" } },
          { district: { $regex: searchKeyword, $options: "i" } },
        ],
      },
    };

    // Aggregation method to sort and paginate
    const sortAndPaginate = [
      {
        $skip: (pageNo - 1) * showPerPage,
      },
      {
        $limit: showPerPage,
      },
    ];

    // Execute aggregation pipeline
    const usersWithProfile = await UserModel.aggregate([
      lookupStage,
      unwindStage,
      projectStage,
      matchStage,
      ...sortAndPaginate,
    ]);

    // Get total data count for pagination
    const totalDataCount = await UserModel.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalDataCount / showPerPage);

    // Generate array of page numbers
    const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Calculate the range of items being displayed
    const startItem = (pageNo - 1) * showPerPage + 1;
    const endItem = Math.min(pageNo * showPerPage, totalDataCount);

    // Return result with pagination information
    return {
      status: true,
      data: usersWithProfile,
      totalDataCount,
      totalPages: pageArray,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: `عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
      currentPage: pageNo,
    };
  } catch (error) {
    console.error("Error fetching users with profile details", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to change the old password.
 * @param {Object} req - Request data containing oldPassword, newPassword, and user_id.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and message.
 */
exports.changeOldPasswordService = async (req) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Find the user by ID
    const loggedInUser = await UserModel.findById(req.user._id);

    // If user not found, return an error
    if (!loggedInUser) {
      return {
        status: false,
        message: {
          en: "User not found.",
          ar: "المستخدم غير موجود",
        },
      };
    }

    // Compare the old password
    const isPasswordMatch = await comparePassword(
      oldPassword,
      loggedInUser.password
    );

    // If old password doesn't match, return an error
    if (!isPasswordMatch) {
      return {
        status: false,
        message: {
          en: "Old password is incorrect.",
          ar: "كلمة المرور القديمة غير صحيحة",
        },
      };
    }

    // Update the user password with the new password
    loggedInUser.password = await hashPassword(newPassword);
    await loggedInUser.save();

    // Return success message
    return {
      status: true,
      message: {
        en: "Password changed successfully.",
        ar: "تم تغيير كلمة المرور بنجاح",
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

/**
 * Service function to verify user profile and send OTP to user's phone number.
 * @param {Object} req - The request object containing user information and preferences.
 * @returns {Object} An object containing status and message indicating the result of the operation.
 */
exports.verifyProfileSendOtpControllerService = async (req) => {
  try {
    const userId = req?.user?._id;

    // Find the user by _id
    const user = await User.findById(userId);

    // If user not found, return an error
    if (!user) {
      return {
        status: false,
        message: {
          en: "User not found.",
          ar: "المستخدم غير موجود",
        },
      };
    }

    // Generate a 6-digit OTP
    const otp = await generateOTP(6);

    // Set expiry time to 5 minutes from the current time
    const expiryTime = new Date(+new Date() + 5 * 60 * 1000);

    // Save the OTP to the OTP model with the user ID and expiry time
    const otpData = new OTPModel({
      otp,
      user_id: user._id,
      expiryTime,
    });

    await otpData.save();

    // Send OTP to the user's phone number based on their preference
    if (user?.phone && req?.smsViaMethod) {
      let sms;
      if (req.smsViaMethod === "whatsapp") {
        sms = await sendWhatsAppMessage(
          user.phone,
          `Here is your verification otp from Giga Diet - ${otp}`
        );
      } else if (req.smsViaMethod === "smsToPhone") {
        sms = await sendSMSToPhone(
          user.phone,
          `Here is your verification otp from Giga Diet - ${otp}`
        );
      }

      // If SMS failed to send, delete the OTP document
      if (sms?.status === false) {
        await OTPModel.deleteOne({ _id: otpData?._id, user_id: user?._id });

        return {
          status: false,
          message: {
            en: "Something went wrong.",
            ar: "حدث خطأ ما",
          },
        };
      }
    }

    // Return success message with OTP data
    return {
      status: true,
      message: {
        en: "OTP generated and sent successfully. This OTP will expire in 5 minutes.",
        ar: "تم إنشاء رمز التحقق وإرساله بنجاح. سينتهي صلاحية هذا الرمز خلال 5 دقائق",
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

/**
 * Service function to verify user profile using OTP.
 * @param {Object} req - The request object containing user information and OTP.
 * @returns {Object} An object containing status and message indicating the result of the verification process.
 */
exports.verifyProfileService = async (req) => {
  try {
    const userId = req?.user?._id;

    // Find the user by _id
    const user = await User.findById(userId);

    // If user not found, return an error
    if (!user) {
      return {
        status: false,
        message: {
          en: "User not found.",
          ar: "المستخدم غير موجود",
        },
      };
    }

    // Find the user profile by _id
    const profile = await ProfileModel.findById({ user_Id: userId });

    // Find the OTP by the provided OTP value
    const otpData = await OTPModel.findOne({ otp: req?.body?.otp });

    // If OTP not found, return an error
    if (!otpData) {
      return {
        status: false,
        message: {
          en: "Invalid OTP.",
          ar: "رمز التحقق غير صالح",
        },
      };
    }

    // Check if OTP is expired
    const currentTime = new Date();
    if (currentTime > otpData.expiryTime) {
      return {
        status: false,
        message: {
          en: "OTP has expired.",
          ar: "انتهت صلاحية رمز التحقق",
        },
      };
    }

    // Check if OTP has already been verified
    if (otpData.verified === true) {
      return {
        status: false,
        message: {
          en: "OTP has already been used.",
          ar: "تم استخدام رمز التحقق بالفعل",
        },
      };
    }

    // Mark the OTP as verified
    otpData.verified = true;

    // Mark the profile as verified
    profile.verified = true;
    await otpData.save();
    await profile.save();

    // Return success message
    return {
      status: true,
      message: {
        en: "Profile verified successfully.",
        ar: "تم التحقق من الملف بنجاح",
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

/**
 * Service function to disable or enable a user.
 * @param {string} userId - The ID of the user to be disabled or enabled.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and message.
 */
exports.disableOrEnableUserService = async (userId) => {
  try {
    // Find the user by ID to get the current value of disabled_by_admin
    const user = await UserModel.findById(userId);

    // Admin Can't disable him self
    if (user.role === "admin") {
      return {
        status: false,
        message: {
          en: "Admin User Can't Be Disabled.",
          ar: "لا يمكن تعطيل مستخدم الإدارة",
        },
      };
    }

    // If user not found, return an error
    if (!user) {
      return {
        status: false,
        message: { en: "User not found.", ar: "المستخدم غير موجود" },
      };
    }

    // Toggle the disabled_by_admin field
    user.disabled_by_admin = !user.disabled_by_admin;
    await user.save();

    // Determine the action based on the updated disabled_by_admin field
    const actionMessage = user.disabled_by_admin
      ? {
          en: "User enabled successfully.",
          ar: "تم تمكين المستخدم بنجاح",
        }
      : {
          en: "User disabled successfully.",
          ar: "تم تعطيل المستخدم بنجاح",
        };

    // Return success message
    return { status: true, message: actionMessage };
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
