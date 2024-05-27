const express = require("express");
const {
  createMealPerDayController,
  getAllMealPerDayController,
  getMealPerDayByIdController,
  updateMealPerDayController,
  deleteMealPerDayController,
  getAllMealsPerDayForAdminController,
} = require("../controllers/MealsPerDayControllers");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  validateCreateMealsPerDay,
  validateUpdateMealsPerDay,
  validateMongooseIdMiddleware,
} = require("../middlewares/MealsPerDayValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");

const router = express.Router();

// Create a Meal Per Day (specifically for admin users)
router.post(
  "/meal-per-day",
  authMiddleware,
  isAdminMiddleware,
  validateCreateMealsPerDay,
  validateErrorResult,
  createMealPerDayController
);

// Get All Meals Per Day
router.get("/meal-per-day", getAllMealPerDayController);

// Get All Meals Per Day for Admin
router.get(
  "/meal-per-day/admin",
  authMiddleware,
  isAdminMiddleware,
  getAllMealsPerDayForAdminController
);

// Get Single Meal Per Day by ID (specifically for admin users)
router.get(
  "/meal-per-day/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  getMealPerDayByIdController
);

// Update Meal Per Day by ID (specifically for admin users)
router.put(
  "/meal-per-day/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateUpdateMealsPerDay,
  validateErrorResult,
  updateMealPerDayController
);

// Delete Meal Per Day by ID (specifically for admin users)
router.delete(
  "/meal-per-day/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  deleteMealPerDayController
);

module.exports = router;
