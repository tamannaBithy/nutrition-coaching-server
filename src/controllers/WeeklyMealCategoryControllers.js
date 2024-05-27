const {
  createWeeklyMealCategoryService,
  getAllWeeklyMealCategoriesService,
  getWeeklyMealCategoryByIdService,
  updateWeeklyMealCategoryService,
  deleteWeeklyMealCategoryService,
} = require("../services/WeeklyMealCategoriesServices");

// Create a new Weekly Meal Category
exports.createWeeklyMealCategoryController = async (req, res) => {
  const result = await createWeeklyMealCategoryService(req.user._id, req.body);
  return res.status(201).send(result);
};

// Get all Weekly Meal Categories
exports.getAllWeeklyMealCategoriesController = async (req, res) => {
  const result = await getAllWeeklyMealCategoriesService(req);
  return res.status(200).send(result);
};

// Get details of a specific Weekly Meal Category
exports.getWeeklyMealCategoryByIdController = async (req, res) => {
  const result = await getWeeklyMealCategoryByIdService(req.params.id);
  return res.status(200).send(result);
};

// Update details of a specific Weekly Meal Category
exports.updateWeeklyMealCategoryController = async (req, res) => {
  const result = await updateWeeklyMealCategoryService(req.params.id, req.body);
  return res.status(200).send(result);
};

// Delete a specific Weekly Meal Category
exports.deleteWeeklyMealCategoryController = async (req, res) => {
  const result = await deleteWeeklyMealCategoryService(req.params.id);
  return res.status(200).send(result);
};
