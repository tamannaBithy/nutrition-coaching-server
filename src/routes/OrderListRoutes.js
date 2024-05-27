const express = require("express");
const {
  placeOrder,
  getMyOrders,
  getAllOrdersForAdmin,
  updateOrderStatusByAdmin,
  updateDeliveryStatusByAdmin,
  updatePaymentStatusByAdmin,
} = require("../controllers/OrderListControllers");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  placeOrderValidation,
  validateOrderStatus,
  validateDeliveryStatus,
  validatePaymentStatus,
  validateMongooseIdMiddleware,
} = require("../middlewares/OrderValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validatePaginationQueryParamsGetAllMyOrders,
  validatePaginationQueryParamsAllOrdersForAdmin,
} = require("../middlewares/RequestQueriesValidationMiddleware");

const router = express.Router();

/**
 * @swagger
 * /place-order:
 *   post:
 *     tags:
 *       - "Orders"
 *     summary: "Place a new order"
 *     description: "Endpoint to place a new order."
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
 *               note_from_user:
 *                 type: string
 *                 description: "Any note from the user regarding the order (optional)."
 *               delivery_address:
 *                 type: string
 *                 description: "The delivery address for the order."
 *               payment_method:
 *                 type: string
 *                 description: "The payment method for the order."
 *               number_of_meals_per_day:
 *                 type: integer
 *                 description: "The number of meals per day for the main meals (optional)."
 *               plan_duration:
 *                 type: integer
 *                 description: "The plan duration in days for the main meals (optional)."
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
 *                   description: Indicates the success or failure of the order placement process.
 *                 data:
 *                   type: object
 *                   description: Information about the placed order.
 *                 message:
 *                   type: object
 *                   properties:
 *                     en:
 *                       type: string
 *                       example: "Your order placed successfully."
 *                     ar:
 *                       type: string
 *                       example: "تم تقديم طلبك بنجاح."
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: object
 *                   properties:
 *                     en:
 *                       type: string
 *                       example: "Failed to place the order."
 *                     ar:
 *                       type: string
 *                       example: "فشل في تقديم الطلب."
 */
router.post(
  "/place-order",
  authMiddleware,
  placeOrderValidation,
  validateErrorResult,
  placeOrder
);

/**
 * @swagger
 * /my-orders:
 *   get:
 *     tags:
 *       - "Orders"
 *     summary: "Get user's order history"
 *     description: "Endpoint to retrieve a user's order history with pagination and date filtering."
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: "Authorization"
 *         in: "header"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - in: query
 *         name: orders_from
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: "Start date to filter orders (format: yyyy-mm-dd)."
 *       - in: query
 *         name: orders_end
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: "End date to filter orders (format: yyyy-mm-dd)."
 *       - in: query
 *         name: showPerPage
 *         required: true
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: "Number of items to show per page."
 *       - in: query
 *         name: pageNo
 *         required: true
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: "Page number for pagination."
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
 *                   description: Indicates the success or failure of retrieving user orders.
 *                 data:
 *                   type: array
 *                   description: User's order history.
 *                   items:
 *                     type: object
 *                     properties:
 *                       order_details:
 *                         type: object
 *                         description: Information about the order.
 *                       my_special_note:
 *                         type: string
 *                         description: Any note from the user regarding the order.
 *                       delivery_address:
 *                         type: string
 *                         description: The delivery address for the order.
 *                       paid_status:
 *                         type: boolean
 *                         description: Indicates if the order has been paid.
 *                       order_status:
 *                         type: string
 *                         description: The status of the order.
 *                       delivery_status:
 *                         type: string
 *                         description: The delivery status of the order.
 *                       order_placed_at:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the order was placed.
 *                 totalDataCount:
 *                   type: integer
 *                   description: Total number of orders matching the criteria.
 *                 totalPages:
 *                   type: array
 *                   description: Array of page numbers.
 *                   items:
 *                     type: integer
 *                   example: [1,2,3,4]
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number.
 *                 showingEnglish:
 *                   type: string
 *                   example: "Showing 1 - 5 out of 5 items"
 *                 showingArabic:
 *                   type: string
 *                   example: "عرض 1 - 5 من أصل 5 من العناصر"
 */
router.get(
  "/my-orders",
  authMiddleware,
  validatePaginationQueryParamsGetAllMyOrders,
  validateErrorResult,
  getMyOrders
);

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     tags:
 *       - "Orders"
 *     summary: "Get all orders for admin"
 *     description: "Endpoint to retrieve all orders for admin with pagination and date range."
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: "Authorization"
 *         in: "header"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - in: query
 *         name: orders_from
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: "Start date to filter orders (format: yyyy-mm-dd)."
 *       - in: query
 *         name: orders_end
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: "End date to filter orders (format: yyyy-mm-dd)."
 *       - in: query
 *         name: showPerPage
 *         required: true
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: "Number of items to show per page."
 *       - in: query
 *         name: pageNo
 *         required: true
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: "Page number for pagination."
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
 *                   description: Indicates the success or failure of retrieving all orders for admin.
 *                 data:
 *                   type: array
 *                   description: All orders for admin.
 *                   items:
 *                     type: object
 *                     properties:
 *                       customer_details:
 *                         type: object
 *                         properties:
 *                           phone:
 *                             type: string
 *                             description: Phone number of the customer.
 *                           email:
 *                             type: string
 *                             description: Email address of the customer.
 *                           name:
 *                             type: string
 *                             description: Name of the customer.
 *                       order_details:
 *                         type: object
 *                         description: Information about the order.
 *                       customer_special_note:
 *                         type: string
 *                         description: Any note from the customer regarding the order.
 *                       delivery_address:
 *                         type: string
 *                         description: The delivery address for the order.
 *                       payment_method:
 *                         type: string
 *                         description: The payment method used for the order.
 *                       paid_status:
 *                         type: boolean
 *                         description: Indicates if the order has been paid.
 *                       order_status:
 *                         type: string
 *                         description: The status of the order.
 *                       delivery_status:
 *                         type: string
 *                         description: The delivery status of the order.
 *                       order_placed_at:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the order was placed.
 *                 totalDataCount:
 *                   type: integer
 *                   description: Total number of orders matching the criteria.
 *                 totalPages:
 *                   type: array
 *                   description: Array of page numbers.
 *                   items:
 *                     type: integer
 *                   example: [1,2,3,4]
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number.
 *                 showingEnglish:
 *                   type: string
 *                   example: "Showing 1 - 5 out of 5 items"
 *                 showingArabic:
 *                   type: string
 *                   example: "عرض 1 - 5 من أصل 5 من العناصر"
 */
router.get(
  "/admin/orders",
  authMiddleware,
  isAdminMiddleware,
  validatePaginationQueryParamsAllOrdersForAdmin,
  validateErrorResult,
  getAllOrdersForAdmin
);

/**
 * @swagger
 * /admin/update-order/{orderId}:
 *   put:
 *     tags:
 *       - "Orders"
 *     summary: "Update order status by admin"
 *     description: "Endpoint to update the status of an order by admin."
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: "Authorization"
 *         in: "header"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *           description: "ID of the order to be updated."
 *         required: true
 *         description: "ID of the order to be updated."
 *       - in: query
 *         name: newStatus
 *         schema:
 *           type: string
 *           description: "New status to be set for the order."
 *         required: true
 *         example: "pending, confirm, rejected (enum values)"
 *         description: "New status to be set for the order."
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
 *                   description: Indicates the success or failure of updating the order status.
 *                 message:
 *                   type: object
 *                   properties:
 *                     en:
 *                       type: string
 *                       example: "Order status updated successfully."
 *                     ar:
 *                       type: string
 *                       example: "تم تحديث حالة الطلب بنجاح"
 */
router.put(
  "/admin/update-order/:orderId",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateOrderStatus,
  validateErrorResult,
  updateOrderStatusByAdmin
);

/**
 * @swagger
 * /admin/update-delivery/{orderId}:
 *   put:
 *     tags:
 *       - "Orders"
 *     summary: "Update delivery status by admin"
 *     description: "Endpoint to update the delivery status of an order by admin."
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: "Authorization"
 *         in: "header"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *           description: "ID of the order to be updated."
 *         required: true
 *         description: "ID of the order to be updated."
 *       - in: query
 *         name: newStatus
 *         schema:
 *           type: string
 *           description: "New delivery status to be set for the order."
 *         required: true
 *         example: "pending, shipped, delivered (enum values)"
 *         description: "New delivery status to be set for the order."
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
 *                   description: Indicates the success or failure of updating the delivery status.
 *                 message:
 *                   type: object
 *                   properties:
 *                     en:
 *                       type: string
 *                       example: "Delivery status updated successfully."
 *                     ar:
 *                       type: string
 *                       example: "تم تحديث حالة التسليم بنجاح"
 */
router.put(
  "/admin/update-delivery/:orderId",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateDeliveryStatus,
  validateErrorResult,
  updateDeliveryStatusByAdmin
);

/**
 * @swagger
 * /admin/update-payment/{orderId}:
 *   put:
 *     tags:
 *       - "Orders"
 *     summary: "Update payment status by admin for COD - (Cash On Delivery Orders)"
 *     description: "Endpoint to update the payment status of an order by admin."
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: "Authorization"
 *         in: "header"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *           description: "ID of the order to be updated."
 *         required: true
 *         description: "ID of the order to be updated."
 *       - in: query
 *         name: newStatus
 *         schema:
 *           type: boolean
 *           description: "New payment status to be set for the order."
 *         required: true
 *         description: "New payment status to be set for the order."
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
 *                   description: Indicates the success or failure of updating the payment status.
 *                 message:
 *                   type: object
 *                   properties:
 *                     en:
 *                       type: string
 *                       example: "Payment status updated successfully."
 *                     ar:
 *                       type: string
 *                       example: "تم تحديث حالة الدفع بنجاح"
 */
router.put(
  "/admin/update-payment/:orderId",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validatePaymentStatus,
  validateErrorResult,
  updatePaymentStatusByAdmin
);

module.exports = router;
