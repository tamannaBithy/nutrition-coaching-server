const { default: mongoose } = require("mongoose");
const MealType = require("../models/MealTypeModel");

/**
 * Service function to create a new meal type
 * @param {string} user_id - ID of the user to retrieve
 * @param {Object} mealTypeName - Data for the new meal type
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.createMealTypesService = async (user_id, mealTypeName) => {
  try {
    let { lang, type_of_meal } = mealTypeName;

    // Convert to lowercase
    type_of_meal = type_of_meal.toLowerCase();

    // Creating meal type data obj with created_by: id
    const mealTypeData = {
      lang: lang || "en",
      type_of_meal,
      created_by: user_id,
    };

    // Create a new meal type using the provided data
    const mealType = new MealType(mealTypeData);
    // Save the new meal type to the database
    await mealType.save();
    // Return success status and the created meal type
    return {
      status: true,
      message: {
        en: "Meal Type created successfully.",
        ar: "تم إنشاء نوع الوجبة بنجاح",
      },
    };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in createMealTypesService:", error);
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
 * Service function to get a list of all meal types with type_of_meal in title case
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.getAllMealTypesService = async (req) => {
  try {
    // Getting the lang code from the request query
    const langCode = req?.query?.langCode;

    // Aggregation stages
    const matchingStage = {
      $match: {
        lang: langCode,
      },
    };

    const projectStage = {
      $project: {
        _id: 1,
        lang: 1,
        type_of_meal: {
          $reduce: {
            input: { $split: ["$type_of_meal", " "] },
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
    };

    // Execute aggregation pipeline
    const mealTypes = await MealType.aggregate([matchingStage, projectStage]);

    // Return success status and the list of meal types
    return { status: true, data: mealTypes };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in getAllMealTypesService:", error);
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
 * Service function to get details of a specific meal type by ID with type_of_meal in title case
 * @param {string} mealTypeId - ID of the meal type to retrieve
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.getMealTypeByIdService = async (mealTypeId) => {
  try {
    // Aggregation stages
    const matchStage = {
      $match: { _id: new mongoose.Types.ObjectId(mealTypeId) },
    };

    const projectStage = {
      $project: {
        _id: 1,
        created_by: 1,
        type_of_meal: {
          $reduce: {
            input: { $split: ["$type_of_meal", " "] },
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
    };

    // Execute aggregation pipeline
    const mealType = await MealType.aggregate([matchStage, projectStage]);

    // Check if the meal type exists
    if (!mealType || mealType.length === 0) {
      return {
        status: false,
        message: {
          en: "Meal Type not found.",
          ar: "نوع الوجبة غير موجود",
        },
      };
    }

    // Return success status and the details of the meal type
    return { status: true, data: mealType[0] };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in getMealTypeByIdService:", error);
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
 * Service function to update details of a specific meal type by ID
 * @param {string} mealTypeId - ID of the meal type to update
 * @param {Object} updateData - Data to update the meal type
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.updateMealTypeService = async (mealTypeId, updateData) => {
  try {
    let { lang, type_of_meal } = updateData;

    // Convert to lowercase
    type_of_meal = type_of_meal.toLowerCase();

    // Creating meal type data obj
    const mealTypeData = {
      lang: lang || "en",
      type_of_meal,
    };

    // Update the meal type with the specified ID using the provided data
    const mealType = await MealType.findByIdAndUpdate(
      mealTypeId,
      mealTypeData,
      {
        new: true,
        runValidators: true,
      }
    );
    // Check if the meal type exists
    if (!mealType) {
      return {
        status: false,
        message: {
          en: "Meal Type not found.",
          ar: "نوع الوجبة غير موجود",
        },
      };
    }
    // Return success status and the updated details of the meal type
    return {
      status: true,
      message: {
        en: "Meal Type updated successfully.",
        ar: "تم تحديث نوع الوجبة بنجاح",
      },
    };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in updateMealTypeService:", error);
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
 * Service function to delete a specific meal type by ID
 * @param {string} mealTypeId - ID of the meal type to delete
 * @returns {Object} - Result of the operation (status and message)
 */
exports.deleteMealTypeService = async (mealTypeId) => {
  try {
    // Delete the meal type with the specified ID from the database
    const mealType = await MealType.findByIdAndDelete(mealTypeId);
    // Check if the meal type exists
    if (!mealType) {
      return {
        status: false,
        message: {
          en: "Meal Type not found.",
          ar: "نوع الوجبة غير موجود",
        },
      };
    }
    // Return success status and a deletion success message
    return {
      status: true,
      message: {
        en: "Meal Type deleted successfully.",
        ar: "تم حذف نوع الوجبة بنجاح",
      },
    };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in deleteMealTypeService:", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};
