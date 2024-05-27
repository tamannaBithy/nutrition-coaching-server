const {
  createUserKetoService,
  createAdminKetoService,
  updateAdminKetoService,
  createUserMacroService,
} = require("../services/KetoCalcServices");

// Controller function to create keto data for a user
exports.createUserKetoController = async (req, res) => {
  const result = await createUserKetoService(req.body);
  return res.status(201).send(result);
};

// Controller function to create macro data for a user
exports.createUserMacroController = async (req, res) => {
  const result = await createUserMacroService(req.body);
  return res.status(201).send(result);
};

// Controller function to create keto data for admin
exports.createAdminKetoController = async (req, res) => {
  const result = await createAdminKetoService(req.body);
  return res.status(201).send(result);
};

// Controller function to update keto data for admin
exports.updateAdminKetoController = async (req, res) => {
  const result = await updateAdminKetoService(req.body);
  return res.status(201).send(result);
};
