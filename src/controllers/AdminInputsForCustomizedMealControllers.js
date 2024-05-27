const {
  createAdminCustomizedMealService,
  updateAdminCustomizedMealService,
  updateMealDurationService,
  getAllUserMealsInputService,
  deleteUserMealInputService,
} = require("../services/AdminInputsForCustomizedMealServices");

// Controller function to create a new customized meal (specifically for admin users)
exports.createAdminCustomizedMealController = async (req, res) => {
  const result = await createAdminCustomizedMealService(req.body);
  return res.status(201).send(result);
};

// Controller function to update an existing customized meal (specifically for admin users)
exports.updateAdminCustomizedMealController = async (req, res) => {
  const result = await updateAdminCustomizedMealService(req.body);
  return res.status(201).send(result);
};

// Controller function to retrieve all user meals input (specifically for admin users)
exports.getAllUserMealsInputController = async (req, res) => {
  const result = await getAllUserMealsInputService(req);
  return res.status(201).send(result);
};

// Controller function to update the duration of a meal (specifically for admin users)
exports.updateMealDurationController = async (req, res) => {
  const io = req.app.get("socketio"); // Access Socket.io instance from Express app

  const result = await updateMealDurationService(req.body, req.params.id, io);
  return res.status(201).send(result);
};

// Controller function to delete a user meal input by ID
exports.deleteUserMealInputController = async (req, res) => {
  const io = req.app.get("socketio"); // Access Socket.io instance from Express app

  const result = await deleteUserMealInputService(req.params.id, io);
  return res.status(201).send(result);
};
