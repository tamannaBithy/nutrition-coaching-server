const {
  customizedMealService,
  deleteCustomizedMealService,
  getAllCustomizedMealService,
  getSingleCustomizedMealService,
  getAdminCustomizedMealService,
  updateCustomizedMealService,
} = require("../services/CustomizedMealServices");

// Controller function to create a customized meal
exports.customizedMealController = async (req, res) => {
  const result = await customizedMealService(req.body, req);
  return res.status(201).send(result);
};

// Controller function to delete a customized meal
exports.deleteCustomizedMealController = async (req, res) => {
  const result = await deleteCustomizedMealService(req.params.id);
  return res.status(201).send(result);
};

// Controller function to get all customized meals
exports.getAllCustomizedMealController = async (req, res) => {
  const result = await getAllCustomizedMealService(req);
  return res.status(201).send(result);
};

// Controller function to get a single customized meal
exports.getSingleCustomizedMealController = async (req, res) => {
  const result = await getSingleCustomizedMealService(req.params.id);
  return res.status(201).send(result);
};

// Controller function to get admin-specific customized meals
exports.getAdminCustomizedMealController = async (req, res) => {
  const result = await getAdminCustomizedMealService(req);
  return res.status(201).send(result);
};

// Controller function to update a customized meal
exports.updateCustomizedMealController = async (req, res) => {
  const result = await updateCustomizedMealService(req.body, req.params.id);
  return res.status(201).send(result);
};
