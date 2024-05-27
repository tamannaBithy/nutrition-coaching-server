const { default: mongoose } = require("mongoose");
const WeeklyMealCategory = require("../models/WeeklyMealCategoryModel");

/**
 * Service function to create a new Weekly Meal Category
 * @param {string} user_id - ID of the user who is creating the Weekly Meal Category
 * @param {Object} weeklyMealCategoryData - Data for the new Weekly Meal Category
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.createWeeklyMealCategoryService = async (
  user_id,
  weeklyMealCategoryData
) => {
  try {
    let { lang, weekly_meal_category } = weeklyMealCategoryData;

    // Convert to lowercase
    weekly_meal_category = weekly_meal_category.toLowerCase();

    // Check if a Weekly Meal Category with the same name already exists
    const existingCategory = await WeeklyMealCategory.findOne({
      lang,
      weekly_meal_category,
    });
    if (existingCategory) {
      return {
        status: false,
        message: {
          en: "Weekly Meal Category with the same name already exists.",
          ar: "فئة الوجبات الأسبوعية بنفس الاسم موجودة بالفعل",
        },
      };
    }

    // Create a new Weekly Meal Category using the provided data
    const weeklyMealCategory = new WeeklyMealCategory({
      lang: lang || "en",
      weekly_meal_category,
      created_by: user_id,
    });

    // Save the new Weekly Meal Category to the database
    await weeklyMealCategory.save();

    // Return success status and the created Weekly Meal Category
    return {
      status: true,
      data: weeklyMealCategory,
      message: {
        en: "Weekly Meal Category created successfully.",
        ar: "تم إنشاء فئة الوجبات الأسبوعية بنجاح",
      },
    };
  } catch (error) {
    console.error("Error in createWeeklyMealCategoryService:", error);
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
 * Service function to get a list of all Weekly Meal Categories
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.getAllWeeklyMealCategoriesService = async (req) => {
  try {
    // Getting the lang code from the request query
    const langCode = req?.query?.langCode;

    // MongoDB Aggregation Pipeline
    const aggregationPipeline = [
      {
        $match: {
          lang: langCode,
        },
      },
      {
        $project: {
          _id: 1,
          created_by: 1,
          weekly_meal_category: {
            $reduce: {
              input: { $split: ["$weekly_meal_category", " "] },
              initialValue: "",
              in: {
                $concat: [
                  "$$value",
                  " ",
                  {
                    $toUpper: { $substrCP: ["$$this", 0, 1] },
                  },
                  {
                    $toLower: {
                      $substrCP: ["$$this", 1, { $strLenCP: "$$this" }],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ];

    // Execute the aggregation pipeline
    const formattedCategories = await WeeklyMealCategory.aggregate(
      aggregationPipeline
    );

    // Return success status and the list of formatted Weekly Meal Categories
    return { status: true, data: formattedCategories };
  } catch (error) {
    console.error("Error in getAllWeeklyMealCategoriesService:", error);
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
 * Service function to get details of a specific Weekly Meal Category by ID
 * @param {string} weeklyMealCategoryId - ID of the Weekly Meal Category to retrieve
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.getWeeklyMealCategoryByIdService = async (weeklyMealCategoryId) => {
  try {
    // MongoDB Aggregation Pipeline
    const aggregationPipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(weeklyMealCategoryId) },
      },
      {
        $project: {
          _id: 1,
          created_by: 1,
          weekly_meal_category: {
            $reduce: {
              input: { $split: ["$weekly_meal_category", " "] },
              initialValue: "",
              in: {
                $concat: [
                  "$$value",
                  " ",
                  {
                    $toUpper: { $substrCP: ["$$this", 0, 1] },
                  },
                  {
                    $toLower: {
                      $substrCP: ["$$this", 1, { $strLenCP: "$$this" }],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ];

    // Execute the aggregation pipeline
    const formattedCategory = await WeeklyMealCategory.aggregate(
      aggregationPipeline
    );

    // Check if the Weekly Meal Category exists
    if (!formattedCategory || formattedCategory.length === 0) {
      return {
        status: false,
        message: {
          en: "Weekly Meal Category not found.",
          ar: "لم يتم العثور على فئة الوجبات الأسبوعية",
        },
      };
    }

    // Return success status and the formatted Weekly Meal Category
    return { status: true, data: formattedCategory[0] };
  } catch (error) {
    console.error("Error in getWeeklyMealCategoryByIdService:", error);
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
 * Service function to update details of a specific Weekly Meal Category by ID
 * @param {string} weeklyMealCategoryId - ID of the Weekly Meal Category to update
 * @param {Object} updateData - Data to update the Weekly Meal Category
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.updateWeeklyMealCategoryService = async (
  weeklyMealCategoryId,
  updateData
) => {
  try {
    // Convert the 'weekly_meal_category' field to lowercase in the updateData
    if (updateData?.weekly_meal_category) {
      updateData.weekly_meal_category =
        updateData?.weekly_meal_category?.toLowerCase();
    }
    // Convert the 'lang' field to lowercase in the updateData
    if (updateData.lang) {
      updateData.lang = updateData?.lang?.toLowerCase() || "en";
    }

    // Update the Weekly Meal Category with the specified ID using the provided data
    const weeklyMealCategory = await WeeklyMealCategory.findByIdAndUpdate(
      weeklyMealCategoryId,
      updateData,
      { new: true, runValidators: true }
    );

    // Check if the Weekly Meal Category exists
    if (!weeklyMealCategory) {
      return {
        status: false,
        message: {
          en: "Weekly Meal Category not found.",
          ar: "لم يتم العثور على فئة الوجبات الأسبوعية",
        },
      };
    }

    // Return success status and the updated details of the Weekly Meal Category
    return {
      status: true,
      data: weeklyMealCategory,
      message: {
        en: "Weekly Meal Category updated successfully.",
        ar: "تم تحديث فئة الوجبات الأسبوعية بنجاح",
      },
    };
  } catch (error) {
    console.error("Error in updateWeeklyMealCategoryService:", error);
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
 * Service function to delete a specific Weekly Meal Category by ID
 * @param {string} weeklyMealCategoryId - ID of the Weekly Meal Category to delete
 * @returns {Object} - Result of the operation (status and message)
 */
exports.deleteWeeklyMealCategoryService = async (weeklyMealCategoryId) => {
  try {
    // Delete the Weekly Meal Category with the specified ID from the database
    const weeklyMealCategory = await WeeklyMealCategory.findByIdAndDelete(
      weeklyMealCategoryId
    );

    // Check if the Weekly Meal Category exists
    if (!weeklyMealCategory) {
      return {
        status: false,
        message: {
          en: "Weekly Meal Category not found.",
          ar: "لم يتم العثور على فئة الوجبات الأسبوعية",
        },
      };
    }

    // Return success status and a deletion success message
    return {
      status: true,
      message: {
        en: "Weekly Meal Category deleted successfully.",
        ar: "تم حذف فئة الوجبات الأسبوعية بنجاح",
      },
    };
  } catch (error) {
    console.error("Error in deleteWeeklyMealCategoryService:", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};
