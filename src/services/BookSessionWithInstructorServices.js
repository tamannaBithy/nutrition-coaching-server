const BookSessionWithInstructorModel = require("../models/BookSessionWithInstructorModel");
const NotificationForAdminModel = require("../models/NotificationForAdminModel");
const NotificationModel = require("../models/NotificationsModel");

/**
 * Service function to create a new session.
 * @param {string} userId - The ID of the user creating the session.
 * @param {Object} sessionData - Data for the new session.
 * @param {Object} io - Socket.io instance to emit notifications.
 * @returns {Object} - Result indicating the success status of the operation and a corresponding message.
 */
exports.createSessionService = async (userId, sessionData, io) => {
  try {
    const { instructor, note_for_instructor, status } = sessionData;

    // Create a new session
    const newSession = await BookSessionWithInstructorModel.create({
      instructor,
      user: userId,
      note_for_instructor,
    });

    // Emit notifications to user and instructor/admin
    const userNotificationMessage = {
      en: "Your session has been successfully booked.",
      ar: "تم حجز الجلسة بنجاح",
    };

    const adminNotificationMessage = {
      en: "A new session has been booked.",
      ar: "تم حجز جلسة جديدة",
    };

    // Creating notification after successfully creating the session (for user)
    const notificationForUser = await NotificationModel.create({
      user_id: userId,
      title: {
        en: "Your session has been successfully booked.",
        ar: "تم حجز الجلسة بنجاح",
      },
      description: {
        en: "Your session with our instructor has been successfully booked. Please review the details in your account.",
        ar: "تم حجز جلسة مع مدربنا بنجاح. يرجى مراجعة التفاصيل في حسابك",
      },
    });

    // Creating notification after successfully creating the session (for admin)
    const notificationForAdmin = await NotificationForAdminModel.create({
      title: {
        en: "A New Session has been booked",
        ar: "تم حجز جلسة جديدة",
      },
      description: {
        en: "A new session has been booked by a user. You can view the details in the admin panel.",
        ar: "تم حجز جلسة جديدة بواسطة مستخدم. يمكنك عرض التفاصيل في لوحة التحكم للمشرف",
      },
    });

    // Emit notifications to user and admin
    io.to(`customerRoom_${userId}`).emit("sessionCreated", {
      message: userNotificationMessage,
    });

    io.to("adminRoom").emit("newSessionBooked", {
      message: adminNotificationMessage,
    });

    return {
      status: true,
      message: {
        en: "Session created successfully.",
        ar: "تم إنشاء الجلسة بنجاح",
      },
    };
  } catch (error) {
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
 * Service function to update an existing session.
 * @param {string} sessionId - The ID of the session to be updated.
 * @param {Object} updatedData - Updated data for the session.
 * @param {Object} io - Socket.io instance to emit notifications.
 * @returns {Object} - Result indicating the success status of the operation and a corresponding message.
 */
exports.updateSessionService = async (sessionId, updatedData, io) => {
  try {
    const { status } = updatedData;

    // Find the existing session by ID
    const existingSession = await BookSessionWithInstructorModel.findById(
      sessionId
    );

    // If session not found, return error message
    if (!existingSession) {
      return {
        status: false,
        message: {
          en: "Session not found.",
          ar: "الجلسة غير موجودة",
        },
      };
    }

    // Update session status and save changes
    existingSession.status = status;
    await existingSession.save();

    // Emit notifications to user and instructor/admin
    const userNotificationMessage = {
      en: "Your session has been updated successfully.",
      ar: "تم تحديث الجلسة بنجاح",
    };

    const adminNotificationMessage = {
      en: "A session has been updated.",
      ar: "تم تحديث الجلسة",
    };

    // Emit notifications to user and admin
    io.to(`customerRoom_${existingSession.user}`).emit("sessionUpdated", {
      message: userNotificationMessage,
    });

    // Create notifications
    await NotificationModel.create({
      user_id: existingSession.user,
      title: userNotificationMessage,
      description: userNotificationMessage,
    });

    return {
      status: true,
      message: {
        en: "Session updated successfully.",
        ar: "تم تحديث الجلسة بنجاح",
      },
    };
  } catch (error) {
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

// Define aggregation stages for retrieving all sessions along with instructor and user details
exports.getAllSessionService = async () => {
  try {
    // Define aggregation stages for retrieving all sessions along with instructor and user details
    const instructorLookupStage = {
      $lookup: {
        from: "instructors",
        localField: "instructor",
        foreignField: "_id",
        as: "instructorDetails",
      },
    };

    const instructorUnwindStage = {
      $unwind: "$instructorDetails",
    };

    const userProfileLookupStage = {
      $lookup: {
        from: "profiles",
        localField: "user",
        foreignField: "user_Id",
        as: "userProfile",
      },
    };

    const userProfileUnwindStage = {
      $unwind: "$userProfile",
    };

    const userContactLookupStage = {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userContact",
      },
    };

    const userContactUnwindStage = {
      $unwind: "$userContact",
    };

    const projectionStage = {
      $project: {
        note_for_instructor: 1,
        status: 1,
        instructorDetails: {
          name: "$instructorDetails.instructor_name",
          qualification: "$instructorDetails.instructor_qualification",
          details: "$instructorDetails.instructor_details",
          image: "$instructorDetails.image",
        },
        userDetails: {
          name: "$userProfile.name",
          gender: "$userProfile.gender",
          province: "$userProfile.province",
          district: "$userProfile.district",
          locality: "$userProfile.locality",
          verified: "$userProfile.verified",
          email: "$userContact.email",
          phone: "$userContact.phone",
        },
      },
    };

    // Perform aggregation to retrieve all sessions
    const allSessions = await BookSessionWithInstructorModel.aggregate([
      instructorLookupStage,
      instructorUnwindStage,
      userProfileLookupStage,
      userProfileUnwindStage,
      userContactLookupStage,
      userContactUnwindStage,
      projectionStage,
    ]);

    return { status: true, data: allSessions };
  } catch (error) {
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
 * Service function to retrieve sessions of a specific user.
 * @param {string} userId - The ID of the user whose sessions are to be retrieved.
 * @returns {Object} - Result indicating the success status of the operation and the retrieved session data.
 */
exports.getUserSessionService = async (userId) => {
  try {
    // Define aggregation stages for retrieving sessions of a specific user
    const matchedStage = {
      $match: {
        user: userId,
      },
    };

    const instructorLookupStage = {
      $lookup: {
        from: "instructors",
        localField: "instructor",
        foreignField: "_id",
        as: "instructorDetails",
      },
    };

    const instructorUnwindStage = {
      $unwind: "$instructorDetails",
    };

    const projectionStage = {
      $project: {
        note_for_instructor: 1,
        status: 1,
        instructorDetails: {
          name: "$instructorDetails.instructor_name",
          qualification: "$instructorDetails.instructor_qualification",
          details: "$instructorDetails.instructor_details",
          image: "$instructorDetails.image",
        },
      },
    };

    const limitStage = { $limit: 1 };

    // Perform aggregation to retrieve user sessions
    const userSessions = await BookSessionWithInstructorModel.aggregate([
      matchedStage,
      instructorLookupStage,
      instructorUnwindStage,
      projectionStage,
      limitStage,
    ]);

    // If no sessions found, return error message
    if (!userSessions) {
      return {
        message: {
          en: "Session not found.",
          ar: "الجلسة غير موجودة",
        },
      };
    }

    return { status: true, data: userSessions[0] };
  } catch (error) {
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
