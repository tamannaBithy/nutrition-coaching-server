const {
  createUserCustomizedMealService,
  getUserCustomizedMealService,
} = require("../services/UserInputsForCustomizedMealServices");

// Controller function for creating user customized meals
exports.createUserCustomizedMealController = async (req, res) => {
  const io = req.app.get("socketio"); // Access Socket.io instance from Express app

  // Call createUserCustomizedMealService to create user customized meals
  const result = await createUserCustomizedMealService(
    req.body,
    req.user._id,
    io
  );

  // Respond with the result
  return res.status(201).send(result);
};

exports.getUserCustomizedMealController = async (req, res) => {
  // Call createUserCustomizedMealService to create user customized meals
  const result = await getUserCustomizedMealService(req.user._id);

  // Respond with the result
  return res.status(201).send(result);
};
