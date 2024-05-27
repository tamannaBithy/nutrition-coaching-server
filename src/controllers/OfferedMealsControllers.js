const {
  getAllOfferedMealsService,
  getAllOfferedMealsDashboardService,
  getOfferedMealsByIdService,
  createOfferedMealPackageService,
  createOfferedMealForPackageService,
  getPackagesListService,
  deleteOfferedMealPackageService,
} = require("../services/OfferedMealServices");

// Create a new offered meal package
exports.createOfferedMealController = async (req, res) => {
  const result = await createOfferedMealPackageService(
    req.user._id,
    req.body,
    req
  );
  return res.status(201).send(result);
};

// Create a new offered meal for a package
exports.createOfferedMealForPackageController = async (req, res) => {
  const result = await createOfferedMealForPackageService(
    req.user._id,
    req.body,
    req
  );
  return res.status(201).send(result);
};

// Get all offered packages name
exports.getPackagesListController = async (req, res) => {
  const result = await getPackagesListService();
  return res.status(201).send(result);
};

// Get all offered meals
exports.getAllOfferedMealsController = async (req, res) => {
  const result = await getAllOfferedMealsService(req);
  return res.status(200).send(result);
};

// Get all offered meals for admin dashboard
exports.getAllOfferedMealsDashboardController = async (req, res) => {
  const result = await getAllOfferedMealsDashboardService(req);
  return res.status(200).send(result);
};

// Get details of a specific offered meal
exports.getOfferedMealsByIdController = async (req, res) => {
  const result = await getOfferedMealsByIdService(req.params.mealId);
  return res.status(200).send(result);
};

// Delete a specific offered meal
exports.deleteOfferedMealController = async (req, res) => {
  const result = await deleteOfferedMealPackageService(req.params.mealId);
  return res.status(200).send(result);
};
