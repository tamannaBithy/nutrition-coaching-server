const express = require("express");
const {
  createMainMealMenuController,
  getAllMainMealMenusForUsersController,
  getMainMealMenuByIdController,
  updateMainMealMenuController,
  deleteMainMealMenuController,
  getAllMainMealMenusForAdminController,
} = require("../controllers/MainMealMenuControllers");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  validateMongooseIdMiddleware,
  createMainMealMenuValidationMiddleware,
  updateMainMealMenuValidationMiddleware,
} = require("../middlewares/MainMenuValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validateLangCodeQueryParams,
  validatePaginationQueryParamsMainMealMenusForAdmin,
} = require("../middlewares/RequestQueriesValidationMiddleware");

const router = express.Router();

// Create a Main Meal Menu (admin only)
router.post(
  "/main-meal-menus",
  authMiddleware,
  isAdminMiddleware,
  createMainMealMenuValidationMiddleware,
  validateErrorResult,
  createMainMealMenuController
);

// Get All Main Meal Menus for Users
router.post(
  "/get-main-meal-menus",
  authMiddleware,
  validateLangCodeQueryParams,
  validateErrorResult,
  getAllMainMealMenusForUsersController
);

// Get All Main Meal Menus for Admin
router.get(
  "/main-meal-menus/admin",
  authMiddleware,
  isAdminMiddleware,
  validatePaginationQueryParamsMainMealMenusForAdmin,
  validateErrorResult,
  getAllMainMealMenusForAdminController
);

// Get Single Main Meal Menu by ID
router.get(
  "/main-meal-menus/:id",
  authMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  getMainMealMenuByIdController
);

// Update Main Meal Menu by ID (admin only)
router.put(
  "/main-meal-menus/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  updateMainMealMenuValidationMiddleware,
  validateErrorResult,
  updateMainMealMenuController
);

// Delete Main Meal Menu by ID (admin only)
router.delete(
  "/main-meal-menus/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  deleteMainMealMenuController
);

module.exports = router;
