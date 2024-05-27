const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  createDiscountController,
  getDiscountByIdController,
  getAllDiscountController,
  updateDiscountController,
  deleteDiscountController,
} = require("../controllers/DiscountControllers");
const {
  discountValidationRules,
  updateDiscountValidationRules,
  validateMongooseDiscountIdMiddleware,
  validateMongooseRangeIdIdMiddleware,
} = require("../middlewares/discountValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validateDiscountCategoryQueryParams,
} = require("../middlewares/RequestQueriesValidationMiddleware");

const router = express.Router();

// Create a new discount for orders
router.post(
  "/discounts-for-order",
  authMiddleware,
  isAdminMiddleware,
  discountValidationRules,
  validateErrorResult,
  createDiscountController
);

// Get all discounts for orders
router.get(
  "/discounts-for-order",
  authMiddleware,
  isAdminMiddleware,
  validateDiscountCategoryQueryParams,
  validateErrorResult,
  getAllDiscountController
);

// Get details of a specific discount for orders by ID
router.get(
  "/discounts-for-order/:discountId",
  authMiddleware,
  isAdminMiddleware,
  getDiscountByIdController
);

// Update a discount for orders by ID
router.put(
  "/discounts-for-order/:discountId/:rangeId",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseDiscountIdMiddleware,
  validateMongooseRangeIdIdMiddleware,
  updateDiscountValidationRules,
  validateErrorResult,
  updateDiscountController
);

// Delete a discount for orders by ID
router.delete(
  "/discounts-for-order/:discountId/:rangeId",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseDiscountIdMiddleware,
  validateMongooseRangeIdIdMiddleware,
  validateErrorResult,
  deleteDiscountController
);

module.exports = router;
