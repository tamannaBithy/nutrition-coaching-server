const {
  createInstructorService,
  updateInstructorService,
  deleteInstructorService,
  getAllInstructorService,
  getAllInstructorForAdminService,
} = require("../services/InstructorServices");

// Controller function to create an instructor
exports.createInstructorController = async (req, res) => {
  const result = await createInstructorService(req.user._id, req.body, req);
  return res.status(201).send(result);
};

// Controller function to update an instructor
exports.updateInstructorController = async (req, res) => {
  const result = await updateInstructorService(req.params.id, req.body, req);
  return res.status(200).send(result);
};

// Controller function to delete an instructor
exports.deleteInstructorController = async (req, res) => {
  const result = await deleteInstructorService(req.params.id);
  return res.status(200).send(result);
};

// Controller function to get all instructors
exports.getAllInstructorsController = async (req, res) => {
  const result = await getAllInstructorService(req);
  return res.status(200).send(result);
};

// Controller function to get all instructors for admin
exports.getAllInstructorsForAdminController = async (req, res) => {
  const result = await getAllInstructorForAdminService(req);
  return res.status(200).send(result);
};
