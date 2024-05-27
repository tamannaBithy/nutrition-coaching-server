const {
  placeOrderService,
  getMyOrdersService,
  getAllOrdersForAdminService,
  updateOrderStatusByAdminService,
  updateDeliveryStatusByAdminService,
  updatePaymentStatusByAdminService,
} = require("../services/OrderServices");

// Place a new order
exports.placeOrder = async (req, res) => {
  const io = req.app.get("socketio"); // Access Socket.io instance from Express app
  const result = await placeOrderService(req.body, req.user._id, io);
  return res.status(201).json(result);
};

// Get all order lists for a user
exports.getMyOrders = async (req, res) => {
  const result = await getMyOrdersService(req, req.user._id);
  return res.status(200).json(result);
};

// Get all order lists for admin
exports.getAllOrdersForAdmin = async (req, res) => {
  const result = await getAllOrdersForAdminService(req);
  return res.status(200).json(result);
};

// Update order status by admin
exports.updateOrderStatusByAdmin = async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;
  const io = req.app.get("socketio"); // Access Socket.io instance from Express app
  const result = await updateOrderStatusByAdminService(orderId, newStatus, io);
  return res.status(200).json(result);
};

// Update delivery status by admin
exports.updateDeliveryStatusByAdmin = async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;
  const io = req.app.get("socketio"); // Access Socket.io instance from Express app
  const result = await updateDeliveryStatusByAdminService(
    orderId,
    newStatus,
    io
  );
  return res.status(200).json(result);
};

// Update payment status by admin
exports.updatePaymentStatusByAdmin = async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;
  const io = req.app.get("socketio"); // Access Socket.io instance from Express app

  const result = await updatePaymentStatusByAdminService(
    orderId,
    newStatus,
    io
  );
  return res.status(200).json(result);
};
