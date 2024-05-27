const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  createAdminCustomizedMealController,
  updateAdminCustomizedMealController,
  updateMealDurationController,
  getAllUserMealsInputController,
  deleteUserMealInputController,
} = require("../controllers/AdminInputsForCustomizedMealControllers");
const {
  validatePaginationQueryParamsAllUserMealsInput,
} = require("../middlewares/RequestQueriesValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");

const router = express.Router();

// Route to create admin customized meal input
router.post(
  "/create-adminCustomizedMealInput",
  authMiddleware,
  isAdminMiddleware,
  createAdminCustomizedMealController
);

// Route to update admin customized meal input
router.patch(
  "/update-adminCustomizedMealInput",
  authMiddleware,
  isAdminMiddleware,
  updateAdminCustomizedMealController
);

// Route to get all user meals input
router.get(
  "/get-allUserMealsInput",
  authMiddleware,
  isAdminMiddleware,
  validatePaginationQueryParamsAllUserMealsInput,
  validateErrorResult,
  getAllUserMealsInputController
);

// Route to update meal duration by ID
router.patch(
  "/update-mealDuration/:id",
  authMiddleware,
  isAdminMiddleware,
  updateMealDurationController
);

// Route to delete user meal input by ID
router.delete(
  "/delete-userMealInput/:id",
  authMiddleware,
  isAdminMiddleware,
  deleteUserMealInputController
);

module.exports = router;
