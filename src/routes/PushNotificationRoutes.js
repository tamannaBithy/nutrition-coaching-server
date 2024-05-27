const express = require("express");
const {
  subscribeNotificationController,
  sendNotificationController,
} = require("../controllers/PushNotificationControllers");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");

const router = express.Router();

/**
 * @swagger
 * /subscribe:
 *   post:
 *     tags:
 *       - "Push Notifications"
 *     summary: "Subscribe to push notifications"
 *     description: "Subscribe to push notifications for receiving updates."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endpoint:
 *                 type: string
 *                 description: "The endpoint URL for the push notification subscription."
 *                 example: "https://example.com/subscription"
 *               expirationTime:
 *                 type: number
 *                 description: "The expiration time for the subscription in milliseconds."
 *                 example: 1648568400000
 *               keys:
 *                 type: object
 *                 description: "Object containing keys for the subscription."
 *                 example: {"p256dh": "BOrvSWjCQxEqfp3VXKoR9NrRkZw...", "auth": "BdpzH8w0OVag2xN7dU6s_A..."}
 *     responses:
 *       '200':
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success or failure of the subscription process.
 *                 message:
 *                   type: object
 *                   properties:
 *                     en:
 *                       type: string
 *                       example: "Subscription saved."
 *                     ar:
 *                       type: string
 *                       example: "تم حفظ الاشتراك"
 */
router.post("/subscribe", subscribeNotificationController);

/**
 * @swagger
 * /send-notification:
 *   post:
 *     tags:
 *       - "Push Notifications"
 *     summary: "Send push notification (Admin only)"
 *     description: "Send push notification to all subscribers. This endpoint is accessible only to admin users."
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: "Authorization"
 *         in: "header"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notification_title:
 *                 type: string
 *                 description: "The title of the notification."
 *                 example: "New Update Available"
 *               notification_desc:
 *                 type: string
 *                 description: "The description or content of the notification."
 *                 example: "A new update is available. Click to view details."
 *     responses:
 *       '200':
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success or failure of the notification sending process.
 *                 message:
 *                   type: object
 *                   properties:
 *                     en:
 *                       type: string
 *                       example: "Message sent to push service."
 *                     ar:
 *                       type: string
 *                       example: "تم إرسال الرسالة إلى خدمة الدفع"
 */
router.post(
  "/send-notification",
  authMiddleware,
  isAdminMiddleware,
  sendNotificationController
);

module.exports = router;
