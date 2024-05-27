const express = require("express");
const {
  loginController,
  socialLoginController,
} = require("../controllers/LoginControllers");
const router = express.Router();

// User login
router.post("/login", loginController);

// User social login
router.post("/socialLogin", socialLoginController);

module.exports = router;
