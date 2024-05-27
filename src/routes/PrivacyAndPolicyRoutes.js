const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  validatePrivacyPolicyMiddleware,
  validateLangParamMiddleware,
} = require("../middlewares/PrivacyPolicyValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  createOrUpdatePrivacyPolicyController,
  getPrivacyPolicyController,
} = require("../controllers/PrivacyPolicyControllers");

const router = express.Router();

// Create or Update Privacy Policy (admin only)
router.post(
  "/privacy-policy",
  authMiddleware,
  isAdminMiddleware,
  validatePrivacyPolicyMiddleware,
  validateErrorResult,
  createOrUpdatePrivacyPolicyController
);

// Get Privacy Policy
router.get("/privacy-policy", getPrivacyPolicyController);

module.exports = router;
