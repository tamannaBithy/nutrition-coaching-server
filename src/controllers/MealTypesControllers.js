const {
  createMealTypesService,
  getAllMealTypesService,
  getMealTypeByIdService,
  updateMealTypeService,
  deleteMealTypeService,
} = require("../services/MealTypeServices");

// Create a new meal type
exports.createMealTypeController = async (req, res) => {
  const result = await createMealTypesService(req.user._id, req.body);
  return res.status(201).send(result);
};

// Get all meal types
exports.getAllMealTypesController = async (req, res) => {
  const result = await getAllMealTypesService(req);
  return res.status(200).send(result);
};

// Get details of a specific meal type
exports.getMealTypeByIdController = async (req, res) => {
  const result = await getMealTypeByIdService(req.params.id);
  return res.status(200).send(result);
};

// Update details of a specific meal type
exports.updateMealTypeController = async (req, res) => {
  const result = await updateMealTypeService(req.params.id, req.body);
  return res.status(200).send(result);
};

// Delete a specific meal type
exports.deleteMealTypeController = async (req, res) => {
  const result = await deleteMealTypeService(req.params.id);
  return res.status(200).send(result);
};
