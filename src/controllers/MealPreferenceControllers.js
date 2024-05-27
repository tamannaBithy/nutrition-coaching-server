const {
  createMealPreferenceService,
  getAllMealPreferencesService,
  getMealPreferenceByIdService,
  updateMealPreferenceService,
  deleteMealPreferenceService,
  getAllMealPreferencesForAdminService,
} = require("../services/MealPreferenceServices");

// Create a new meal preference
exports.createMealPreferenceController = async (req, res) => {
  const result = await createMealPreferenceService(req.user._id, req.body, req);
  return res.status(201).send(result);
};

// Get all meal preferences
exports.getAllMealPreferencesController = async (req, res) => {
  const result = await getAllMealPreferencesService(req);
  return res.status(200).send(result);
};

// Get details of a specific meal preference
exports.getMealPreferenceByIdController = async (req, res) => {
  const result = await getMealPreferenceByIdService(req.params.id);
  return res.status(200).send(result);
};

// Update details of a specific meal preference
exports.updateMealPreferenceController = async (req, res) => {
  const result = await updateMealPreferenceService(
    req.params.id,
    req.body,
    req
  );
  return res.status(200).send(result);
};

// Delete a specific meal preference
exports.deleteMealPreferenceController = async (req, res) => {
  const result = await deleteMealPreferenceService(req.params.id);
  return res.status(200).send(result);
};

// Get all meal preferences for admin users
exports.getAllMealPreferencesForAdminController = async (req, res) => {
  const result = await getAllMealPreferencesForAdminService(req);
  return res.status(200).send(result);
};
