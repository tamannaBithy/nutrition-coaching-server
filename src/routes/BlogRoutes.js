const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  createBlogController,
  updateBlogController,
  deleteBlogController,
  getAllBlogsController,
  getSingleBlogsController,
  getAllBlogsForAdminController,
} = require("../controllers/BlogControllers");
const {
  createBlogValidationMiddleware,
  validateMongooseIdMiddleware,
  updateBlogValidationMiddleware,
} = require("../middlewares/BlogValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validatePaginationQueryParamsForAllBlogs,
} = require("../middlewares/RequestQueriesValidationMiddleware");

const router = express.Router();

// Create a blog (specifically for admin users)
router.post(
  "/create-blog",
  authMiddleware,
  isAdminMiddleware,
  createBlogValidationMiddleware,
  validateErrorResult,
  createBlogController
);

// Update a blog by ID (specifically for admin users)
router.put(
  "/update-blog/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  updateBlogValidationMiddleware,
  validateErrorResult,
  updateBlogController
);

// Delete a blog by ID (specifically for admin users)
router.delete(
  "/delete-blog/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  deleteBlogController
);

// Get all blogs (for all users)
router.get(
  "/get-blogs",
  validatePaginationQueryParamsForAllBlogs,
  validateErrorResult,
  getAllBlogsController
);

// Get all blogs (specifically for admin users)
router.get(
  "/get-blogs-admin",
  authMiddleware,
  isAdminMiddleware,
  validatePaginationQueryParamsForAllBlogs,
  validateErrorResult,
  getAllBlogsForAdminController
);

// Get a single blog by ID (for all users)
router.get(
  "/get-blog/:id",
  validateMongooseIdMiddleware,
  validateErrorResult,
  getSingleBlogsController
);

module.exports = router;
