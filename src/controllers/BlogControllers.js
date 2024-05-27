const {
  createBlogService,
  updateBlogService,
  deleteBlogService,
  getAllBlogService,
  getSingleBlogService,
  getAllBlogsForAdminService,
} = require("../services/BlogServices");

// Create a blog (specifically for admin users)
exports.createBlogController = async (req, res) => {
  const result = await createBlogService(req.user._id, req.body, req);
  return res.status(201).send(result);
};

// Update a blog by ID (specifically for admin users)
exports.updateBlogController = async (req, res) => {
  const result = await updateBlogService(req.params.id, req.body, req);
  return res.status(200).send(result);
};

// Delete a blog by ID (specifically for admin users)
exports.deleteBlogController = async (req, res) => {
  const result = await deleteBlogService(req.params.id);
  return res.status(200).send(result);
};

// Get all blogs (for all users)
exports.getAllBlogsController = async (req, res) => {
  const result = await getAllBlogService(req);
  return res.status(200).send(result);
};

// Get a single blog by ID (for all users)
exports.getSingleBlogsController = async (req, res) => {
  const result = await getSingleBlogService(req.params.id);
  return res.status(200).send(result);
};

// Get all blogs (specifically for admin users)
exports.getAllBlogsForAdminController = async (req, res) => {
  const result = await getAllBlogsForAdminService(req);
  return res.status(200).send(result);
};
