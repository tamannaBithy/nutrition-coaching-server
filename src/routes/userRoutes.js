const express = require("express");
const {
  registerUserController,
  updateUserController,
  deleteUserController,
  getUserByIdController,
  forgetPasswordOTPController,
  getAllUsersController,
  verifyForgetPasswordOTPController,
  resetForgetPasswordController,
  changeOldPasswordController,
  disableOrEnableUserController,
  verifyProfileController,
  verifyProfileSendOtpController,
} = require("../controllers/UserControllers");
const {
  userRegistrationValidator,
  forgetPasswordOTPValidator,
  updateUserValidator,
  resetForgetPasswordValidator,
  changeOldPasswordValidator,
  validateMongooseIdMiddleware,
} = require("../middlewares/UserValidationMiddleware");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validatePaginationQueryParamsGetAllUser,
} = require("../middlewares/RequestQueriesValidationMiddleware");

const router = express.Router();

// Register a new user
router.post(
  "/register",
  userRegistrationValidator,
  validateErrorResult,
  registerUserController
);

// Update user information
router.put(
  "/update-user",
  authMiddleware,
  updateUserValidator,
  validateErrorResult,
  updateUserController
);

// Delete user account
router.delete("/delete-user", authMiddleware, deleteUserController);

// Get user profile
router.get("/get-profile", authMiddleware, getUserByIdController);

// Forget password (To send OTP to user phone)
router.post(
  "/forget-password-otp",
  forgetPasswordOTPValidator,
  validateErrorResult,
  forgetPasswordOTPController
);

// Verify forget Password OTP
router.put("/forget-password-otp/:otp", verifyForgetPasswordOTPController);

// Reset Forget Password
router.put(
  "/reset-forget-password",
  resetForgetPasswordValidator,
  validateErrorResult,
  resetForgetPasswordController
);

// Get all users (admin only)
router.get(
  "/all-users",
  authMiddleware,
  isAdminMiddleware,
  validatePaginationQueryParamsGetAllUser,
  validateErrorResult,
  getAllUsersController
);

// Change old password
router.put(
  "/change-password",
  authMiddleware,
  changeOldPasswordValidator,
  validateErrorResult,
  changeOldPasswordController
);

// Verify profile
router.put("/verify-profile", authMiddleware, verifyProfileController);

// Verify profile send otp
router.put(
  "/verify-profile-send-otp",
  authMiddleware,
  verifyProfileSendOtpController
);

// Disable or enable user (admin only)
router.put(
  "/disable-or-enable-user/:userId",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  disableOrEnableUserController
);

module.exports = router;
