const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const WeeklyMealMenuModel = require("../models/WeeklyMealMenuModel");
const { calculateCalories } = require("../utils/calculateCalories");

/**
 * Service function to create a new Weekly Meal Menu.
 * @param {string} user_id - The user ID creating the Weekly Meal Menu.
 * @param {Object} mealMenuData - Data for the new Weekly Meal Menu.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result of the Weekly Meal Menu creation process.
 */
exports.createWeeklyMealMenuService = async (user_id, mealMenuData, req) => {
  try {
    let {
      lang,
      category,
      image,
      meal_name,
      main_badge_tag,
      tags,
      protein,
      fat,
      carbs,
      nutrition_facts,
      ingredients,
      heating_instruction,
      available_from,
      unavailable_from,
      visible,
    } = mealMenuData;

    // Convert tags to lowercase
    tags = tags.map((tag) => tag.toLowerCase());

    // Create a new Weekly Meal Menu in the database
    const newMealMenu = await WeeklyMealMenuModel.create({
      lang: lang || "en",
      category,
      image: "",
      meal_name: meal_name.toLowerCase(),
      main_badge_tag: main_badge_tag.toLowerCase() || "",
      tags,
      protein,
      fat,
      carbs,
      calories: await calculateCalories(protein, carbs, fat),
      nutrition_facts: "", // Initialize with an empty string
      ingredients,
      heating_instruction,
      available_from,
      unavailable_from,
      visible,
      created_by: user_id,
    });

    const newMealMenuId = newMealMenu._id;

    // Specify the absolute path for the "public" folder
    const publicPath = path.join(__dirname, "../../public");

    // Define the upload directory path for the meal menu images
    const uploadDir = path.join(
      publicPath,
      "uploads/weeklyMealMenus",
      newMealMenuId.toString()
    );

    // Execution after adding the images by admin
    if (req.files) {
      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Handle images field (if present)
      if (req.files && req.files.image) {
        const mealImage = req.files.image;

        // Define allowed file extensions for the meal menu images
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

        const fileExtension = path.extname(mealImage.name).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          // Delete the newly created meal menu if the file type is invalid
          await WeeklyMealMenuModel.findByIdAndDelete(newMealMenuId);

          return {
            message: {
              en: "Invalid file type. Only image files are allowed.",
              ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور",
            },
          };
        }

        // Generate a unique image name using the meal_name and incrementing string
        const uniqueImageName = `${meal_name}${fileExtension}`;

        // Define the path for the uploaded meal menu image
        const photoPath = path.join(uploadDir, uniqueImageName);

        // Move the uploaded image to the specified path
        mealImage.mv(photoPath, (err) => {
          if (err) {
            console.log("Error uploading meal menu image: ", err);
          }
        });

        // Update the meal menu with the image path
        newMealMenu.image = `/uploads/weeklyMealMenus/${newMealMenuId.toString()}/${uniqueImageName}`;
      }

      // Handle nutrition_facts field (if present)
      if (req.files.nutrition_facts) {
        const nutritionFactsImage = req.files.nutrition_facts;

        // Define allowed file extensions for the nutrition_facts image
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

        const fileExtension = path
          .extname(nutritionFactsImage.name)
          .toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          // Delete the newly created meal menu if the file type is invalid
          await WeeklyMealMenuModel.findByIdAndDelete(newMealMenuId);

          return {
            message: {
              en: "Invalid file type. Only image files are allowed for nutrition facts.",
              ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور للمعلومات الغذائية",
            },
          };
        }

        // Generate a unique image name for nutrition facts using the meal_name and timestamp
        const uniqueImageName = `${meal_name}-nutrition-facts${fileExtension}`;

        // Define the path for the uploaded nutrition_facts image
        const nutritionFactsImagePath = path.join(uploadDir, uniqueImageName);

        // Move the uploaded image to the specified path
        nutritionFactsImage.mv(nutritionFactsImagePath, (err) => {
          if (err) {
            console.log("Error uploading nutrition facts image: ", err);
          }
        });

        // Update the meal menu with the nutrition_facts image path
        newMealMenu.nutrition_facts = `/uploads/weeklyMealMenus/${newMealMenuId.toString()}/${uniqueImageName}`;
      }
    } else if (
      typeof req.body.image === "string" ||
      typeof req.body.nutrition_facts === "string" ||
      typeof req.body.image === "boolean" ||
      typeof req.body.nutrition_facts === "boolean" ||
      req.body.image === "" ||
      req.body.image === null ||
      req.body.image === undefined ||
      req.body.nutrition_facts === "" ||
      req.body.nutrition_facts === null ||
      req.body.nutrition_facts === undefined
    ) {
      /* If the images are coming inside of the body and they are string or empty string or null or undefined or boolean,
       * then just assigning the value of image and nutrition_facts empty string
       */
      newMealMenu.image = "";
      newMealMenu.nutrition_facts = "";
    } else {
      newMealMenu.image = "";
      newMealMenu.nutrition_facts = "";
    }

    // Save the updated meal menu to the database
    await newMealMenu.save();

    return {
      status: true,
      message: {
        en: "Weekly Meal Menu created successfully.",
        ar: "تم إنشاء قائمة الوجبات الأسبوعية بنجاح",
      },
    };
  } catch (error) {
    console.error("Error creating Weekly Meal Menu", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to get all Weekly Meal Menus for the running week, next week, and the week after that.
 * @returns {Object} - Result containing the Weekly Meal Menus for the specified weeks with additional data.
 */
exports.getAllWeeklyMealMenusOfRunningWeekNextWeekAndAfterThatWeekService =
  async (req) => {
    try {
      // Getting the language code from the query
      // Getting the lang code from the request query
      const langCode = req?.query?.langCode;

      // Current Date
      const today = new Date();

      // Get the current week's start and end dates
      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(
        today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
      );
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

      // Get the next week's start and end dates
      const nextWeekStart = new Date(currentWeekEnd);
      nextWeekStart.setDate(currentWeekEnd.getDate() + 1);
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

      // Get the week after that's start and end dates
      const weekAfterStart = new Date(nextWeekEnd);
      weekAfterStart.setDate(nextWeekEnd.getDate() + 1);
      const weekAfterEnd = new Date(weekAfterStart);
      weekAfterEnd.setDate(weekAfterStart.getDate() + 6);

      // Format date ranges
      const formatDateRange = (start, end) => {
        const dateFormate = langCode === "ar" ? "ar" : "en-US";

        const startFormatted = start.toLocaleDateString(dateFormate, {
          month: "short",
          day: "numeric",
        });
        const endFormatted = end.toLocaleDateString(dateFormate, {
          day: "numeric",
        });
        return `${startFormatted}-${endFormatted}`;
      };

      // Fetch meal menus for the three weeks
      const mealMenusCurrentWeek = await fetchMealMenusForWeek(
        langCode,
        currentWeekStart,
        currentWeekEnd
      );

      const mealMenusNextWeek = await fetchMealMenusForWeek(
        langCode,
        nextWeekStart,
        nextWeekEnd
      );

      const mealMenusWeekAfter = await fetchMealMenusForWeek(
        langCode,
        weekAfterStart,
        weekAfterEnd
      );

      // Create the desired output structure
      const outputData = [
        {
          week: formatDateRange(currentWeekStart, currentWeekEnd),
          meals_with_category: mealMenusCurrentWeek,
        },
        {
          week: formatDateRange(nextWeekStart, nextWeekEnd),
          meals_with_category: mealMenusNextWeek,
        },
        {
          week: formatDateRange(weekAfterStart, weekAfterEnd),
          meals_with_category: mealMenusWeekAfter,
        },
      ];

      return { status: true, data: outputData };
    } catch (error) {
      console.error("Error fetching weekly meal menus", error);
      return {
        status: false,
        message: {
          en: "Something went wrong.",
          ar: "حدث خطأ ما",
        },
      };
    }
  };

/**
 * Helper function to fetch meal menus for a specific week.
 * @param {Date} startDate - Start date of the week.
 * @param {Date} endDate - End date of the week.
 * @returns {Array} - Array containing meal menus with additional data.
 */
const fetchMealMenusForWeek = async (langCode, startDate, endDate) => {
  const matchAndLookup = [
    {
      $match: {
        lang: langCode,
        visible: true,
        $or: [
          {
            available_from: {
              $gte: startDate,
              $lte: endDate,
            },
          },
          {
            unavailable_from: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "weeklymealcategories",
        localField: "category",
        foreignField: "_id",
        as: "categoryData",
      },
    },
  ];

  const addFieldsAndProject = [
    {
      $addFields: {
        weekly_meal_category: {
          $toUpper: { $arrayElemAt: ["$categoryData.weekly_meal_category", 0] },
        },
        meal_name: {
          $toUpper: "$meal_name",
        },
        main_badge_tag: {
          $toUpper: "$main_badge_tag",
        },
        tags: {
          $map: {
            input: "$tags",
            as: "tag",
            in: { $toUpper: "$$tag" },
          },
        },
        available_from: {
          $dateToString: { format: "%Y-%m-%d", date: "$available_from" },
        },
        unavailable_from: {
          $dateToString: { format: "%Y-%m-%d", date: "$unavailable_from" },
        },
      },
    },
    {
      $project: {
        _id: 1,
        weekly_meal_category: 1,
        image: 1,
        meal_name: 1,
        main_badge_tag: 1,
        tags: 1,
        protein: 1,
        fat: 1,
        carbs: 1,
        calories: 1,
        nutrition_facts: 1,
        ingredients: 1,
        heating_instruction: 1,
        available_from: 1,
        unavailable_from: 1,
      },
    },
  ];

  const groupAndProject = [
    {
      $group: {
        _id: "$weekly_meal_category",
        meals: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        weekly_meal_category: "$_id", // Rename _id to weekly_meal_category
        meals: 1,
        _id: 0, // Exclude the default _id field
      },
    },
  ];

  const mealsForWeek = await WeeklyMealMenuModel.aggregate([
    ...matchAndLookup,
    ...addFieldsAndProject,
    ...groupAndProject,
  ]);

  return mealsForWeek;
};

/**
 * Service function to get details of a specific Weekly Meal Menu by ID using aggregation.
 * @param {string} menuId - The ID of the Weekly Meal Menu.
 * @returns {Object} - Result containing details of the specified Weekly Meal Menu.
 */
exports.getWeeklyMealMenuByIdService = async (menuId) => {
  try {
    // Convert menuId to a MongoDB ObjectId
    const objectId = new mongoose.Types.ObjectId(menuId);

    // Aggregation pipeline stages
    const aggregationPipeline = [
      {
        $match: {
          _id: objectId,
        },
      },
      {
        $lookup: {
          from: "weeklymealcategories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $addFields: {
          category: {
            $toUpper: {
              $arrayElemAt: ["$categoryData.weekly_meal_category", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          category: 1,
          image: 1,
          meal_name: 1,
          main_badge_tag: 1,
          tags: 1,
          protein: 1,
          fat: 1,
          carbs: 1,
          calories: 1,
          nutrition_facts: 1,
          ingredients: 1,
          heating_instruction: 1,
          available_from: 1,
          unavailable_from: 1,
          created_by: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await WeeklyMealMenuModel.aggregate(aggregationPipeline);

    if (result.length === 0) {
      return {
        status: false,
        message: {
          en: "Weekly Meal Menu not found.",
          ar: "قائمة الوجبات الأسبوعية غير موجودة",
        },
      };
    }

    // Extract the first element from the result array
    const weeklyMealMenu = result[0];

    // Create a formatted output object
    const outputData = {
      status: true,
      data: {
        ...weeklyMealMenu,
      },
    };

    return outputData;
  } catch (error) {
    console.error(
      "Error fetching Weekly Meal Menu by ID using aggregation",
      error
    );
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to get previous Weekly Meal Menus with pagination.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result containing the previous Weekly Meal Menus with pagination data.
 */
exports.getPreviousWeeklyMealMenusService = async (req) => {
  try {
    // Getting the lang code from the request query
    const langCode = req?.query?.langCode;

    // Constants for pagination
    const showPerPage = req?.query?.showPerPage
      ? parseInt(req?.query?.showPerPage)
      : 10;
    const pageNo = req?.query?.pageNo ? parseInt(req?.query?.pageNo) : 1;

    // Extract searchKeyword from the request
    const searchKeyword = req?.query?.searchKeyword || "";

    // Get today's date
    const today = new Date();

    // Calculate the starting date of the current week (Monday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
    );

    // Calculate the end date of the current week (Sunday)
    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Format dates as strings
    const formattedRunningWeekMonday = startOfWeek.toISOString().split("T")[0];
    const formattedRunningWeekSunday = endOfWeek.toISOString().split("T")[0];
    const formattedUnavailableFrom = new Date(
      req?.query?.unavailable_from_start
    )
      .toISOString()
      .split("T")[0];
    const formattedUnavailableEnd = new Date(req?.query?.unavailable_from_end)
      .toISOString()
      .split("T")[0];

    // Check if unavailable_from_start is within the valid range
    if (
      formattedUnavailableFrom &&
      formattedUnavailableFrom >= formattedRunningWeekMonday
    ) {
      return {
        status: false,
        message: {
          en: "Unavailable From Start can't be the running week's Monday or any future date.",
          ar: "لا يمكن أن يكون Unavailable From Start يوم الاثنين للأسبوع الحالي أو أي تاريخ مستقبلي آخر",
        },
      };
    }

    // Check if unavailable_from_end is within the valid range
    if (
      formattedUnavailableEnd &&
      formattedUnavailableEnd >= formattedRunningWeekMonday
    ) {
      return {
        status: false,
        message: {
          en: "Unavailable From End can't be the running week's Monday or any future date.",
          ar: "لا يمكن أن يكون Unavailable From End يوم الاثنين للأسبوع الحالي أو أي تاريخ مستقبلي آخر",
        },
      };
    }

    // Aggregation method to match, lookup WeeklyMealCategory data
    const matchAndLookup = [
      {
        $match: {
          lang: langCode,
          $or: [
            {
              $and: [
                {
                  unavailable_from: {
                    $gte: new Date(formattedUnavailableFrom),
                  },
                },
                {
                  unavailable_from: {
                    $lte: new Date(formattedUnavailableEnd),
                  },
                },
              ],
            },
          ],
          meal_name: { $regex: searchKeyword, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "weeklymealcategories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
    ];

    // Aggregation method to addFields and project
    const addFieldsAndProject = [
      {
        $addFields: {
          category: {
            $toUpper: {
              $arrayElemAt: ["$categoryData.weekly_meal_category", 0],
            },
          },
          meal_name: {
            $toUpper: "$meal_name",
          },
          main_badge_tag: {
            $toUpper: "$main_badge_tag",
          },
          tags: {
            $map: {
              input: "$tags",
              as: "tag",
              in: { $toUpper: "$$tag" },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          image: 1,
          meal_name: 1,
          main_badge_tag: 1,
          category: 1,
          tags: 1,
          protein: 1,
          fat: 1,
          carbs: 1,
          calories: 1,
          nutrition_facts: 1,
          ingredients: 1,
          heating_instruction: 1,
          available_from: {
            $dateToString: { format: "%Y-%m-%d", date: "$available_from" },
          },
          unavailable_from: {
            $dateToString: { format: "%Y-%m-%d", date: "$unavailable_from" },
          },
        },
      },
    ];

    // Aggregation method to sort and paginate
    const sortAndPaginate = [
      {
        $sort: { available_from: 1 },
      },
      {
        $skip: (pageNo - 1) * showPerPage,
      },
      {
        $limit: showPerPage,
      },
    ];

    // Use aggregation to join with WeeklyMealCategory collection
    const previousWeeklyMealMenus = await WeeklyMealMenuModel.aggregate([
      ...matchAndLookup,
      ...addFieldsAndProject,
      ...sortAndPaginate,
    ]);

    // Get total data count for pagination
    const totalDataCount = await WeeklyMealMenuModel.countDocuments({
      lang: langCode,
      $or: [
        {
          $and: [
            {
              unavailable_from: {
                $gte: new Date(formattedUnavailableFrom),
              },
            },
            {
              unavailable_from: {
                $lte: new Date(formattedUnavailableEnd),
              },
            },
          ],
        },
      ],
      meal_name: { $regex: searchKeyword, $options: "i" },
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalDataCount / showPerPage);

    // Generate array of page numbers
    const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Calculate start and end items for showing
    const startItem = (pageNo - 1) * showPerPage + 1;
    const endItem = Math.min(pageNo * showPerPage, totalDataCount);

    return {
      status: true,
      data: previousWeeklyMealMenus,
      totalDataCount,
      totalPages: pageArray,
      currentPage: pageNo,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: `عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
    };
  } catch (error) {
    console.error("Error fetching previous weekly meals", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to get all Weekly Meal Menus for the running week with preference and type_of_meal data.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result containing the Weekly Meal Menus for the running week with additional data and pagination.
 */
exports.getRunningWeeklyMealMenusService = async (req) => {
  try {
    // Getting the lang code from the request query
    const langCode = req?.query?.langCode;

    // Constants for pagination
    const showPerPage = req?.query?.showPerPage
      ? parseInt(req?.query?.showPerPage)
      : 10;
    const pageNo = req?.query?.pageNo ? parseInt(req?.query?.pageNo) : 1;

    // Extract searchKeyword from the request
    const searchKeyword = req?.query?.searchKeyword || "";

    // Get today's date
    const today = new Date();

    // Calculate the starting date of the current week (Monday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
    );

    // Calculate the end date of the current week (Sunday)
    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Format dates as strings
    const formattedRunningWeekMonday = startOfWeek.toISOString().split("T")[0];
    const formattedRunningWeekSunday = endOfWeek.toISOString().split("T")[0];

    // Aggregation method to match and lookup WeeklyMealCategory data
    const matchAndLookup = [
      {
        $match: {
          lang: langCode,
          available_from: {
            $gte: new Date(formattedRunningWeekMonday),
            $lte: new Date(formattedRunningWeekSunday),
          },
          unavailable_from: {
            $gte: new Date(formattedRunningWeekMonday),
            $lte: new Date(formattedRunningWeekSunday),
          },
          meal_name: { $regex: searchKeyword, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "weeklymealcategories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
    ];

    // Define stages for adding fields and projecting
    const addFieldsAndProject = [
      {
        $addFields: {
          meal_name: { $toUpper: "$meal_name" },
          main_badge_tag: { $toUpper: "$main_badge_tag" },
          category: {
            $toUpper: {
              $arrayElemAt: ["$categoryData.weekly_meal_category", 0],
            },
          },
          tags: {
            $map: { input: "$tags", as: "tag", in: { $toUpper: "$$tag" } },
          },
          available_from: {
            $dateToString: { format: "%Y-%m-%d", date: "$available_from" },
          },
          unavailable_from: {
            $dateToString: { format: "%Y-%m-%d", date: "$unavailable_from" },
          },
        },
      },
      {
        $project: {
          _id: 1,
          image: 1,
          meal_name: 1,
          main_badge_tag: 1,
          category: 1,
          tags: 1,
          protein: 1,
          fat: 1,
          carbs: 1,
          calories: 1,
          nutrition_facts: 1,
          ingredients: 1,
          heating_instruction: 1,
          available_from: 1,
          unavailable_from: 1,
        },
      },
    ];

    // Aggregation method to sort and paginate
    const sortAndPaginate = [
      { $sort: { available_from: 1 } }, // Sort by available_from in ascending order
      { $skip: (pageNo - 1) * showPerPage },
      { $limit: showPerPage },
    ];

    // Use aggregation to join with WeeklyMealCategory collection, add fields, and perform pagination
    const mealsForRunningWeek = await WeeklyMealMenuModel.aggregate([
      ...matchAndLookup,
      ...addFieldsAndProject,
      ...sortAndPaginate,
    ]);

    // Get total data count for pagination
    const totalDataCount = await WeeklyMealMenuModel.countDocuments({
      lang: langCode,
      available_from: {
        $gte: new Date(formattedRunningWeekMonday),
        $lte: new Date(formattedRunningWeekSunday),
      },
      unavailable_from: {
        $gte: new Date(formattedRunningWeekMonday),
        $lte: new Date(formattedRunningWeekSunday),
      },
      meal_name: { $regex: searchKeyword, $options: "i" },
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalDataCount / showPerPage);

    // Generate array of page numbers
    const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Calculate start and end items for showing
    const startItem = (pageNo - 1) * showPerPage + 1;
    const endItem = Math.min(pageNo * showPerPage, totalDataCount);

    return {
      status: true,
      data: mealsForRunningWeek,
      totalDataCount,
      totalPages: pageArray,
      currentPage: pageNo,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: `عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
    };
  } catch (error) {
    console.error("Error fetching meals for the running week", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to get all upcoming Weekly Meal Menus with pagination.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result containing the upcoming Weekly Meal Menus with additional data and pagination.
 */
exports.getUpcomingWeeklyMealMenusService = async (req) => {
  try {
    // Getting the lang code from the request query
    const langCode = req?.query?.langCode;

    // Constants for pagination
    const showPerPage = req?.query?.showPerPage
      ? parseInt(req?.query?.showPerPage)
      : 10;
    const pageNo = req?.query?.pageNo ? parseInt(req?.query?.pageNo) : 1;

    // Extract searchKeyword from the request
    const searchKeyword = req?.query?.searchKeyword || "";

    // Get today's date
    const today = new Date();

    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDayOfWeek = today.getDay();

    // Calculate the number of days until next Monday (assuming Monday is 1)
    let daysUntilNextMonday = 1 - currentDayOfWeek;
    if (daysUntilNextMonday <= 0) {
      daysUntilNextMonday += 7; // Add 7 days to get to the next Monday
    }

    // Create a new Date object for next Monday by adding the days until next Monday
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);

    // Convert dates to a readable format (e.g., YYYY-MM-DD)
    const formattedNextMonday = nextMonday.toISOString().split("T")[0];
    const formattedAvailableFrom = new Date(req?.query?.available_from)
      .toISOString()
      .split("T")[0];
    const formattedUnavailableFrom = new Date(req?.query?.unavailable_from)
      .toISOString()
      .split("T")[0];

    /*  return {
      formattedNextMonday,
    }; */

    // Check if available_from is earlier than next week's Monday
    if (
      formattedAvailableFrom &&
      formattedAvailableFrom < formattedNextMonday
    ) {
      return {
        status: false,
        message: {
          en: "Available From date can't be any previous date of next week's Monday.",
          ar: "لا يمكن أن يكون تاريخ Available From أي تاريخ سابق ليوم الاثنين للأسبوع القادم",
        },
      };
    }

    // Check if unavailable_from is earlier than next week's Monday
    if (
      formattedUnavailableFrom &&
      formattedUnavailableFrom < formattedNextMonday
    ) {
      return {
        status: false,
        message: {
          en: "Unavailable From date can't be any previous date of next week's Monday.",
          ar: "لا يمكن أن يكون تاريخ Unavailable From أي تاريخ سابق ليوم الاثنين للأسبوع القادم",
        },
      };
    }

    // Set the available_from and unavailable_from based on frontend input
    const available_from = formattedAvailableFrom || formattedNextMonday;
    const unavailable_from = formattedUnavailableFrom || "9999-12-31"; // A far-future date

    // Aggregation method to match and lookup WeeklyMealCategory data
    const matchAndLookup = [
      {
        $match: {
          lang: langCode,
          $or: [
            {
              available_from: {
                $gte: new Date(available_from),
                $lte: new Date(unavailable_from),
              },
            },
            {
              unavailable_from: {
                $gte: new Date(available_from),
              },
            },
          ],
          meal_name: { $regex: searchKeyword, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "weeklymealcategories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
    ];

    const addFieldsAndProject = [
      {
        $addFields: {
          meal_name: { $toUpper: "$meal_name" },
          main_badge_tag: { $toUpper: "$main_badge_tag" },
          category: {
            $toUpper: {
              $arrayElemAt: ["$categoryData.weekly_meal_category", 0],
            },
          },
          tags: {
            $map: { input: "$tags", as: "tag", in: { $toUpper: "$$tag" } },
          },
          available_from: {
            $dateToString: { format: "%Y-%m-%d", date: "$available_from" },
          },
          unavailable_from: {
            $dateToString: { format: "%Y-%m-%d", date: "$unavailable_from" },
          },
        },
      },
      {
        $project: {
          _id: 1,
          image: 1,
          meal_name: 1,
          category: 1,
          main_badge_tag: 1,
          tags: 1,
          protein: 1,
          fat: 1,
          carbs: 1,
          calories: 1,
          nutrition_facts: 1,
          ingredients: 1,
          heating_instruction: 1,
          available_from: 1,
          unavailable_from: 1,
        },
      },
    ];

    // Aggregation method to sort and paginate
    const sortAndPaginate = [
      { $sort: { available_from: 1 } }, // Sort by available_from in ascending order
      { $skip: (pageNo - 1) * showPerPage },
      { $limit: showPerPage },
    ];

    // Aggregation method to count total data
    const countTotalData = [
      {
        $match: {
          lang: langCode,
          $or: [
            {
              available_from: {
                $gte: new Date(available_from),
                $lte: new Date(unavailable_from),
              },
            },
            {
              unavailable_from: {
                $gte: new Date(available_from),
              },
            },
          ],
          meal_name: { $regex: searchKeyword, $options: "i" },
        },
      },
      {
        $count: "totalDataCount",
      },
    ];

    // Use aggregation to join with WeeklyMealCategory collection, add fields, and perform pagination
    const upcomingWeeklyMealMenus = await WeeklyMealMenuModel.aggregate([
      ...matchAndLookup,
      ...addFieldsAndProject,
      ...sortAndPaginate,
    ]);

    // Execute aggregation to count total data
    const totalDataCountResult = await WeeklyMealMenuModel.aggregate(
      countTotalData
    );

    // Extract total data count from the result
    const totalDataCount =
      totalDataCountResult.length > 0
        ? totalDataCountResult[0].totalDataCount
        : 0;

    // Calculate total pages
    const totalPages = Math.ceil(totalDataCount / showPerPage);

    // Generate array of page numbers
    const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Calculate the range of items being displayed
    const startItem = (pageNo - 1) * showPerPage + 1;
    const endItem = Math.min(pageNo * showPerPage, totalDataCount);

    return {
      status: true,
      data: upcomingWeeklyMealMenus,
      totalDataCount,
      totalPages: pageArray,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: `عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
      currentPage: pageNo,
    };
  } catch (error) {
    console.error("Error fetching upcoming meals", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to delete a specific Weekly Meal Menu.
 * @param {string} weeklyMealMenuId - The ID of the Weekly Meal Menu.
 * @returns {Object} - Result of deleting the Weekly Meal Menu.
 */
exports.deleteWeeklyMealMenuService = async (weeklyMealMenuId) => {
  try {
    // Fetch the Weekly Meal Menu by ID from the database
    const weeklyMealMenu = await WeeklyMealMenuModel.findById(weeklyMealMenuId);

    if (!weeklyMealMenu) {
      return {
        status: false,
        message: {
          en: "Weekly Meal Menu not found.",
          ar: "قائمة الوجبات الأسبوعية غير موجودة",
        },
      };
    }

    // Remove the images and their directories
    const uploadDir = path.join(
      __dirname,
      `../../public/uploads/weeklyMealMenus/${weeklyMealMenuId}`
    );
    if (fs.existsSync(uploadDir)) {
      fs.readdirSync(uploadDir).forEach((file) => {
        const filePath = path.join(uploadDir, file);
        fs.unlinkSync(filePath);
      });
      fs.rmdirSync(uploadDir, { recursive: true });
    }

    // Delete the Weekly Meal Menu from the database
    await WeeklyMealMenuModel.findByIdAndDelete(weeklyMealMenuId);

    return {
      status: true,
      message: {
        en: "Weekly Meal Menu deleted successfully.",
        ar: "تم حذف قائمة الوجبات الأسبوعية بنجاح",
      },
    };
  } catch (error) {
    console.error("Error deleting Weekly Meal Menu", error);
    return {
      status: false,
      message: { en: "Something went wrong.", ar: "حدث خطأ ما." },
    };
  }
};
