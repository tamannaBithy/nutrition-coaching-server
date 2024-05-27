const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  createInstructorController,
  updateInstructorController,
  deleteInstructorController,
  getAllInstructorsController,
  getAllInstructorsForAdminController,
} = require("../controllers/InstructorControllers");
const {
  validateMongooseIdMiddleware,
  createInstructorValidationMiddleware,
  updateInstructorValidationMiddleware,
} = require("../middlewares/InstructorValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validatePaginationQueryParamsAllInstructor,
} = require("../middlewares/RequestQueriesValidationMiddleware");

const router = express.Router();

// Create a new instructor
router.post(
  "/create-instructor",
  authMiddleware,
  isAdminMiddleware,
  createInstructorValidationMiddleware,
  validateErrorResult,
  createInstructorController
);

// Update an instructor by ID
router.put(
  "/update-instructor/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  updateInstructorValidationMiddleware,
  validateErrorResult,
  updateInstructorController
);

// Delete an instructor by ID
router.delete(
  "/delete-instructor/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  deleteInstructorController
);

// Get all instructors
router.get(
  "/get-instructors",
  validatePaginationQueryParamsAllInstructor,
  validateErrorResult,
  getAllInstructorsController
);

// Get all instructors for admin
router.get(
  "/admin/get-instructors",
  authMiddleware,
  isAdminMiddleware,
  validatePaginationQueryParamsAllInstructor,
  validateErrorResult,
  getAllInstructorsForAdminController
);

module.exports = router;
