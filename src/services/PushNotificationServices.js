require("dotenv").config();
const webPush = require("web-push");
const SubscriptionModel = require("../models/SubscriptionModel");
const PushNotificationModel = require("../models/PushNotificationModel");

// Set VAPID details for web push notifications
webPush.setVapidDetails(
  "mailto:bimurto.bithy14@gmail.com", // Email address associated with the VAPID key
  process.env.VAPID_PUBLIC_KEY, // Public key for VAPID authentication
  process.env.VAPID_PRIVATE_KEY // Private key for VAPID authentication
);

/**
 * Service function to save a subscription for push notifications.
 * @param {Object} req - Express request object containing subscription data.
 * @returns {Object} - Result of the subscription saving process.
 */
exports.subscriptionService = async (req) => {
  try {
    const subscription = req?.body;

    // Set an expiration time for the subscription (24 hours from now)
    const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    const modifiedSubscription = {
      endpoint: subscription?.endpoint,
      expirationTime: expirationTime,
      keys: subscription?.keys,
    };

    // Create a new subscription instance and save it to the database
    const newSubscription = new SubscriptionModel(modifiedSubscription);
    await newSubscription.save();

    return {
      status: true,
      message: {
        en: "Subscription saved.",
        ar: "تم حفظ الاشتراك",
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
 * Service function to send push notifications to all subscribers.
 * @param {Object} notificationData - Data for the notification to be sent.
 * @param {string} userId - The ID of the user triggering the notification.
 * @returns {Object} - Result of the notification sending process.
 */
exports.sendNotificationService = async (notificationData, userId) => {
  try {
    // Create payload for the notification
    const notificationPayload = JSON.stringify({
      title: notificationData.notification_title,
      body: notificationData.notification_desc,
    });

    // Fetch all subscriptions from the database
    const userSubscription = await SubscriptionModel.find(
      {},
      { _id: 0, createdAt: 0, updatedAt: 0 }
    ).lean();

    // Send notification to each subscriber
    userSubscription.forEach((subscription) => {
      webPush
        .sendNotification(subscription, notificationPayload)
        .catch((error) => {
          console.error("Error sending notification:", error);
        });
    });

    // Save the sent notification to the database
    const newNotification = new PushNotificationModel({
      notification_title: notificationData.notification_title,
      notification_desc: notificationData.notification_desc,
      created_by: userId,
    });
    await newNotification.save();

    return {
      status: true,
      message: {
        en: "Message sent to push service.",
        ar: "تم إرسال الرسالة إلى خدمة الدفع",
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
