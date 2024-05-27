const NumberOfDays = require("../models/NumberOfDaysModel");

/**
 * Service function to create a new Number of Days Record
 * @param {string} user_id - ID of the user creating the record
 * @param {Object} numberOfDaysData - Data for the new Number of Days Record
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.createNumberOfDaysService = async (user_id, numberOfDaysData) => {
  try {
    const { days_number, visible } = numberOfDaysData;

    // Check if a Number of Days Record with the same number exists for the user
    const existingNumberOfDays = await NumberOfDays.findOne({
      days_number,
    });

    // If an existing record is found, return an error
    if (existingNumberOfDays) {
      return {
        status: false,
        message: {
          en: "Number of days with the same number already exists.",
          ar: "عدد الأيام بنفس الرقم موجود بالفعل",
        },
      };
    }

    // Create a new Number of Days Record using the provided data
    const numberOfDays = new NumberOfDays({
      days_number,
      visible,
      created_by: user_id,
    });

    // Save the new Number of Days Record to the database
    await numberOfDays.save();

    // Return success status and the created Number of Days Record
    return {
      status: true,
      message: {
        en: "Number of days created successfully.",
        ar: "تم إنشاء عدد الأيام بنجاح",
      },
    };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in createNumberOfDaysService:", error);
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
 * Service function to get a list of all Number of Days Records
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.getAllNumberOfDaysService = async () => {
  try {
    // Retrieve all Number of Days Records from the database
    const numberOfDaysList = await NumberOfDays.find(
      { visible: true },
      { days_number: 1, _id: 0 }
    ).sort({ days_number: 1 });

    // Return success status and the list of Number of Days Records
    return { status: true, data: numberOfDaysList };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in getAllNumberOfDaysService:", error);
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
 * Service function to get details of a specific Number of Days Record by ID
 * @param {string} numberOfDaysId - ID of the Number of Days Record to retrieve
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.getNumberOfDaysByIdService = async (numberOfDaysId) => {
  try {
    // Retrieve the Number of Days Record with the specified ID from the database
    const numberOfDays = await NumberOfDays.findById(numberOfDaysId, {
      createdAt: 0,
      updatedAt: 0,
    });

    // Check if the Number of Days Record exists
    if (!numberOfDays) {
      return {
        status: false,
        message: {
          en: "Number of Days Record not found.",
          ar: "لم يتم العثور على سجل عدد الأيام",
        },
      };
    }

    // Return success status and the details of the Number of Days Record
    return { status: true, data: numberOfDays };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in getNumberOfDaysByIdService:", error);
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
 * Service function to update details of a specific Number of Days Record by ID
 * @param {string} numberOfDaysId - ID of the Number of Days Record to update
 * @param {Object} updateData - Data to update the Number of Days Record
 * @returns {Object} - Result of the operation (status and data/message)
 */
exports.updateNumberOfDaysService = async (numberOfDaysId, updateData) => {
  try {
    // Update the Number of Days Record with the specified ID using the provided data
    const numberOfDays = await NumberOfDays.findByIdAndUpdate(
      numberOfDaysId,
      updateData
    );

    // Check if the Number of Days Record exists
    if (!numberOfDays) {
      return {
        status: false,
        message: {
          en: "Number of Days Record not found.",
          ar: "لم يتم العثور على سجل عدد الأيام",
        },
      };
    }

    // Return success status and the updated details of the Number of Days Record
    return {
      status: true,
      message: {
        en: "Number of Days Record updated successfully.",
        ar: "تم تحديث سجل عدد الأيام بنجاح",
      },
    };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in updateNumberOfDaysService:", error);
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
 * Service function to delete a specific Number of Days Record by ID
 * @param {string} numberOfDaysId - ID of the Number of Days Record to delete
 * @returns {Object} - Result of the operation (status and message)
 */
exports.deleteNumberOfDaysService = async (numberOfDaysId) => {
  try {
    // Delete the Number of Days Record with the specified ID from the database
    const numberOfDays = await NumberOfDays.findByIdAndDelete(numberOfDaysId);

    // Check if the Number of Days Record exists
    if (!numberOfDays) {
      return {
        status: false,
        message: {
          en: "Number of Days Record not found.",
          ar: "سجل عدد الأيام غير موجود",
        },
      };
    }

    // Return success status and a deletion success message
    return {
      status: true,
      message: {
        en: "Number of Days Record deleted successfully.",
        ar: "تم حذف سجل عدد الأيام بنجاح",
      },
    };
  } catch (error) {
    // Handle any unexpected errors and return failure status
    console.error("Error in deleteNumberOfDaysService:", error);
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
 * Service function to get all Days for Admin.
 * @returns {Object} - Result containing information about all days for admin.
 */
exports.getAllDaysForAdminService = async () => {
  try {
    const numberOfDaysList = await NumberOfDays.find({}).sort({
      days_number: 1,
    });
    return { status: true, data: numberOfDaysList };
  } catch (error) {
    console.error("Error getting all days for admin:", error);
    return {
      status: false,
      message: {
        en: "Failed to get all days for admin.",
        ar: "فشل في الحصول على جميع الأيام للمسؤول",
      },
    };
  }
};

module.exports = exports;
