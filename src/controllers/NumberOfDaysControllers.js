const {
  createNumberOfDaysService,
  getAllNumberOfDaysService,
  getNumberOfDaysByIdService,
  updateNumberOfDaysService,
  deleteNumberOfDaysService,
  getAllDaysForAdminService,
} = require("../services/NumberOfDaysServices");

// Create a new Number of Days Record
exports.createNumberOfDaysController = async (req, res) => {
  const result = await createNumberOfDaysService(req.user._id, req.body);
  return res.status(201).send(result);
};

// Get all Number of Days Records
exports.getAllNumberOfDaysController = async (req, res) => {
  const result = await getAllNumberOfDaysService();
  return res.status(200).send(result);
};

// Get details of a specific Number of Days Record
exports.getNumberOfDaysByIdController = async (req, res) => {
  const result = await getNumberOfDaysByIdService(req.params.id);
  return res.status(200).send(result);
};

// Update details of a specific Number of Days Record
exports.updateNumberOfDaysController = async (req, res) => {
  const result = await updateNumberOfDaysService(req.params.id, req.body);
  return res.status(200).send(result);
};

// Delete a specific Number of Days Record
exports.deleteNumberOfDaysController = async (req, res) => {
  const result = await deleteNumberOfDaysService(req.params.id);
  return res.status(200).send(result);
};

// Get all Days for Admin
exports.getAllDaysForAdminController = async (req, res) => {
  const result = await getAllDaysForAdminService();
  return res.status(200).send(result);
};
