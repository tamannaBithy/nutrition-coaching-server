const {
  subscriptionService,
  sendNotificationService,
} = require("../services/PushNotificationServices");

// Controller function for subscribing to push notifications
exports.subscribeNotificationController = async (req, res) => {
  // Call subscriptionService to subscribe to push notifications
  const result = await subscriptionService(req);

  // Respond with the result message
  res.json({ status: "success", message: result.message });
};

// Controller function for sending push notifications
exports.sendNotificationController = async (req, res) => {
  // Call sendNotificationService to send push notifications
  const result = await sendNotificationService(req.body, req.user._id);

  // Respond with the result message
  res.json({ status: "success", message: result.message });
};
