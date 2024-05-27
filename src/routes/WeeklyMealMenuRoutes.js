const express = require("express");
const {
  createWeeklyMealMenuController,
  getAllWeeklyMealMenusOfRunningWeekNextWeekAndAfterThatWeekController,
  getWeeklyMealMenuByIdController,
  deleteWeeklyMealMenuController,
  getPreviousWeeklyMealMenusController,
  getUpcomingWeeklyMealMenusController,
  getRunningWeeklyMealMenusController,
} = require("../controllers/WeeklyMealMenuControllers");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  createWeeklyMealMenuValidateMiddleware,
  validateMongooseIdMiddleware,
} = require("../middlewares/WeeklyMealMenuValidationMiddleware");
const {
  validateErrorResult,
} = require("../middlewares/DataValidationResultMiddleware");
const {
  validatePaginationQueryParamsForWeeklyMeals,
  validateDateForPreviousWeeklyMeals,
  validateDateUpcomingWeeklyMeals,
} = require("../middlewares/RequestQueriesValidationMiddleware");

const router = express.Router();

/**
 * @swagger
 * /weekly-meal-menus:
 *   post:
 *     tags:
 *       - "Weekly Meal Menus"
 *     summary: "Create a Weekly Meal Menu (admin only)"
 *     description: "This endpoint allows admin users to create a new weekly meal menu."
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: "Authorization"
 *         in: "header"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - name: "lang"
 *         in: "formData"
 *         description: "Language code"
 *         required: true
 *         type: "string"
 *       - name: "category"
 *         in: "formData"
 *         description: "Category of the meal (mongoose.Schema.Types.ObjectId)"
 *         required: true
 *         type: "string"
 *       - name: "image"
 *         in: "formData"
 *         description: "Image of the meal"
 *         required: false
 *         type: "file"
 *       - name: "meal_name"
 *         in: "formData"
 *         description: "Name of the meal"
 *         required: true
 *         type: "string"
 *       - name: "main_badge_tag"
 *         in: "formData"
 *         description: "Meal badge tag"
 *         required: false
 *         type: "string"
 *       - name: "tags"
 *         in: "formData"
 *         description: "Tags associated with the meal"
 *         required: true
 *         type: "array"
 *         items:
 *           type: "string"
 *       - name: "protein"
 *         in: "formData"
 *         description: "Protein content of the meal (in grams)"
 *         required: true
 *         type: "number"
 *       - name: "fat"
 *         in: "formData"
 *         description: "Fat content of the meal (in grams)"
 *         required: true
 *         type: "number"
 *       - name: "carbs"
 *         in: "formData"
 *         description: "Carbohydrate content of the meal (in grams)"
 *         required: true
 *         type: "number"
 *       - name: "nutrition_facts"
 *         in: "formData"
 *         description: "Nutrition facts of the meal"
 *         required: true
 *         type: "string"
 *       - name: "ingredients"
 *         in: "formData"
 *         description: "Ingredients of the meal"
 *         required: true
 *         type: "string"
 *       - name: "heating_instruction"
 *         in: "formData"
 *         description: "Heating instructions for the meal"
 *         required: true
 *         type: "string"
 *       - name: "available_from"
 *         in: "formData"
 *         description: "Date when the meal is available"
 *         required: true
 *         type: "string"
 *         format: "date"
 *       - name: "unavailable_from"
 *         in: "formData"
 *         description: "Date when the meal is unavailable"
 *         required: true
 *         type: "string"
 *         format: "date"
 *       - name: "visible"
 *         in: "formData"
 *         description: "Visible to user or not"
 *         required: true
 *         type: "boolean"
 *     responses:
 *       200:
 *         description: "Weekly meal menu created successfully."
 *         schema:
 *           type: "object"
 *           properties:
 *             status:
 *               type: "boolean"
 *               example: true
 *             message:
 *                   type: "object"
 *                   properties:
 *                     en:
 *                       type: "string"
 *                       example: "Weekly Meal Menu created successfully."
 *                     ar:
 *                       type: "string"
 *                       example: "تم إنشاء قائمة الوجبات الأسبوعية بنجاح"
 */
router.post(
  "/weekly-meal-menus",
  authMiddleware,
  isAdminMiddleware,
  createWeeklyMealMenuValidateMiddleware,
  validateErrorResult,
  createWeeklyMealMenuController
);

/**
 * @swagger
 * /weekly-meal-menus:
 *   get:
 *     tags:
 *       - "Weekly Meal Menus"
 *     summary: "Get Weekly Meal Menus for the running week, next week, and the week after that"
 *     description: "This endpoint retrieves Weekly Meal Menus for the running week, next week, and the week after that."
 *     parameters:
 *       - name: "langCode"
 *         in: "query"
 *         description: "Language code (e.g., 'en' for English, 'ar' for Arabic)"
 *         required: true
 *         type: "string"
 *         example: "en"
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: "Weekly Meal Menus fetched successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 status:
 *                   type: "boolean"
 *                   example: true
 *                 data:
 *                   type: "array"
 *                   items:
 *                     type: "object"
 *                     properties:
 *                       week:
 *                         type: "string"
 *                         example: "Mar 5-11"
 *                       meals_with_category:
 *                         type: "array"
 *                         items:
 *                           type: "object"
 *                           properties:
 *                             weekly_meal_category:
 *                               type: "string"
 *                               example: "BREAKFAST"
 *                             meals:
 *                               type: "array"
 *                               items:
 *                                 type: "object"
 *                                 properties:
 *                                   _id:
 *                                     type: "string"
 *                                     example: "6039ac26b27bea672e30a1c5"
 *                                   image:
 *                                     type: "string"
 *                                     example: "/uploads/weeklyMealMenus/6039ac26b27bea672e30a1c5/omelette.jpg"
 *                                   meal_name:
 *                                     type: "string"
 *                                     example: "Omelette"
 *                                   main_badge_tag:
 *                                     type: "string"
 *                                     example: "VEGAN"
 *                                   tags:
 *                                     type: "array"
 *                                     items:
 *                                       type: "string"
 *                                       example: ["breakfast", "healthy", "quick"]
 *                                   protein:
 *                                     type: "number"
 *                                     example: 15
 *                                   fat:
 *                                     type: "number"
 *                                     example: 10
 *                                   carbs:
 *                                     type: "number"
 *                                     example: 5
 *                                   calories:
 *                                     type: "number"
 *                                     example: 200
 *                                   nutrition_facts:
 *                                     type: "string"
 *                                     example: "/uploads/weeklyMealMenus/6039ac26b27bea672e30a1c5/nutrition.jpg"
 *                                   ingredients:
 *                                     type: "string"
 *                                     example: "Eggs, spinach, tomatoes"
 *                                   heating_instruction:
 *                                     type: "string"
 *                                     example: "Heat in a skillet until cooked through"
 *                                   available_from:
 *                                     type: "string"
 *                                     format: "date"
 *                                     example: "2024-03-05"
 *                                   unavailable_from:
 *                                     type: "string"
 *                                     format: "date"
 *                                     example: "2024-03-11"
 */
router.get(
  "/weekly-meal-menus",
  getAllWeeklyMealMenusOfRunningWeekNextWeekAndAfterThatWeekController
);

/**
 * @swagger
 * /weekly-meal-menus/previous:
 *   get:
 *     tags:
 *       - "Weekly Meal Menus"
 *     summary: "Get Previous Weekly Meal Menus (admin only)"
 *     description: "This endpoint retrieves previous Weekly Meal Menus for admin users."
 *     parameters:
 *       - name: "Authorization"
 *         in: "header"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - name: "langCode"
 *         in: "query"
 *         description: "Language code (e.g., 'en' for English, 'ar' for Arabic)"
 *         required: true
 *         type: "string"
 *         example: "en"
 *       - name: "showPerPage"
 *         in: "query"
 *         description: "Number of items to show per page"
 *         required: true
 *         type: "integer"
 *         example: 10
 *       - name: "pageNo"
 *         in: "query"
 *         description: "Page number"
 *         required: true
 *         type: "integer"
 *         example: 1
 *       - name: "searchKeyword"
 *         in: "query"
 *         description: "Keyword to search for in meal names"
 *         required: false
 *         type: "string"
 *         example: "omelette"
 *       - name: "unavailable_from_start"
 *         in: "query"
 *         description: "Start date for unavailable_from filter"
 *         required: true
 *         type: "string"
 *         format: "date"
 *         example: "2023-10-01"
 *       - name: "unavailable_from_end"
 *         in: "query"
 *         description: "End date for unavailable_from filter"
 *         required: true
 *         type: "string"
 *         format: "date"
 *         example: "2023-10-07"
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: "Previous Weekly Meal Menus fetched successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 status:
 *                   type: "boolean"
 *                   example: true
 *                 data:
 *                   type: "array"
 *                   items:
 *                     type: "object"
 *                     properties:
 *                       _id:
 *                         type: "string"
 *                         example: "6039ac26b27bea672e30a1c5"
 *                       image:
 *                         type: "string"
 *                         example: "/uploads/weeklyMealMenus/6039ac26b27bea672e30a1c5/omelette.jpg"
 *                       meal_name:
 *                         type: "string"
 *                         example: "Omelette"
 *                       main_badge_tag:
 *                         type: "string"
 *                         example: "VEGAN"
 *                       category:
 *                         type: "string"
 *                         example: "BREAKFAST"
 *                       tags:
 *                         type: "array"
 *                         items:
 *                           type: "string"
 *                           example: ["breakfast", "healthy", "quick"]
 *                       protein:
 *                         type: "number"
 *                         example: 15
 *                       fat:
 *                         type: "number"
 *                         example: 10
 *                       carbs:
 *                         type: "number"
 *                         example: 5
 *                       calories:
 *                         type: "number"
 *                         example: 200
 *                       nutrition_facts:
 *                         type: "string"
 *                         example: "/uploads/weeklyMealMenus/6039ac26b27bea672e30a1c5/nutrition.jpg"
 *                       ingredients:
 *                         type: "string"
 *                         example: "Eggs, spinach, tomatoes"
 *                       heating_instruction:
 *                         type: "string"
 *                         example: "Heat in a skillet until cooked through"
 *                       available_from:
 *                         type: "string"
 *                         format: "date"
 *                         example: "2023-09-30"
 *                       unavailable_from:
 *                         type: "string"
 *                         format: "date"
 *                         example: "2023-10-06"
 *                 totalDataCount:
 *                   type: "integer"
 *                   example: 15
 *                 totalPages:
 *                   type: "array"
 *                   items:
 *                     type: "integer"
 *                     example: [1, 2, 3]
 *                 currentPage:
 *                   type: "integer"
 *                   example: 1
 *                 showingEnglish:
 *                   type: "string"
 *                   example: "Showing 1 - 10 out of 15 items"
 *                 showingArabic:
 *                   type: "string"
 *                   example: "عرض 1 - 10 من أصل 15 من العناصر"
 */
router.get(
  "/weekly-meal-menus/previous",
  validatePaginationQueryParamsForWeeklyMeals,
  validateDateForPreviousWeeklyMeals,
  validateErrorResult,
  getPreviousWeeklyMealMenusController
);

/**
 * @swagger
 * /weekly-meal-menus/running:
 *   get:
 *     tags:
 *       - "Weekly Meal Menus"
 *     summary: "Get Weekly Meal Menus for the Running Week (admin only)"
 *     description: "This endpoint retrieves Weekly Meal Menus for the running week with preference and type_of_meal data."
 *     parameters:
 *       - name: "Authorization"
 *         in: "header"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - name: "langCode"
 *         in: "query"
 *         description: "Language code (e.g., 'en' for English, 'ar' for Arabic)"
 *         required: true
 *         type: "string"
 *         example: "en"
 *       - name: "showPerPage"
 *         in: "query"
 *         description: "Number of items to show per page"
 *         required: true
 *         type: "integer"
 *         example: 10
 *       - name: "pageNo"
 *         in: "query"
 *         description: "Page number"
 *         required: true
 *         type: "integer"
 *         example: 1
 *       - name: "searchKeyword"
 *         in: "query"
 *         description: "Keyword to search for in meal names"
 *         required: false
 *         type: "string"
 *         example: "omelette"
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: "Weekly Meal Menus for the running week fetched successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 status:
 *                   type: "boolean"
 *                   example: true
 *                 data:
 *                   type: "array"
 *                   items:
 *                     type: "object"
 *                     properties:
 *                       _id:
 *                         type: "string"
 *                         example: "6039ac26b27bea672e30a1c5"
 *                       image:
 *                         type: "string"
 *                         example: "/uploads/weeklyMealMenus/6039ac26b27bea672e30a1c5/omelette.jpg"
 *                       meal_name:
 *                         type: "string"
 *                         example: "Omelette"
 *                       main_badge_tag:
 *                         type: "string"
 *                         example: "VEGAN"
 *                       category:
 *                         type: "string"
 *                         example: "BREAKFAST"
 *                       tags:
 *                         type: "array"
 *                         items:
 *                           type: "string"
 *                           example: ["breakfast", "healthy", "quick"]
 *                       protein:
 *                         type: "number"
 *                         example: 15
 *                       fat:
 *                         type: "number"
 *                         example: 10
 *                       carbs:
 *                         type: "number"
 *                         example: 5
 *                       calories:
 *                         type: "number"
 *                         example: 200
 *                       nutrition_facts:
 *                         type: "string"
 *                         example: "/uploads/weeklyMealMenus/6039ac26b27bea672e30a1c5/nutrition.jpg"
 *                       ingredients:
 *                         type: "string"
 *                         example: "Eggs, spinach, tomatoes"
 *                       heating_instruction:
 *                         type: "string"
 *                         example: "Heat in a skillet until cooked through"
 *                       available_from:
 *                         type: "string"
 *                         format: "date"
 *                         example: "2023-09-30"
 *                       unavailable_from:
 *                         type: "string"
 *                         format: "date"
 *                         example: "2023-10-06"
 *                 totalDataCount:
 *                   type: "integer"
 *                   example: 15
 *                 totalPages:
 *                   type: "array"
 *                   items:
 *                     type: "integer"
 *                     example: [1, 2, 3]
 *                 currentPage:
 *                   type: "integer"
 *                   example: 1
 *                 showingEnglish:
 *                   type: "string"
 *                   example: "Showing 1 - 10 out of 15 items"
 *                 showingArabic:
 *                   type: "string"
 *                   example: "عرض 1 - 10 من أصل 15 من العناصر"
 */
router.get(
  "/weekly-meal-menus/running",
  validatePaginationQueryParamsForWeeklyMeals,
  validateErrorResult,
  getRunningWeeklyMealMenusController
);

/**
 * @swagger
 * /weekly-meal-menus/upcoming:
 *   get:
 *     tags:
 *       - "Weekly Meal Menus"
 *     summary: "Get Upcoming Weekly Meal Menus (admin only)"
 *     description: "This endpoint retrieves upcoming Weekly Meal Menus with pagination."
 *     parameters:
 *       - name: "Authorization"
 *         in: "header"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - name: "langCode"
 *         in: "query"
 *         description: "Language code (e.g., 'en' for English, 'ar' for Arabic)"
 *         required: true
 *         type: "string"
 *         example: "en"
 *       - name: "showPerPage"
 *         in: "query"
 *         description: "Number of items to show per page"
 *         required: true
 *         type: "integer"
 *         example: 10
 *       - name: "pageNo"
 *         in: "query"
 *         description: "Page number"
 *         required: true
 *         type: "integer"
 *         example: 1
 *       - name: "searchKeyword"
 *         in: "query"
 *         description: "Keyword to search for in meal names"
 *         required: false
 *         type: "string"
 *         example: "pizza"
 *       - name: "available_from"
 *         in: "query"
 *         description: "Date from which the meal is available (format: YYYY-MM-DD)"
 *         required: true
 *         type: "string"
 *         example: "2024-03-10"
 *       - name: "unavailable_from"
 *         in: "query"
 *         description: "Date from which the meal is unavailable (format: YYYY-MM-DD)"
 *         required: true
 *         type: "string"
 *         example: "2024-03-15"
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: "Upcoming Weekly Meal Menus fetched successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 status:
 *                   type: "boolean"
 *                   example: true
 *                 data:
 *                   type: "array"
 *                   items:
 *                     type: "object"
 *                     properties:
 *                       _id:
 *                         type: "string"
 *                         example: "6039ac26b27bea672e30a1c5"
 *                       image:
 *                         type: "string"
 *                         example: "/uploads/weeklyMealMenus/6039ac26b27bea672e30a1c5/pizza.jpg"
 *                       meal_name:
 *                         type: "string"
 *                         example: "Pizza"
 *                       main_badge_tag:
 *                         type: "string"
 *                         example: "VEGAN"
 *                       category:
 *                         type: "string"
 *                         example: "MAIN"
 *                       tags:
 *                         type: "array"
 *                         items:
 *                           type: "string"
 *                           example: ["main", "vegetarian", "cheese"]
 *                       protein:
 *                         type: "number"
 *                         example: 12
 *                       fat:
 *                         type: "number"
 *                         example: 8
 *                       carbs:
 *                         type: "number"
 *                         example: 20
 *                       calories:
 *                         type: "number"
 *                         example: 300
 *                       nutrition_facts:
 *                         type: "string"
 *                         example: "/uploads/weeklyMealMenus/6039ac26b27bea672e30a1c5/nutrition.jpg"
 *                       ingredients:
 *                         type: "string"
 *                         example: "Dough, tomato sauce, cheese"
 *                       heating_instruction:
 *                         type: "string"
 *                         example: "Preheat oven to 400°F and bake for 15 minutes."
 *                       available_from:
 *                         type: "string"
 *                         format: "date"
 *                         example: "2024-03-10"
 *                       unavailable_from:
 *                         type: "string"
 *                         format: "date"
 *                         example: "2024-03-15"
 *                 totalDataCount:
 *                   type: "integer"
 *                   example: 5
 *                 totalPages:
 *                   type: "array"
 *                   items:
 *                     type: "integer"
 *                     example: [1]
 *                 showingEnglish:
 *                   type: "string"
 *                   example: "Showing 1 - 5 out of 5 items"
 *                 showingArabic:
 *                   type: "string"
 *                   example: "عرض 1 - 5 من أصل 5 من العناصر"
 *                 currentPage:
 *                   type: "integer"
 *                   example: 1
 */
router.get(
  "/weekly-meal-menus/upcoming",
  authMiddleware,
  isAdminMiddleware,
  validatePaginationQueryParamsForWeeklyMeals,
  validateDateUpcomingWeeklyMeals,
  validateErrorResult,
  getUpcomingWeeklyMealMenusController
);

/**
 * @swagger
 * /weekly-meal-menus/{id}:
 *   get:
 *     tags:
 *       - "Weekly Meal Menus"
 *     summary: "Get Weekly Meal Menu by ID"
 *     description: "This endpoint retrieves details of a specific Weekly Meal Menu by its ID."
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         description: "ID of the Weekly Meal Menu to retrieve"
 *         required: true
 *         schema:
 *           type: "string"
 *         example: "6039ac26b27bea672e30a1c5"
 *     responses:
 *       200:
 *         description: "Weekly Meal Menu details fetched successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 status:
 *                   type: "boolean"
 *                   example: true
 *                 data:
 *                   type: "object"
 *                   properties:
 *                     _id:
 *                       type: "string"
 *                       example: "6039ac26b27bea672e30a1c5"
 *                     category:
 *                       type: "string"
 *                       example: "MAIN"
 *                     image:
 *                       type: "string"
 *                       example: "/uploads/weeklyMealMenus/6039ac26b27bea672e30a1c5/pizza.jpg"
 *                     meal_name:
 *                       type: "string"
 *                       example: "Pizza"
 *                     main_badge_tag:
 *                       type: "string"
 *                       example: "VEGAN"
 *                     tags:
 *                       type: "array"
 *                       items:
 *                         type: "string"
 *                         example: ["main", "vegetarian", "cheese"]
 *                     protein:
 *                       type: "number"
 *                       example: 12
 *                     fat:
 *                       type: "number"
 *                       example: 8
 *                     carbs:
 *                       type: "number"
 *                       example: 20
 *                     calories:
 *                       type: "number"
 *                       example: 300
 *                     nutrition_facts:
 *                       type: "string"
 *                       example: "/uploads/weeklyMealMenus/6039ac26b27bea672e30a1c5/nutrition.jpg"
 *                     ingredients:
 *                       type: "string"
 *                       example: "Dough, tomato sauce, cheese"
 *                     heating_instruction:
 *                       type: "string"
 *                       example: "Preheat oven to 400°F and bake for 15 minutes."
 *                     available_from:
 *                       type: "string"
 *                       format: "date"
 *                       example: "2024-03-10"
 *                     unavailable_from:
 *                       type: "string"
 *                       format: "date"
 *                       example: "2024-03-15"
 *                     created_by:
 *                       type: "string"
 *                       example: "John Doe"
 *                     createdAt:
 *                       type: "string"
 *                       format: "date-time"
 *                       example: "2024-03-06T10:15:30Z"
 *                     updatedAt:
 *                       type: "string"
 *                       format: "date-time"
 *                       example: "2024-03-06T12:00:00Z"
 */
router.get(
  "/weekly-meal-menus/:id",
  validateMongooseIdMiddleware,
  validateErrorResult,
  getWeeklyMealMenuByIdController
);

/**
 * @swagger
 * /weekly-meal-menus/{id}:
 *   delete:
 *     tags:
 *       - "Weekly Meal Menus"
 *     summary: "Delete Weekly Meal Menu (admin only)"
 *     description: "This endpoint deletes a specific Weekly Meal Menu by its ID."
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: "Authorization"
 *         in: "header"
 *         description: "JWT token for authorization"
 *         required: true
 *         type: "string"
 *       - name: "id"
 *         in: "path"
 *         description: "ID of the Weekly Meal Menu to delete"
 *         required: true
 *         schema:
 *           type: "string"
 *         example: "6039ac26b27bea672e30a1c5"
 *     responses:
 *       200:
 *         description: "Weekly Meal Menu deleted successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 status:
 *                   type: "boolean"
 *                   example: true
 *                 message:
 *                   type: "object"
 *                   properties:
 *                     en:
 *                       type: "string"
 *                       example: "Weekly Meal Menu deleted successfully."
 *                     ar:
 *                       type: "string"
 *                       example: "تم حذف قائمة الوجبات الأسبوعية بنجاح"
 */
router.delete(
  "/weekly-meal-menus/:id",
  authMiddleware,
  isAdminMiddleware,
  validateMongooseIdMiddleware,
  validateErrorResult,
  deleteWeeklyMealMenuController
);

module.exports = router;
