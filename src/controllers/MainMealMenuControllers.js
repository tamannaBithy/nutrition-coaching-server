const {
  createMainMealMenuService,
  getAllMainMealMenusForUsersService,
  getMainMealMenuByIdService,
  updateMainMealMenuService,
  deleteMainMealMenuService,
  getAllMainMealMenusForAdminService,
} = require("../services/MainMealMenuServices");

// Create a new Main Meal Menu
exports.createMainMealMenuController = async (req, res) => {
  const result = await createMainMealMenuService(req.user._id, req.body, req);
  return res.status(201).send(result);
};

// Get all Main Meal Menus for the running week based on user preferences
/* 
  Example Request Body:

    "preference": [
      "6595638a56974bb9ee85ef9f",
      "659563b556974bb9ee85efb0",
      "6595639656974bb9ee85efa4"
    ]

*/
exports.getAllMainMealMenusForUsersController = async (req, res) => {
  const result = await getAllMainMealMenusForUsersService(req);
  return res.status(200).send(result);
};

// Get details of a specific Main Meal Menu by ID
exports.getMainMealMenuByIdController = async (req, res) => {
  const result = await getMainMealMenuByIdService(req.params.id);
  return res.status(200).send(result);
};

// Update details of a specific Main Meal Menu by ID
exports.updateMainMealMenuController = async (req, res) => {
  const result = await updateMainMealMenuService(req.params.id, req.body, req);
  return res.status(200).send(result);
};

// Delete a specific Main Meal Menu by ID
exports.deleteMainMealMenuController = async (req, res) => {
  const result = await deleteMainMealMenuService(req.params.id);
  return res.status(200).send(result);
};

// Get all Previous Main Meal Menus (specifically for admin users)
exports.getAllMainMealMenusForAdminController = async (req, res) => {
  const result = await getAllMainMealMenusForAdminService(req);
  return res.status(200).send(result);
};
