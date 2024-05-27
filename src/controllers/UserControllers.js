const {
  registerUserService,
  updateUserService,
  getUserByIdService,
  deleteUserService,
  forgetPasswordOTPService,
  verifyForgetPasswordOTPService,
  resetForgetPasswordService,
  getAllUsersService,
  changeOldPasswordService,
  disableOrEnableUserService,
  verifyProfileService,
  verifyProfileSendOtpControllerService,
} = require("../services/UserServices");

// Register a new user
exports.registerUserController = async (req, res) => {
  const result = await registerUserService(req.body);
  return res.status(201).send(result);
};

// Update user by ID
exports.updateUserController = async (req, res) => {
  const result = await updateUserService(req.user._id, req.body);
  return res.status(200).send(result);
};

// Delete user's own ID
exports.deleteUserController = async (req, res) => {
  const result = await deleteUserService(req.user);
  return res.status(200).send(result);
};

// Get user by ID
exports.getUserByIdController = async (req, res) => {
  const result = await getUserByIdService(req.user._id);
  return res.status(200).send(result);
};

// Forget password (To send OTP to user phone)
exports.forgetPasswordOTPController = async (req, res) => {
  const result = await forgetPasswordOTPService(req.body);
  return res.status(200).send(result);
};

// Reset Old password (Verify Reset Password OTP)
exports.verifyForgetPasswordOTPController = async (req, res) => {
  const result = await verifyForgetPasswordOTPService(req.params.otp);
  return res.status(200).send(result);
};

// Reset Old Password (Using the otp and user_ID)
exports.resetForgetPasswordController = async (req, res) => {
  const result = await resetForgetPasswordService(req.body);
  return res.status(200).send(result);
};

// Get all users
exports.getAllUsersController = async (req, res) => {
  const result = await getAllUsersService(req);
  return res.status(200).send(result);
};

// Change Old Password
exports.changeOldPasswordController = async (req, res) => {
  const result = await changeOldPasswordService(req);
  return res.status(200).send(result);
};

// Verify Profile
exports.verifyProfileController = async (req, res) => {
  const result = await verifyProfileService(req.body);
  return res.status(200).send(result);
};

// Verify Profile Send Otp
exports.verifyProfileSendOtpController = async (req, res) => {
  const result = await verifyProfileSendOtpControllerService(req);
  return res.status(200).send(result);
};

// Disable The User
exports.disableOrEnableUserController = async (req, res) => {
  const result = await disableOrEnableUserService(req.params.userId);
  return res.status(200).send(result);
};
