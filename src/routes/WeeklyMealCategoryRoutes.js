const express = require("express");
const {
  createWeeklyMealCategoryController,
  getAllWeeklyMealCategoriesController,
  getWeeklyMealCategoryByIdController,
  updateWeeklyMealCategoryController,
  deleteWeeklyMealCategoryController,
} = require("../controllers/WeeklyMealCategoryControllers");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  createWeeklyMealCategoryValidationMiddleware,
  updateWeeklyMealCategoryValidationMiddleware,
  validateMongooseId,
  validateMongooseIdMiddleware,
} = require("../middlewares/WeeklyMealCategoryValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validateLangCodeQueryParams,
} = require("../middlewares/RequestQueriesValidationMiddleware");

const router = express.Router();

/**
 * @swagger
 * /weekly-meal-categories:
 *   post:
 *     tags:
 *       - "Weekly Meal Categories"
 *     summary: "Create a new Weekly Meal Category (admin only)"
 *     description: "This endpoint allows admin users to create a new weekly meal category."
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: "Authorization"
 *         in: "header"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lang:
 *                 type: string
 *                 description: The language code for the category (e.g., "en" for English, "ar" for Arabic).
 *                 enum: ["ar", "en"]
 *                 default: "en"
 *               weekly_meal_category:
 *                 type: string
 *                 description: The type of weekly meal category (e.g., "ready made", "add on", etc.).
 *                 example: "ready made"
 *             required:
 *               - lang
 *               - weekly_meal_category
 *     responses:
 *       '200':
 *         description: Weekly Meal Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: object
 *                   properties:
 *                     en:
 *                       type: string
 *                       example: "Weekly Meal Category created successfully."
 *                     ar:
 *                       type: string
 *                       example: "تم إنشاء فئة الوجبات الأسبوعية بنجاح"
 */
router.post(
  "/weekly-meal-categories",
  authMiddleware,
  isAdminMiddleware,
  createWeeklyMealCategoryValidationMiddleware,
  validateErrorResult,
  createWeeklyMealCategoryController
);

/**
 * @swagger
 * /weekly-meal-categories:
 *   get:
 *     tags:
 *       - "Weekly Meal Categories"
 *     summary: "Get a list of all Weekly Meal Categories (admin only)"
 *     description: "This endpoint retrieves a list of all weekly meal categories."
 *     parameters:
 *       - in: "header"
 *         name: "Authorization"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - in: query
 *         name: langCode
 *         schema:
 *           type: string
 *           enum: ["ar", "en"]
 *         required: true
 *         description: "The language code for the categories (e.g., 'en' for English, 'ar' for Arabic). If not provided, defaults to 'en'."
 *         example: "en"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved the list of Weekly Meal Categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful or not.
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: List of Weekly Meal Categories
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the Weekly Meal Category.
 *                         example: "615a92e79b40fd5bafdc254c"
 *                       created_by:
 *                         type: string
 *                         description: The ID of the user who created the category.
 *                         example: "615a92e79b40fd5bafdc254d"
 *                       weekly_meal_category:
 *                         type: string
 *                         description: The formatted name of the Weekly Meal Category.
 *                         example: "Ready Made"
 */
router.get(
  "/weekly-meal-categories",
  authMiddleware,
  isAdminMiddleware,
  validateLangCodeQueryParams,
  validateErrorResult,
  getAllWeeklyMealCategoriesController
);

/**
 * @swagger
 * /weekly-meal-categories/{id}:
 *   get:
 *     tags:
 *       - "Weekly Meal Categories"
 *     summary: "Get details of a specific Weekly Meal Category by ID (admin only)"
 *     description: "This endpoint retrieves details of a specific weekly meal category by its ID."
 *     parameters:
 *       - in: "header"
 *         name: "Authorization"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the Weekly Meal Category to retrieve"
 *         schema:
 *           type: string
 *           example: "615a92e79b40fd5bafdc254c"
 *       - in: query
 *         name: langCode
 *         schema:
 *           type: string
 *           enum: ["ar", "en"]
 *         required: true
 *         description: "The language code for the category (e.g., 'en' for English, 'ar' for Arabic). If not provided, defaults to 'en'."
 *         example: "en"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved the details of the Weekly Meal Category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful or not.
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Details of the Weekly Meal Category
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the Weekly Meal Category.
 *                       example: "615a92e79b40fd5bafdc254c"
 *                     created_by:
 *                       type: string
 *                       description: The ID of the user who created the category.
 *                       example: "615a92e79b40fd5bafdc254d"
 *                     weekly_meal_category:
 *                       type: string
 *                       description: The formatted name of the Weekly Meal Category.
 *                       example: "Ready Made"
 */
router.get(
  "/weekly-meal-categories/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  getWeeklyMealCategoryByIdController
);

/**
 * @swagger
 * /weekly-meal-categories/{id}:
 *   put:
 *     tags:
 *       - "Weekly Meal Categories"
 *     summary: "Update details of a specific Weekly Meal Category by ID (admin only)"
 *     description: "This endpoint updates details of a specific weekly meal category by its ID. Only accessible for admin users."
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: "header"
 *         name: "Authorization"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the Weekly Meal Category to update"
 *         schema:
 *           type: string
 *           example: "615a92e79b40fd5bafdc254c"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               lang:
 *                 type: string
 *                 description: The language code for the category (e.g., "en" for English, "ar" for Arabic).
 *                 enum: ["ar", "en"]
 *                 default: "en"
 *               weekly_meal_category:
 *                 type: string
 *                 description: The type of weekly meal category (e.g., "ready made", "add on", etc.).
 *                 example: "ready made"
 *             required:
 *               - lang
 *               - weekly_meal_category
 *     responses:
 *       '200':
 *         description: Successfully updated the details of the Weekly Meal Category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful or not.
 *                   example: true
 *                 message:
 *                   type: object
 *                   properties:
 *                     en:
 *                       type: string
 *                       example: "Weekly Meal Category updated successfully"
 *                     ar:
 *                       type: string
 *                       example: "تم تحديث فئة الوجبات الأسبوعية بنجاح"
 */
router.put(
  "/weekly-meal-categories/:id",
  authMiddleware,
  isAdminMiddleware,
  updateWeeklyMealCategoryValidationMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  updateWeeklyMealCategoryController
);

/**
 * @swagger
 * /weekly-meal-categories/{id}:
 *   delete:
 *     tags:
 *       - "Weekly Meal Categories"
 *     summary: "Delete a specific Weekly Meal Category by ID (admin only)"
 *     description: "This endpoint deletes a specific weekly meal category by its ID. Only accessible for admin users."
 *     parameters:
 *       - in: "header"
 *         name: "Authorization"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the Weekly Meal Category to delete"
 *         schema:
 *           type: string
 *           example: "615a92e79b40fd5bafdc254c"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully deleted the Weekly Meal Category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful or not.
 *                   example: true
 *                 message:
 *                   type: object
 *                   properties:
 *                     en:
 *                       type: string
 *                       example: "Weekly Meal Category deleted successfully."
 *                     ar:
 *                       type: string
 *                       example: "تم حذف فئة الوجبات الأسبوعية بنجاح"
 */
router.delete(
  "/weekly-meal-categories/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  deleteWeeklyMealCategoryController
);

module.exports = router;
