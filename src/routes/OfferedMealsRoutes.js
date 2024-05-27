const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  createOfferedMealController,
  getOfferedMealsByIdController,
  getAllOfferedMealsController,
  getAllOfferedMealsDashboardController,
  deleteOfferedMealController,
  createOfferedMealForPackageController,
  getPackagesListController,
} = require("../controllers/OfferedMealsControllers");
const {
  validateCreateOfferedMeal,
  validateMongooseIdMiddleware,
} = require("../middlewares/OfferedMealValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validateLangCodeQueryParams,
  validatePaginationQueryParamsForOfferedMeals,
} = require("../middlewares/RequestQueriesValidationMiddleware");

const router = express.Router();

// Create Offered Meal Package
router.post(
  "/offered-meals-package",
  authMiddleware,
  isAdminMiddleware,
  createOfferedMealController
);

// Create Meal For the package
router.post(
  "/offered-meals",
  authMiddleware,
  isAdminMiddleware,
  createOfferedMealForPackageController
);

// Get all Offered Meals
router.get(
  "/offered-meals",
  authMiddleware,
  validateLangCodeQueryParams,
  validateErrorResult,
  getAllOfferedMealsController
);

// Get all Offered Meals for admin dashboard
router.get(
  "/admin/offered-meals",
  authMiddleware,
  isAdminMiddleware,
  validateLangCodeQueryParams,
  validatePaginationQueryParamsForOfferedMeals,
  validateErrorResult,
  getAllOfferedMealsDashboardController
);

// Get a single Offered Meal by ID
router.get(
  "/offered-meals/:mealId",
  authMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  getOfferedMealsByIdController
);

// Delete an Offered Meal by ID
router.delete(
  "/offered-meals/:mealId",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  deleteOfferedMealController
);

// Route to get all offered packages names
router.get(
  "/offered-packages",
  authMiddleware,
  isAdminMiddleware,
  getPackagesListController
);

module.exports = router;
