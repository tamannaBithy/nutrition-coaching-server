const {
  createMealsPerDayService,
  getAllMealsPerDayService,
  getMealsPerDayByIdService,
  updateMealsPerDayService,
  deleteMealsPerDayService,
  getAllMealsPerDayForAdminService,
} = require("../services/MealsPerDayServices");

// Create a new Meal Per Day
exports.createMealPerDayController = async (req, res) => {
  const result = await createMealsPerDayService(req.user._id, req.body);
  return res.status(201).send(result);
};

// Get all Meals Per Day
exports.getAllMealPerDayController = async (req, res) => {
  const result = await getAllMealsPerDayService();
  return res.status(200).send(result);
};

// Get details of a specific Meal Per Day by ID
exports.getMealPerDayByIdController = async (req, res) => {
  const result = await getMealsPerDayByIdService(req.params.id);
  return res.status(200).send(result);
};

// Update details of a specific Meal Per Day by ID
exports.updateMealPerDayController = async (req, res) => {
  const result = await updateMealsPerDayService(req.params.id, req.body);
  return res.status(200).send(result);
};

// Get all Meals Per Day for Admin
exports.getAllMealsPerDayForAdminController = async (req, res) => {
  const result = await getAllMealsPerDayForAdminService();
  return res.status(200).send(result);
};

// Delete a specific Meal Per Day by ID
exports.deleteMealPerDayController = async (req, res) => {
  const result = await deleteMealsPerDayService(req.params.id);
  return res.status(200).send(result);
};
