const express = require("express");
const {
  createMealTypeController,
  getAllMealTypesController,
  getMealTypeByIdController,
  updateMealTypeController,
  deleteMealTypeController,
} = require("../controllers/MealTypesControllers");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  validateCreateMealType,
  validateUpdateMealType,
  validateMongooseIdMiddleware,
} = require("../middlewares/MealTypeValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validateLangCodeQueryParams,
} = require("../middlewares/RequestQueriesValidationMiddleware");
const router = express.Router();

// Create a Meal Type (specifically for admin users)
router.post(
  "/meal-types",
  authMiddleware,
  isAdminMiddleware,
  validateCreateMealType,
  validateErrorResult,
  createMealTypeController
);

// Get All Meal Types
router.get(
  "/meal-types",
  validateLangCodeQueryParams,
  validateErrorResult,
  getAllMealTypesController
);

// Get Single Meal Type (specifically for admin users)
router.get(
  "/meal-types/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  getMealTypeByIdController
);

// Update Meal Type (specifically for admin users)
router.put(
  "/meal-types/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateUpdateMealType,
  validateErrorResult,
  updateMealTypeController
);

// Delete Meal Type (specifically for admin users)
router.delete(
  "/meal-types/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  deleteMealTypeController
);

module.exports = router;
