const express = require("express");
const {
  createMealPreferenceController,
  getAllMealPreferencesController,
  getMealPreferenceByIdController,
  updateMealPreferenceController,
  deleteMealPreferenceController,
  getAllMealPreferencesForAdminController,
} = require("../controllers/MealPreferenceControllers");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  validateCreateMealPreference,
  validateUpdateMealPreference,
  validateMongooseIdMiddleware,
} = require("../middlewares/MealPreferenceValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validateLangCodeQueryParams,
} = require("../middlewares/RequestQueriesValidationMiddleware");

const router = express.Router();

// Create a Meal Preference (admin only)
router.post(
  "/meal-preferences",
  authMiddleware,
  isAdminMiddleware,
  validateCreateMealPreference,
  validateErrorResult,
  createMealPreferenceController
);

// Get All Meal Preferences
router.get(
  "/meal-preferences",
  validateLangCodeQueryParams,
  validateErrorResult,
  getAllMealPreferencesController
);

// Get Single Meal Preference by ID (admin only)
router.get(
  "/meal-preferences/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  getMealPreferenceByIdController
);

// Update Meal Preference by ID (admin only)
router.put(
  "/meal-preferences/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateUpdateMealPreference,
  validateErrorResult,
  updateMealPreferenceController
);

// Delete Meal Preference by ID (admin only)
router.delete(
  "/meal-preferences/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  deleteMealPreferenceController
);

// Get All Meal Preferences for Admin
router.get(
  "/admin/meal-preferences",
  authMiddleware,
  isAdminMiddleware,
  validateLangCodeQueryParams,
  validateErrorResult,
  getAllMealPreferencesForAdminController
);

module.exports = router;
