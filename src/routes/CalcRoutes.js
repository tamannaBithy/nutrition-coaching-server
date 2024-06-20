const express = require("express");
const {
  createAdminKetoController,
  createUserKetoController,
  createUserMacroController,
  updateAdminKetoController,
} = require("../controllers/KetoCalcControllers");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");

const {
  validateUserKetoData,
  validateUserMacroData,
  validateAdminKetoData,
} = require("../middlewares/ketoValidationMiddleware");

const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");

const router = express.Router();

// Create Keto calculation for user
router.post(
  "/create-userKetoCalc",
  validateUserKetoData,
  validateErrorResult,
  createUserKetoController
);

// Create Macro calculation for user
router.post(
  "/create-userMacroCalc",
  validateUserMacroData,
  validateErrorResult,
  createUserMacroController
);

// Create Keto input for admin
router.post(
  "/create-adminInput",
  authMiddleware,
  isAdminMiddleware,
  validateAdminKetoData,
  validateErrorResult,
  createAdminKetoController
);

// Update Keto input for admin
router.patch(
  "/update-adminInput",
  authMiddleware,
  isAdminMiddleware,
  updateAdminKetoController
);

module.exports = router;
