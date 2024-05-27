const express = require("express");
const router = express.Router();
const {
  createFAQController,
  getAllFAQsController,
  updateFAQController,
  deleteFAQController,
} = require("../controllers/FAQControllers");
const {
  validateCreateFAQMiddleware,
  validateUpdateFAQMiddleware,
  validateLangParamMiddleware,
} = require("../middlewares/FAQValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");

// Create a new FAQ
router.post(
  "/faq",
  validateCreateFAQMiddleware,
  validateErrorResult,
  createFAQController
);

// Get all FAQs
router.get("/faq", getAllFAQsController);

// Update an existing FAQ
router.put(
  "/faq/:id",
  validateUpdateFAQMiddleware,
  validateErrorResult,
  updateFAQController
);

// Delete an existing FAQ
router.delete("/faq/:id", deleteFAQController);

module.exports = router;
