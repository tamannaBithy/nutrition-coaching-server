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
  validateMongooseRangeIdIdMiddleware,
  validateMongooseDiscountIdMiddleware,
  updateDiscountValidationRules,
  discountValidationRules,
} = require("../middlewares/DiscountValidationMiddleware");

const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validateDiscountCategoryQueryParams,
} = require("../middlewares/RequestQueriesValidationMiddleware");

const router = express.Router();

router.post(
  "/discounts-for-order",
  authMiddleware,
  isAdminMiddleware,
  discountValidationRules,
  validateErrorResult,
  createDiscountController
);

router.get(
  "/discounts-for-order",
  authMiddleware,
  isAdminMiddleware,
  validateDiscountCategoryQueryParams,
  validateErrorResult,
  getAllDiscountController
);

router.get(
  "/discounts-for-order/:discountId",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseDiscountIdMiddleware,
  validateErrorResult,
  getDiscountByIdController
);

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
