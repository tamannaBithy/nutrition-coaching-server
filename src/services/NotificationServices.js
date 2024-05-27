const NotificationForAdminModel = require("../models/NotificationForAdminModel");
const NotificationModel = require("../models/NotificationsModel");
const UserModel = require("../models/UserModel");

/**
 * Fetch notifications for a specific user with pagination.
 * @param {string} userId - The ID of the user for whom notifications are fetched.
 * @param {number} limit - The maximum number of notifications to fetch per request.
 * @returns {Promise<Array>} - A promise that resolves to an array of notifications.
 */
exports.getNotificationsService = async (userId, limit) => {
  try {
    // Count the number of unread notifications in NotificationModel
    const userUnreadCount = await NotificationModel.countDocuments({
      mark_as_read: false,
      user_id: userId,
    });

    // Count the number of unread notifications in NotificationForAdminModel
    const adminUnreadCount = await NotificationForAdminModel.countDocuments({
      mark_as_read: false,
    });

    // Checking if the user is admin or not
    const isAdmin = await UserModel.exists({ _id: userId, role: "admin" });

    let notifications = [];

    if (isAdmin) {
      // Fetch notifications belonging to the specified admin user from NotificationModel
      const userNotifications = await NotificationModel.find({
        user_id: userId,
      })
        .sort({ createdAt: -1 }) // Sort notifications by creation date in descending order (newest first)
        .limit(limit); // Limit the number of notifications to fetch

      notifications = userNotifications;
    } else {
      // Fetch notifications belonging to the specified non-admin user from NotificationModel
      const userNotifications = await NotificationModel.find({
        user_id: userId,
      })
        .sort({ createdAt: -1 }) // Sort notifications by creation date in descending order (newest first)
        .limit(limit); // Limit the number of notifications to fetch

      notifications = userNotifications;
    }

    // Fetch notifications belonging to admin users from NotificationForAdminModel
    const adminNotifications = await NotificationForAdminModel.find()
      .sort({ createdAt: -1 }) // Sort notifications by creation date in descending order (newest first)
      .limit(limit); // Limit the number of notifications to fetch

    // Combine user notifications and admin notifications
    notifications = [...notifications, ...adminNotifications];

    // Calculate the total unread count for admin users
    const totalUnreadCount = isAdmin
      ? userUnreadCount + adminUnreadCount
      : userUnreadCount;

    return {
      status: true,
      data: notifications,
      unreadCount: totalUnreadCount,
    };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in getting notifications:", error);
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
 * Mark a notification as read by its ID.
 * @param {string} notificationId - The ID of the notification to mark as read.
 * @returns {Promise<Object>} - A promise that resolves to the updated notification.
 */
exports.markNotificationAsReadService = async (notificationId) => {
  try {
    // Find and update the notification in the user's notifications
    let updatedNotification = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { mark_as_read: true },
      { new: true }
    );

    // If the notification is not found in the user's notifications, try admin notifications
    if (!updatedNotification) {
      updatedNotification = await NotificationForAdminModel.findByIdAndUpdate(
        notificationId,
        { mark_as_read: true },
        { new: true }
      );
    }

    // If the notification is still not found, return an error
    if (!updatedNotification) {
      return {
        status: false,
        message: {
          en: "Notification not found.",
          ar: "الإشعار غير موجود",
        },
      };
    }

    return {
      status: true,
      data: updatedNotification,
    };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in marking notification as read:", error);
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
 * Mark all notifications as read for a specific user.
 * @param {string} userId - The ID of the user for whom notifications are marked as read.
 * @returns {Promise<Array>} - A promise that resolves to an array of updated notifications.
 */
exports.markAllNotificationsAsReadService = async (userId) => {
  try {
    // Find the user is admin or not
    const isAdmin = await UserModel.find({ _id: userId, role: "admin" });

    // Find all notifications belonging to the specified user and update the 'mark_as_read' field to true
    const updatedNotifications = await NotificationModel.updateMany(
      { user_id: userId },
      { mark_as_read: true },
      { new: true }
    );

    // Find all notifications belonging to the specified admin user and update the 'mark_as_read' field to true
    if (isAdmin) {
      const updatedNotifications = await NotificationForAdminModel.updateMany(
        { mark_as_read: true },
        { new: true }
      );
    }

    return {
      status: true,
      message: {
        en: "All notifications are now marked as read.",
        ar: "تمت قراءة جميع الإشعارات الآن",
      },
    };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in mark all as read notifications:", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};
