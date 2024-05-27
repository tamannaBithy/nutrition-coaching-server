const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  createOrUpdateTermsAndConditionsController,
  getTermsAndConditionsController,
} = require("../controllers/TermsAndConditionsControllers");
const {
  validateTermsAndConditionsMiddleware,
} = require("../middlewares/TermsAndConditionsValidationMiddleware");

// Create or Update Terms and Conditions(Admin only)
router.post(
  "/terms-and-conditions",
  authMiddleware,
  isAdminMiddleware,
  validateTermsAndConditionsMiddleware,
  validateErrorResult,
  createOrUpdateTermsAndConditionsController
);

// Get Terms and Conditions
router.get("/terms-and-conditions", getTermsAndConditionsController);

module.exports = router;
