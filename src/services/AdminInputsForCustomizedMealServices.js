const AdminInputsForCustomizedMeal = require("../models/AdminInputsForCustomizedMealModel");
const NotificationModel = require("../models/NotificationsModel");
const UserInputsForCustomizedMeal = require("../models/UserInputsForCustomizedMealModel");
const UserModel = require("../models/UserModel");

/**
 * Service function to create admin-customized meal data.
 * @param {Object} adminData - Data for the customized meal created by the admin.
 * @returns {Object} - Result of the operation, including the status and message.
 */
exports.createAdminCustomizedMealService = async (adminData) => {
  try {
    const { category } = adminData;

    const existingCategory = await AdminInputsForCustomizedMeal.findOne({
      category,
    });

    // If customized meal data already exists, return an error message
    if (existingCategory) {
      return {
        status: false,
        message: {
          en: "Customized Meal record in this category already exists. You cannot create another one.",
          ar: "السجل المخصص للوجبة موجود بالفعل. لا يمكنك إنشاء واحد آخر",
        },
      };
    }

    // Create a new customized meal record with the provided admin data
    const newMealData = await AdminInputsForCustomizedMeal.create(adminData);

    // Return success message upon successful creation
    return {
      status: true,
      message: {
        en: "Admin created Customized Meal data successfully.",
        ar: "تم إنشاء بيانات وجبة مخصصة بواسطة المسؤول بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
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
 * Service function to update admin-customized meal data.
 * @param {Object} updatedData - Updated data for the customized meal.
 * @returns {Object} - Result of the operation, including the status and message.
 */
exports.updateAdminCustomizedMealService = async (updatedData) => {
  try {
    // Check if there is an existing record to update
    const existingMealData = await AdminInputsForCustomizedMeal.findOne();

    if (!existingMealData) {
      return {
        status: false,
        message: {
          en: "No existing Customized Meal record found for update.",
          ar: "لم يتم العثور على سجل وجبة مخصصة موجود للتحديث",
        },
      };
    }

    // Update the existing record with the provided updated data
    Object.assign(existingMealData, updatedData);

    // Save the updated record
    await existingMealData.save();

    return {
      status: true,
      message: {
        en: "Admin Customized Meal data updated successfully.",
        ar: "قام المسؤول بتحديث بيانات الوجبة المخصصة بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
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
 * Service function to retrieve all user meal inputs with pagination.
 * @param {Object} req - Express request object containing query parameters for pagination.
 * @returns {Object} - Result of the operation, including the status, data, pagination information, and messages.
 */
exports.getAllUserMealsInputService = async (req) => {
  try {
    // Extracting page and limit from the request query parameters or using default values
    const pageNo = parseInt(req?.query?.pageNo) || 1;
    const showPerPage = parseInt(req?.query?.showPerPage) || 10;
    const skip = (pageNo - 1) * showPerPage;

    // Counting total documents in the UserInputsForCustomizedMeal collection
    const totalDataCount = await UserInputsForCustomizedMeal.countDocuments();

    // MongoDB aggregation pipeline stages for data retrieval and formatting
    const lookupStageOne = {
      $lookup: {
        from: "profiles",
        localField: "customer_details",
        foreignField: "user_Id",
        as: "profile",
      },
    };

    const unwindStageOne = {
      $unwind: {
        path: "$profile",
        preserveNullAndEmptyArrays: true,
      },
    };

    const lookupStageTwo = {
      $lookup: {
        from: "users",
        localField: "customer_details",
        foreignField: "_id",
        as: "user",
      },
    };

    const unwindStageTwo = {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    };

    const projectStage = {
      $project: {
        _id: 1,
        protein: 1,
        fat: 1,
        carbs: 1,
        order_confirmation_status: 1,
        meal_duration_repeat: 1,
        ordered_meals_type: 1,
        calories: 1,
        mealPerDay: 1,
        customer_data: {
          // Merging profile and user data into a single "customer_data" object
          $mergeObjects: ["$profile", "$user"],
        },
      },
    };

    // Stage to unset specific fields from the profile object
    const unsetStage = {
      $unset: [
        "customer_data.user_Id",
        "customer_data.password",
        "customer_data.father_name",
        "customer_data.grandfather_name",
        "customer_data.date_of_birth",
        "customer_data.province",
        "customer_data.district",
        "customer_data.locality",
        "customer_data.neighborhood",
        "customer_data.alley",
        "customer_data.house_number",
        "customer_data.notifications",
        "customer_data.createdAt",
        "customer_data.updatedAt",
      ],
    };

    // Aggregating data using the defined pipeline stages
    const allUserMealsInput = await UserInputsForCustomizedMeal.aggregate([
      lookupStageOne,
      unwindStageOne,
      lookupStageTwo,
      unwindStageTwo,
      projectStage,
      unsetStage,
      { $skip: skip },
      { $limit: showPerPage },
    ]);

    // Calculating pagination-related values
    const totalPages = Math.ceil(totalDataCount / showPerPage);
    const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);
    const startItem = (pageNo - 1) * showPerPage + 1;
    const endItem = Math.min(pageNo * showPerPage, totalDataCount);
    const currentPage = pageNo;

    // Returning the formatted result
    return {
      success: true,
      data: allUserMealsInput,
      totalDataCount,
      totalPages: pageArray,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: `عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
      currentPage,
    };
  } catch (error) {
    console.error(error);
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
 * Service function to update the meal duration repeat for a user's customized meal.
 * @param {Object} updatedData - Updated data containing the meal duration repeat.
 * @param {string} mealId - ID of the meal to update.
 * @returns {Object} - Result of the update operation, including status and messages.
 */
exports.updateMealDurationService = async (updatedData, mealId, io) => {
  try {
    // Check if there is an existing record to update
    const existingMealData = await UserInputsForCustomizedMeal.findById(mealId);

    if (!existingMealData) {
      return {
        status: false,
        message: {
          en: "No existing Customized Meal record found for update",
          ar: "لم يتم العثور على سجل وجبة مخصصة موجود للتحديث",
        },
      };
    }

    // Check if meal duration repeat field is present in the updated data
    if ("meal_duration_repeat" in updatedData) {
      // Update meal_duration_repeat if present
      if ("meal_duration_repeat" in updatedData) {
        existingMealData.meal_duration_repeat =
          updatedData.meal_duration_repeat;
      }

      // Save the updated record
      await existingMealData.save();

      return {
        status: true,
        message: {
          en: "Admin updated meal data successfully",
          ar: "قام المسؤول بتحديث بيانات الوجبة بنجاح",
        },
      };

      // Creating notification after successfully updating the customized meal request by the admin(for customer)
      const notificationForUser = await NotificationModel.create({
        user_id: existingMealData.customer_details,
        title: {
          en: "Your request has been processed by the admin.",
          ar: "تم معالجة طلبك من قبل المشرف",
        },
        description: {
          en: "Now you can select meals for your customized meal plan.",
          ar: "يمكنك الآن اختيار الوجبات لخطتك المخصصة",
        },
      });

      // Emit an event to notify Customer User about his new request
      io.to(`customerRoom_${existingMealData.customer_details}`).emit(
        "customizedMealConfirmed",
        {
          message: {
            en: "Your request has been processed by the admin.",
            ar: "تم معالجة طلبك من قبل المشرف",
          },
        }
      );
    } else {
      return {
        status: false,
        message: {
          en: "Meal duration repeat field is required for update.",
          ar: "حقل تكرار مدة الوجبة مطلوب للتحديث",
        },
      };
    }
  } catch (error) {
    console.error(error);
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
 * Service function to delete a user meal input by ID.
 * @param {string} id - ID of the user meal input to delete.
 * @param {Object} io - Socket.io instance to emit notifications.
 * @returns {Object} - Result of the deletion operation, including status and messages.
 */
exports.deleteUserMealInputService = async (id, io) => {
  try {
    // Attempt to delete the user meal input by ID
    const deletedMealInput = await UserInputsForCustomizedMeal.findById(id);

    if (!deletedMealInput) {
      return {
        status: false,
        message: {
          en: "No user meal input found with the provided ID.",
          ar: "لم يتم العثور على بيانات وجبة المستخدم بالمعرف المقدم",
        },
      };
    }

    // Delete the user meal input
    await UserInputsForCustomizedMeal.deleteOne({ _id: id });

    // Emit a notification to the specific user upon successful deletion
    const notificationMessage = {
      en: "Your meal input has been deleted.",
      ar: "تم حذف بيانات وجبتك",
    };

    io.to(`customerRoom_${deletedMealInput.customer_details}`).emit(
      "mealInputDeleted",
      { message: notificationMessage }
    );

    // Create a notification for the user
    const notificationForUser = await NotificationModel.create({
      user_id: deletedMealInput.customer_details,
      title: {
        en: "Your meal input has been deleted.",
        ar: "تم حذف بيانات وجبتك",
      },
      description: {
        en: "One of your meal inputs has been deleted.",
        ar: "تم حذف إحدى بيانات وجباتك",
      },
    });

    // Return success message upon successful deletion
    return {
      status: true,
      message: {
        en: "User meal input deleted successfully.",
        ar: "تم حذف بيانات وجبة المستخدم بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: {
        en: "An error occurred while deleting the user meal input.",
        ar: "حدث خطأ أثناء حذف بيانات وجبة المستخدم",
      },
    };
  }
};
