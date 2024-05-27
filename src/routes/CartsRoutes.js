const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const {
  addToMainMealCartController,
  addToOfferedMealCartController,
  getAllCartsController,
  deleteMealFromMainMealCartController,
  deleteMealFromOfferedMealCartController,
  addToCustomizedMealCartController,
  deleteMealFromCustomizedMealCartController,
  getPriceOfCustomizedMeal,
  populateMealsForRemainingDaysController,
} = require("../controllers/CartControllers");
const {
  addToMainMealCartValidationMiddleware,
  addToOfferedMealCartValidationMiddleware,
  validateMenuMongooseIdMiddleware,
  validateCartMongooseIdMiddleware,
} = require("../middlewares/CartValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");

const router = express.Router();

// Add a Main Meal to the user's cart
router.post(
  "/cart/main-meal",
  authMiddleware,
  addToMainMealCartValidationMiddleware,
  validateErrorResult,
  addToMainMealCartController
);

// Add an Offered Meal to the user's cart
router.post(
  "/cart/offered-meal",
  authMiddleware,
  addToOfferedMealCartValidationMiddleware,
  validateErrorResult,
  addToOfferedMealCartController
);

// Add a Customized Meal to the user's cart
router.post(
  "/cart/customized-meal",
  authMiddleware,
  addToCustomizedMealCartController
);

// Add repeated meals to the user's cart for remaining days
router.post(
  "/cart/repeated-meals",
  authMiddleware,
  populateMealsForRemainingDaysController
);

// Get all carts for a user with aggregated prices
router.get("/carts", authMiddleware, getAllCartsController);

// Get the price of a customized meal
router.get("/customizedMeal-price", authMiddleware, getPriceOfCustomizedMeal);

// Delete a Main Meal from the user's cart
router.delete(
  "/cart/main-meal/:cartId/:menuId",
  authMiddleware,
  validateCartMongooseIdMiddleware,
  validateMenuMongooseIdMiddleware,
  validateErrorResult,
  deleteMealFromMainMealCartController
);

// Delete an Offered Meal from the user's cart
router.delete(
  "/cart/offered-meal/:cartId/:menuId",
  authMiddleware,
  validateCartMongooseIdMiddleware,
  validateMenuMongooseIdMiddleware,
  validateErrorResult,
  deleteMealFromOfferedMealCartController
);

// Delete a Customized Meal from the user's cart
router.delete(
  "/cart/customized-meal/:cartId/:mealId",
  authMiddleware,
  validateCartMongooseIdMiddleware,
  validateMenuMongooseIdMiddleware,
  validateErrorResult,
  deleteMealFromCustomizedMealCartController
);

module.exports = router;
