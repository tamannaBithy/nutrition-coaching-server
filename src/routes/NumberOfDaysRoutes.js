const express = require("express");
const {
  createNumberOfDaysController,
  getAllNumberOfDaysController,
  getNumberOfDaysByIdController,
  updateNumberOfDaysController,
  deleteNumberOfDaysController,
  getAllDaysForAdminController,
} = require("../controllers/NumberOfDaysControllers");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  validateCreateNumberOfDays,
  validateUpdateNumberOfDays,
  validateMongooseIdMiddleware,
} = require("../middlewares/NumberOfDaysValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");

const router = express.Router();

// Create a Number of Days Record (specifically for admin users)
router.post(
  "/number-of-days",
  authMiddleware,
  isAdminMiddleware,
  validateCreateNumberOfDays,
  validateErrorResult,
  createNumberOfDaysController
);

// Get All Number of Days Records
router.get("/number-of-days", getAllNumberOfDaysController);

// Get All Days for Admin
router.get(
  "/number-of-days/admin",
  authMiddleware,
  isAdminMiddleware,
  getAllDaysForAdminController
);

// Get Single Number of Days Record by ID (specifically for admin users)
router.get(
  "/number-of-days/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  getNumberOfDaysByIdController
);

// Update Number of Days Record by ID (specifically for admin users)
router.put(
  "/number-of-days/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateUpdateNumberOfDays,
  validateErrorResult,
  updateNumberOfDaysController
);

// Delete Number of Days Record by ID (specifically for admin users)
router.delete(
  "/number-of-days/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  deleteNumberOfDaysController
);

module.exports = router;
