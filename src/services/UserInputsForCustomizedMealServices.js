const AdminInputsForCustomizedMeal = require("../models/AdminInputsForCustomizedMealModel");
const NotificationForAdminModel = require("../models/NotificationForAdminModel");
const NotificationModel = require("../models/NotificationsModel");
const UserInputsForCustomizedMeal = require("../models/UserInputsForCustomizedMealModel");
const { calculateCalories } = require("../utils/calculateCalories");

/**
 * Service function to create a customized meal for a user.
 * @param {Object} userData - User input data for the customized meal.
 * @param {string} userId - The ID of the user.
 * @returns {Object} - Result of the customized meal creation process.
 */
async function amountCount(minimum, maximum, comparedAmount) {
  // Function to determine whether the amount is good, not enough, or more than enough
  let amount;

  // Check if comparedAmount falls within the specified range
  if (minimum <= comparedAmount && comparedAmount <= maximum) {
    amount = "good";
  } else if (comparedAmount < minimum) {
    amount = "not enough";
  } else {
    amount = "more than enough";
  }
  return amount;
}

// Exported function to create a customized meal for a user
exports.createUserCustomizedMealService = async (userData, userId, io) => {
  try {
    const { protein, fat, carbs, category } = userData;

    // Check if the user already provided input for a customized meal
    const userAvailability = await UserInputsForCustomizedMeal.findOne({
      customer_details: userId,
    });

    // Fetch minimum and maximum values for meal components
    const allMinMaxData = await AdminInputsForCustomizedMeal.findOne(
      { category },
      {
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    ).lean();

    const allMinMaxDataResult = allMinMaxData || {};

    const {
      calories_divider,
      minimumProtein,
      maximumProtein,
      minimumFat,
      maximumFat,
      minimumCarb,
      maximumCarb,
      minimumCalories,
      maximumCalories,
    } = allMinMaxDataResult;

    // Calculate minimum and maximum ranges for fat and carb based on protein
    const minimumFatRange = minimumFat * protein;
    const maximumFatRange = maximumFat * protein;

    const minimumCarbRange = minimumCarb * protein;
    const maximumCarbRange = maximumCarb * protein;

    // Determine whether protein, fat, and carbs are within acceptable ranges
    const proteinAmount = await amountCount(
      minimumProtein,
      maximumProtein,
      protein
    );
    const fatAmount = await amountCount(minimumFatRange, maximumFatRange, fat);
    const carbAmount = await amountCount(
      minimumCarbRange,
      maximumCarbRange,
      carbs
    );

    // Return error messages if any component exceeds the normal range
    if (proteinAmount === "more than enough") {
      return {
        status: false,
        message: {
          en: "Minimize your protein amount. It exceeds the normal range.",
          ar: "قلل من كمية البروتين. فإنه يتجاوز النطاق الطبيعي",
        },
      };
    } else if (fatAmount === "more than enough") {
      return {
        status: false,
        message: {
          en: "Minimize your fat amount. It exceeds the normal range.",
          ar: "قلل من كمية الدهون. فإنها تتجاوز النطاق الطبيعي",
        },
      };
    } else if (carbAmount === "more than enough") {
      return {
        status: false,
        message: {
          en: "Minimize your carbs amount. It exceeds the normal range.",
          ar: "قلل من كمية الكربوهيدرات. فإنها تتجاوز النطاق الطبيعي",
        },
      };
    }

    // Calculate total calories
    const calories = await calculateCalories(protein, carbs, fat);

    // Determine whether total calories are within acceptable range
    const caloriesAmount = await amountCount(
      minimumCalories,
      maximumCalories,
      calories
    );

    // Calculate meal per day based on calories
    const mealPerDay = Math.round(calories / calories_divider);

    // Create user input for customized meal
    const newUserInputs =
      // userAvailability
      //   ? await UserInputsForCustomizedMeal.findOneAndUpdate(
      //       {
      //         customer_details: userId,
      //       },
      //       {
      //         protein,
      //         fat,
      //         carbs,
      //         category,
      //         customer_details: userId,
      //         calories,
      //         mealPerDay,
      //       }
      //     )
      //   :
      await UserInputsForCustomizedMeal.create({
        protein,
        fat,
        carbs,
        category,
        customer_details: userId,
        calories,
        mealPerDay,
      });

    // Creating notification after successfully placing the order (for customer)
    const notificationForUser = await NotificationModel.create({
      user_id: userId,
      title: {
        en: "Your request has been sent to the admin successfully.",
        ar: "تم إرسال طلبك إلى الإدارة بنجاح",
      },
      description: {
        en: `Your request ID is ${newUserInputs?._id}`,
        ar: `رقم طلبك هو ${newUserInputs?._id}`,
      },
    });

    // Emit an event to notify Customer User about his new request
    io.to(`customerRoom_${userId}`).emit("requestForCustomizedMealUser", {
      message: {
        en: "Your request has been sent to the admin successfully.",
        ar: "تم إرسال طلبك إلى الإدارة بنجاح",
      },
    });

    // Creating notification after successfully requesting a custom meal (for admin)
    const notificationForAdmin = await NotificationForAdminModel.create({
      title: {
        en: "A new request for a customized meal has been received",
        ar: "تم استلام طلب جديد لوجبة مخصصة",
      },
      description: {
        en: `User Inputs ID: ${newUserInputs?._id}`,
        ar: `رقم الطلب: ${newUserInputs?._id}`,
      },
    });

    // Emit an event to notify Admin Users about the new request
    io.to("adminRoom").emit("requestForCustomizedMealAdmin", {
      message: {
        en: "A new request for a customized meal has been received from a user",
        ar: "تم استلام طلب جديد لوجبة مخصصة من مستخدم",
      },
    });

    // Prepare result object
    const result = {
      calories,
      mealPerDay,
    };

    // Return success with result data
    return {
      status: true,
      data: result,
      message: {
        en: "Your meal request posted successfully.",
        ar: "تم نشر طلب الوجبة الخاص بك بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
    // Return error if something went wrong
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

exports.getUserCustomizedMealService = async (userId) => {
  try {
    // Check if the user already provided input for a customized meal
    const userAvailability = await UserInputsForCustomizedMeal.findOne({
      customer_details: userId,
    });

    // Return success with result data
    return {
      status: true,
      message: {
        en: "User data already exist.",
        ar: "تم نشر طلب الوجبة الخاص بك بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
    // Return error if something went wrong
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};
