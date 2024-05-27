const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const {
  getNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
} = require("../controllers/NotificationControllers");
const {
  validateMongooseIdMiddleware,
  validateGetNotifications,
} = require("../middlewares/NotificationValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");

const router = express.Router();

// Get notifications for the logged-in user
router.get(
  "/notifications",
  authMiddleware,
  validateGetNotifications,
  getNotificationsController
);

// Mark a notification as read by ID
router.put(
  "/mark-as-read/:id",
  authMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  markNotificationAsReadController
);

// Mark all notifications as read for the logged-in user
router.put(
  "/mark-all-as-read",
  authMiddleware,
  markAllNotificationsAsReadController
);

module.exports = router;
