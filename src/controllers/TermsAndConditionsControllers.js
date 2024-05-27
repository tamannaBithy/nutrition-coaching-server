const {
  createOrUpdateTermsAndConditionsService,
  getTermsAndConditionsService,
} = require("../services/TermsAndConditionsServices");

exports.createOrUpdateTermsAndConditionsController = async (req, res) => {
  const result = await createOrUpdateTermsAndConditionsService(
    req.body.lang,
    req.body.content
  );
  return res.status(200).send(result);
};

exports.getTermsAndConditionsController = async (req, res) => {
  const result = await getTermsAndConditionsService(req);
  return res.status(200).send(result);
};
