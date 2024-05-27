const {
  loginService,
  socialLoginService,
} = require("../services/LoginServices");

// Controller function for user login
exports.loginController = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  // Call loginService to authenticate user
  const result = await loginService(emailOrPhone, password);

  // Check if login was successful
  if (result.status) {
    // Set the access token in the response headers
    res.setHeader("Authorization", result.accessToken);
    return res.status(200).json(result);
  } else {
    // Return error if login failed
    return res.status(401).json(result);
  }
};

// Controller function for social login
exports.socialLoginController = async (req, res) => {
  const { email } = req.body;

  // Call socialLoginService to authenticate user via social login
  const result = await socialLoginService(email);

  // Check if social login was successful
  if (result.status) {
    return res.status(200).json(result);
  } else {
    // Return error if social login failed
    return res.status(401).json(result);
  }
};
