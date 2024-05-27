const {
  createWeeklyMealMenuService,
  getAllWeeklyMealMenusOfRunningWeekNextWeekAndAfterThatWeekService,
  getWeeklyMealMenuByIdService,
  updateWeeklyMealMenuService,
  deleteWeeklyMealMenuService,
  getRunningWeeklyMealMenusService,
  getUpcomingWeeklyMealMenusService,
  getPreviousWeeklyMealMenusService,
} = require("../services/WeeklyMealMenuServices");

// Create a new Weekly Meal Menu (specifically for admin users)
exports.createWeeklyMealMenuController = async (req, res) => {
  const result = await createWeeklyMealMenuService(req.user._id, req.body, req);
  return res.status(201).send(result);
};

// Get all Weekly Meal Menus
exports.getAllWeeklyMealMenusOfRunningWeekNextWeekAndAfterThatWeekController =
  async (req, res) => {
    const result =
      await getAllWeeklyMealMenusOfRunningWeekNextWeekAndAfterThatWeekService(
        req
      );
    return res.status(200).send(result);
  };

// Get details of a specific Weekly Meal Menu
exports.getWeeklyMealMenuByIdController = async (req, res) => {
  const result = await getWeeklyMealMenuByIdService(req.params.id);
  return res.status(200).send(result);
};

// Delete a specific Weekly Meal Menu (specifically for admin users)
exports.deleteWeeklyMealMenuController = async (req, res) => {
  const result = await deleteWeeklyMealMenuService(req.params.id);
  return res.status(200).send(result);
};

// Get all Previous Weekly Meal Menus (specifically for admin users)
exports.getPreviousWeeklyMealMenusController = async (req, res) => {
  const result = await getPreviousWeeklyMealMenusService(req);
  return res.status(200).send(result);
};

// Get all Running Weekly Meal Menus (specifically for admin users)
exports.getRunningWeeklyMealMenusController = async (req, res) => {
  const result = await getRunningWeeklyMealMenusService(req);
  return res.status(200).send(result);
};

// Get all Upcoming Weekly Meal Menus (specifically for admin users)
exports.getUpcomingWeeklyMealMenusController = async (req, res) => {
  const result = await getUpcomingWeeklyMealMenusService(req);
  return res.status(200).send(result);
};
