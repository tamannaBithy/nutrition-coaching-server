const {
  createFAQService,
  getAllFAQsService,
  updateFAQService,
  deleteFAQService,
} = require("../services/FAQServices");

/**
 * Controller function to create a new FAQ.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object.
 */
exports.createFAQController = async (req, res) => {
  const { lang, title, description } = req.body;
  const result = await createFAQService(lang, title, description);
  return res.status(200).send(result);
};

/**
 * Controller function to get all FAQs.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object.
 */
exports.getAllFAQsController = async (req, res) => {
  const result = await getAllFAQsService(req);
  return res.status(200).send(result);
};

/**
 * Controller function to update an existing FAQ.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object.
 */
exports.updateFAQController = async (req, res) => {
  const { id } = req.params;
  const { lang, title, description } = req.body;
  const result = await updateFAQService(id, lang, title, description);
  return res.status(200).send(result);
};

/**
 * Controller function to delete an existing FAQ.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object.
 */
exports.deleteFAQController = async (req, res) => {
  const { id } = req.params;
  const result = await deleteFAQService(id);
  return res.status(200).send(result);
};
