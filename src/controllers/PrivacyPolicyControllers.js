const {
  createOrUpdatePrivacyPolicyService,
  getPrivacyPolicyService,
} = require("../services/PrivacyPolicyServices");

// Controller function to create or update privacy policy (specifically for admin users)
exports.createOrUpdatePrivacyPolicyController = async (req, res) => {
  const result = await createOrUpdatePrivacyPolicyService(req.body);
  return res.status(200).send(result);
};

// Controller function to get privacy policy
exports.getPrivacyPolicyController = async (req, res) => {
  const result = await getPrivacyPolicyService(req);
  return res.status(200).send(result);
};
