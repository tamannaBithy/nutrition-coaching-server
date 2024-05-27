const MealsPerDay = require("../models/MealsPerDayModel");

/**
 * Service function to create a new MealsPerDay record
 * @param {string} user_id - ID of the user creating the record
 * @param {Object} mealsPerDayData - Data for the new MealsPerDay record
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.createMealsPerDayService = async (user_id, mealsPerDayData) => {
  try {
    const { meals_count, visible } = mealsPerDayData;

    // Create a new MealsPerDay record using the provided data
    const mealsPerDay = new MealsPerDay({
      meals_count,
      visible,
      created_by: user_id,
    });

    // Save the new MealsPerDay record to the database
    await mealsPerDay.save();

    // Return success status and the created MealsPerDay record
    return {
      status: true,
      message: {
        en: "Meals Per Day record created successfully.",
        ar: "تم إنشاء سجل وجبات في اليوم بنجاح",
      },
    };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in createMealsPerDayService:", error);
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
 * Service function to get a list of all MealsPerDay records
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.getAllMealsPerDayService = async () => {
  try {
    // Retrieve all MealsPerDay records from the database
    const mealsPerDayList = await MealsPerDay.find(
      { visible: true },
      { meals_count: 1, _id: 0 }
    ).sort({ meals_count: 1 });

    // Return success status and the list of MealsPerDay records
    return { status: true, data: mealsPerDayList };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in getAllMealsPerDayService:", error);
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
 * Service function to get details of a specific MealsPerDay record by ID
 * @param {string} mealsPerDayId - ID of the MealsPerDay record to retrieve
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.getMealsPerDayByIdService = async (mealsPerDayId) => {
  try {
    // Retrieve the MealsPerDay record with the specified ID from the database
    const mealsPerDay = await MealsPerDay.findById(mealsPerDayId, {
      createdAt: 0,
      updatedAt: 0,
    });

    // Check if the MealsPerDay record exists
    if (!mealsPerDay) {
      return {
        status: false,
        message: {
          en: "Meals Per Day record not found.",
          ar: "لم يتم العثور على سجل وجبات في اليوم",
        },
      };
    }

    // Return success status and the details of the MealsPerDay record
    return { status: true, data: mealsPerDay };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in getMealsPerDayByIdService:", error);
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
 * Service function to update details of a specific MealsPerDay record by ID
 * @param {string} mealsPerDayId - ID of the MealsPerDay record to update
 * @param {Object} updateData - Data to update the MealsPerDay record
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.updateMealsPerDayService = async (mealsPerDayId, updateData) => {
  try {
    // Update the MealsPerDay record with the specified ID using the provided data
    const mealsPerDay = await MealsPerDay.findByIdAndUpdate(
      mealsPerDayId,
      updateData,
      { new: true, runValidators: true }
    );

    // Check if the MealsPerDay record exists
    if (!mealsPerDay) {
      return {
        status: false,
        message: {
          en: "Meals Per Day record not found.",
          ar: "لم يتم العثور على سجل عدد الوجبات في اليوم",
        },
      };
    }

    // Return success status and the updated details of the MealsPerDay record
    return {
      status: true,
      message: {
        en: "Meals Per Day record updated successfully.",
        ar: "تم تحديث سجل عدد الوجبات في اليوم بنجاح",
      },
    };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in updateMealsPerDayService:", error);
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
 * Service function to delete a specific MealsPerDay record by ID
 * @param {string} mealsPerDayId - ID of the MealsPerDay record to delete
 * @returns {Object} - Result of the operation (status and message)
 */
exports.deleteMealsPerDayService = async (mealsPerDayId) => {
  try {
    // Delete the MealsPerDay record with the specified ID from the database
    const mealsPerDay = await MealsPerDay.findByIdAndDelete(mealsPerDayId);

    // Check if the MealsPerDay record exists
    if (!mealsPerDay) {
      return {
        status: false,
        message: {
          en: "Meals Per Day record not found.",
          ar: "سجل عدد الوجبات في اليوم غير موجود",
        },
      };
    }

    // Return success status and a deletion success message
    return {
      status: true,
      message: {
        en: "Meals Per Day record deleted successfully.",
        ar: "تم حذف سجل عدد الوجبات في اليوم بنجاح",
      },
    };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in deleteMealsPerDayService:", error);
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
 * Service function to get a list of all MealsPerDay records (for admin)
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.getAllMealsPerDayForAdminService = async () => {
  try {
    // Retrieve all MealsPerDay records from the database (including non-visible ones for admin)
    const mealsPerDayListForAdmin = await MealsPerDay.find(
      {},
      { createdAt: 0, updatedAt: 0 }
    ).sort({ meals_count: 1 });

    // Return success status and the list of MealsPerDay records for admin
    return { status: true, data: mealsPerDayListForAdmin };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in getAllMealsPerDayForAdminService:", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

module.exports = exports;
