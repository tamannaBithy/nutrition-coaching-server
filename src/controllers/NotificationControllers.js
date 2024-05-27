const {
  getNotificationsService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
} = require("../services/NotificationServices");

// Get notifications for the logged-in user
exports.getNotificationsController = async (req, res) => {
  const result = await getNotificationsService(
    req.user._id,
    req.query.limit,
    req.query.skip
  );
  return res.status(200).send(result);
};

// Mark a notification as read by ID
exports.markNotificationAsReadController = async (req, res) => {
  const result = await markNotificationAsReadService(req.params.id);
  return res.status(200).send(result);
};

// Mark all notifications as read for the logged-in user
exports.markAllNotificationsAsReadController = async (req, res) => {
  const result = await markAllNotificationsAsReadService(req.user._id);
  return res.status(200).send(result);
};
