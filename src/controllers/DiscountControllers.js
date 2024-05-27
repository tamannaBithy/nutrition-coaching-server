const {
  createDiscountService,
  getDiscountByIdService,
  updateDiscountService,
  deleteDiscountService,
  getAllDiscountService,
} = require("../services/DiscountServices");

// Create a new Discount for Order (specifically for admin users)
exports.createDiscountController = async (req, res) => {
  const result = await createDiscountService(req.body, req.user._id);
  return res.status(201).send(result);
};

// Get all Discounts for Order
exports.getAllDiscountController = async (req, res) => {
  const result = await getAllDiscountService(req);
  return res.status(200).send(result);
};

// Get details of a specific Discount for Order
exports.getDiscountByIdController = async (req, res) => {
  const result = await getDiscountByIdService(req.params.discountId);
  return res.status(200).send(result);
};

// Update a specific Discount for Order
exports.updateDiscountController = async (req, res) => {
  const result = await updateDiscountService(
    req.params.discountId,
    req.params.rangeId,
    req.body
  );
  return res.status(200).send(result);
};

// Delete a specific Discount for Order (specifically for admin users)
exports.deleteDiscountController = async (req, res) => {
  const result = await deleteDiscountService(
    req.params.discountId,
    req.params.rangeId
  );
  return res.status(200).send(result);
};
