const express = require("express");

const { authMiddleware } = require("../middlewares/AuthMiddleware");
const {
  createUserCustomizedMealController,
  getUserCustomizedMealController,
} = require("../controllers/UserInputsForCustomizedMealControllers");
const {
  createUserCustomizedMealValidationMiddleware,
} = require("../middlewares/UserCustomizedMealValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");

const router = express.Router();

router.post(
  "/create-userCustomizedMealInput",
  authMiddleware,
  createUserCustomizedMealValidationMiddleware,
  validateErrorResult,
  createUserCustomizedMealController
);

router.get(
  "/get-userCustomizedMealInput",
  authMiddleware,
  getUserCustomizedMealController
);

module.exports = router;
