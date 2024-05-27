const express = require("express");
const {
  customizedMealController,
  deleteCustomizedMealController,
  getAllCustomizedMealController,
  getSingleCustomizedMealController,
  getAdminCustomizedMealController,
  updateCustomizedMealController,
} = require("../controllers/CustomizedMealControllers");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validatePaginationQueryParamsForAllCustomizedMeals,
} = require("../middlewares/RequestQueriesValidationMiddleware");
const {
  createCustomizedMealMenuValidationMiddleware,
  validateMongooseIdIdMiddleware,
  updateCustomizedMealServiceValidationMiddleware,
} = require("../middlewares/CustomizedMenuValidationMiddleware");
const router = express.Router();

// Create a new Customized Meal
router.post(
  "/create-customizedMeal",
  authMiddleware,
  isAdminMiddleware,
  createCustomizedMealMenuValidationMiddleware,
  validateErrorResult,
  customizedMealController
);

// Delete a Customized Meal by ID
router.delete(
  "/delete-customizedMeal/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdIdMiddleware,
  validateErrorResult,
  deleteCustomizedMealController
);

// Get all Customized Meals
router.get(
  "/get-customizedMeals",
  authMiddleware,
  validatePaginationQueryParamsForAllCustomizedMeals,
  validateErrorResult,
  getAllCustomizedMealController
);

// Get a single Customized Meal by ID
router.get(
  "/get-customizedMeal/:id",
  authMiddleware,
  validateMongooseIdIdMiddleware,
  validateErrorResult,
  getSingleCustomizedMealController
);

// Get all Customized Meals for admin users
router.get(
  "/get-adminCustomizedMeal",
  authMiddleware,
  isAdminMiddleware,
  validatePaginationQueryParamsForAllCustomizedMeals,
  validateErrorResult,
  getAdminCustomizedMealController
);

// Update a Customized Meal by ID
router.patch(
  "/update-customizedMeal/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdIdMiddleware,
  updateCustomizedMealServiceValidationMiddleware,
  validateErrorResult,
  updateCustomizedMealController
);

module.exports = router;
