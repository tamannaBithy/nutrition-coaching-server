const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  createBannerController,
  updateBannerController,
  deleteBannerController,
  getAllBannersController,
  getVisibleBannersController,
} = require("../controllers/BannerControllers");
const {
  createBannerValidationMiddleware,
  validateMongooseIdMiddleware,
  updateBannerValidationMiddleware,
} = require("../middlewares/BannerValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validateLangCodeQueryParams,
} = require("../middlewares/RequestQueriesValidationMiddleware");

const router = express.Router();

// Create a new banner
router.post(
  "/create-banner",
  authMiddleware,
  isAdminMiddleware,
  createBannerValidationMiddleware,
  validateErrorResult,
  createBannerController
);

// Update a banner by ID
router.put(
  "/update-banner/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  updateBannerValidationMiddleware,
  validateErrorResult,
  updateBannerController
);

// Delete a banner by ID
router.delete(
  "/delete-banner/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  deleteBannerController
);

// Get all banners
router.get(
  "/get-allBanners",
  authMiddleware,
  isAdminMiddleware,
  validateLangCodeQueryParams,
  validateErrorResult,
  getAllBannersController
);

// Get visible banner
router.get(
  "/get-visibleBanner",
  validateLangCodeQueryParams,
  validateErrorResult,
  getVisibleBannersController
);

module.exports = router;
