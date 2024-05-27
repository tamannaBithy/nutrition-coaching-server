const { default: mongoose } = require("mongoose");
const CustomizedMealMenuModel = require("../models/CustomizedMealMenuModel");
const CartListForCustomizedMeal = require("../models/CartListForCustomizedMealModel");
const UserInputsForCustomizedMeal = require("../models/UserInputsForCustomizedMealModel");

/**
 * Service function to add a customized meal to the user's cart.
 * @param {Object} cartData - The data containing the customized meal and day to be added to the cart.
 * @param {string} userId - The ID of the user for whom the meal is being added to the cart.
 * @param {Object} req - The request object containing additional information.
 * @returns {Object} - Result indicating the success status of the operation and a corresponding message.
 */
exports.addToCustomizedMealCartService = async (cartData, userId, req) => {
  try {
    // Extract data from the request body
    const { customizedMealsMenu, day } = cartData;

    // Validate if customizedMealsMenu, quantity, and day are provided
    if (!customizedMealsMenu || !day) {
      return {
        status: false,
        message: {
          en: "Invalid data provided.",
          ar: "البيانات المقدمة غير صالحة",
        },
      };
    }

    // Check if the specified meal is available
    const mealAvailableOrNot = await CustomizedMealMenuModel.findOne({
      _id: customizedMealsMenu,
      visible: true,
    });

    // Return error if meal is not available
    if (!mealAvailableOrNot) {
      return {
        status: false,
        message: {
          en: "This meal isn't available. So you can't add it to the cart",
          ar: "هذه الوجبة غير متوفرة، لذا لا يمكنك إضافتها إلى السلة",
        },
      };
    }

    // Check if the user already has a cart
    let userCart = await CartListForCustomizedMeal.findOne({ user: userId });
    let userDataForMeal = await UserInputsForCustomizedMeal.findOne({
      customer_details: userId,
    });

    const { mealPerDay: maxMealsPerDay, meal_duration_repeat } =
      userDataForMeal;

    // If the user doesn't have a cart, create a new one
    if (!userCart) {
      userCart = new CartListForCustomizedMeal({
        cart_category: "customizeOrder",
        menus: [],
        user: userId,
        order_type: "Customized Meals Orders",
      });
    }

    // Check if the day is already in the cart
    const existingDayIndex = userCart.menus.findIndex(
      (menu) => menu.day === day
    );

    // If the day is already in the cart, check the number of meals
    if (existingDayIndex !== -1) {
      const mealsForDay = userCart.menus[existingDayIndex].meals.length;

      // If the maximum meals per day limit is reached, return error
      if (mealsForDay >= maxMealsPerDay) {
        return {
          status: false,
          message: {
            en: `You can only select ${maxMealsPerDay} meals for day ${day}.`,
            ar: `يمكنك اختيار ${maxMealsPerDay} وجبة فقط لليوم ${day}`,
          },
        };
      }
      // If the limit is not reached, add the meal
      userCart.menus[existingDayIndex].meals.push({
        meal: customizedMealsMenu,
      });
    } else {
      // If the day is not in the cart, add it along with the meal
      userCart.menus.push({
        day,
        meals: [{ meal: customizedMealsMenu }],
      });
    }

    // Check if the total number of days exceeds the maximum duration allowed
    if (userCart.menus.length > meal_duration_repeat) {
      return {
        status: false,
        message: {
          en: `You can only select meals for the first ${meal_duration_repeat} days.`,
          ar: `يمكنك اختيار وجبات فقط للأيام الأولى ${meal_duration_repeat}`,
        },
      };
    }

    // Save the cart to the database
    await userCart.save();

    return {
      status: true,
      message: {
        en: "Item successfully added to the cart",
        ar: "تمت إضافة العنصر بنجاح إلى السلة",
      },
    };
  } catch (error) {
    console.error("Error adding to customized Meal cart", error);
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
 * Service function to delete a meal from the user's customized meal cart.
 * @param {string} cartId - The ID of the cart from which the meal will be deleted.
 * @param {string} mealId - The ID of the meal to be deleted from the cart.
 * @returns {Object} - Result indicating the success status of the operation and a corresponding message.
 */
exports.deleteMealFromCustomizedMealCartService = async (cartId, mealId) => {
  try {
    // Validate if cartId and mealId are provided
    if (
      !mongoose.Types.ObjectId.isValid(cartId) ||
      !mongoose.Types.ObjectId.isValid(mealId)
    ) {
      return {
        status: false,
        message: {
          en: "Invalid cart or meal ID provided.",
          ar: "تم تقديم معرّف سلة أو وجبة طعام غير صالح",
        },
      };
    }

    // Find the user's cart
    const userCart = await CartListForCustomizedMeal.findById({ _id: cartId });

    // If the cart is not found, return an error
    if (!userCart) {
      return {
        status: false,
        message: {
          en: "Cart not found.",
          ar: "السلة غير موجودة",
        },
      };
    }

    // Check if the meal is in the cart
    let mealFound = false;
    for (let i = 0; i < userCart.menus.length; i++) {
      const meals = userCart.menus[i].meals;
      const existingMealIndex = meals.findIndex(
        (meal) => meal._id.toString() === mealId
      );

      if (existingMealIndex !== -1) {
        // Remove the meal from the cart
        meals.splice(existingMealIndex, 1);
        mealFound = true;

        // If there are no meals left for the day, remove the day from the cart
        if (meals.length === 0) {
          userCart.menus.splice(i, 1);
        }
        break;
      }
    }

    // If the meal is not in the cart, return an error
    if (!mealFound) {
      return {
        status: false,
        message: {
          en: "Meal not found in the cart.",
          ar: "الوجبة غير موجودة في السلة",
        },
      };
    }

    // Save the updated cart to the database
    await userCart.save();

    return {
      status: true,
      message: {
        en: "Meal successfully removed from the cart",
        ar: "تمت إزالة الوجبة بنجاح من السلة",
      },
    };
  } catch (error) {
    console.error("Error deleting meal from cart", error);
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
 * Service function to calculate the price of customized meals for a user.
 * @param {string} userId - The ID of the user for whom the price is calculated.
 * @returns {Object} - Result indicating the success status of the operation and a corresponding message.
 */
exports.getPriceOfCustomizedMealService = async (userId) => {
  try {
    // Fetch user data related to customized meals
    const userData = await UserInputsForCustomizedMeal.findOne({
      customer_details: userId,
    });

    // Find the user's customized meal cart
    const userCart = await CartListForCustomizedMeal.findOne({ user: userId });
    const { menus } = userCart;

    // Extract user's protein, fat, and carbs intake from userData
    const { protein: userProtein, fat: userFat, carbs: userCarbs } = userData;

    // Object to store the sum of fatForCurrentMeal for each day
    const allPriceForDay = {};

    // Iterate through each day in the user's cart
    for (const day of menus) {
      const { meals } = day;

      // Get the array of meal IDs for the current day
      const mealIds = meals.map(
        (meal) => new mongoose.Types.ObjectId(meal.meal)
      );

      // Aggregate to calculate total protein, total fadd, total carbs for the day
      const dayAggregation = await CustomizedMealMenuModel.aggregate([
        {
          $match: { _id: { $in: mealIds } },
        },
        {
          $group: {
            _id: null,
            totalProtein: { $sum: "$protein" },
            totalFadd: { $sum: "$fadd" },
            totalCarbs: { $sum: "$carbs" },
          },
        },
      ]);

      // If no meal data found for the current day, return an error
      if (dayAggregation.length === 0) {
        return {
          status: false,
          message: {
            en: "No meal data found for the current day.",
            ar: "لا توجد بيانات عن وجبة لليوم الحالي",
          },
        };
      }

      // Destructure total values from aggregation result
      const {
        totalProtein: totalProteinForDay,
        totalFadd: totalFaddForDay,
        totalCarbs: totalCarbsForDay,
      } = dayAggregation[0];

      // Initialize the sum of fatForCurrentMeal for the current day
      let fatSumForDay = 0;

      // price of fat for day1
      let prFat = 0;
      // price of carb for day1
      let prCarb = 0;
      // price of protein for day1
      let prPro = 0;

      // Iterate through each meal in the day to calculate prices
      for (const meal of meals) {
        const mealData = await CustomizedMealMenuModel.findById(meal.meal);

        if (!mealData) {
          return {
            status: false,
            message: {
              en: "Meal not available. Cannot calculate the price.",
              ar: "الوجبة غير متوفرة. لا يمكن حساب السعر",
            },
          };
        }

        const { protein: mealProtein, fmf } = mealData;

        // Calculate fatForCurrentMeal for the current meal
        const fatForCurrentMeal =
          fmf * (mealProtein / totalProteinForDay) * userProtein;

        // Add the fatForCurrentMeal to the sum for the current day
        fatSumForDay += fatForCurrentMeal;

        meal.quantityOfOil = fatForCurrentMeal;
      }

      // Iterate through each meal in the day
      for (const meal of meals) {
        const mealData = await CustomizedMealMenuModel.findById(meal.meal);

        if (!mealData) {
          return {
            status: false,
            message: {
              en: "Meal not available. Cannot calculate the price.",
              ar: "الوجبة غير متوفرة. لا يمكن حساب السعر",
            },
          };
        }

        const {
          protein: mealProtein,
          carbs: mealCarbs,
          prp,
          prc,
          prf,
          fadd,
          of,
          sf,
          mf,
        } = mealData;

        if (fatSumForDay < userFat) {
          const extraFatPrice =
            prf * (fadd / totalFaddForDay) * (userFat - fatSumForDay);
          prFat += extraFatPrice;
        }

        const carbsForCurrentMeal =
          prc * (mealCarbs / totalCarbsForDay) * userCarbs;

        prCarb += carbsForCurrentMeal;

        const proteinForCurrentMeal =
          prp * (mealProtein / totalProteinForDay) * userProtein;

        prPro += proteinForCurrentMeal;

        // Update fields in the CartListForCustomizedMeal model

        meal.extraOil =
          fatSumForDay < userFat
            ? of * (fadd / totalFaddForDay) * (userFat - fatSumForDay)
            : 0;
        meal.quantityOfStarch = sf * (mealCarbs / totalCarbsForDay) * userCarbs;
        meal.quantityOfMeat =
          mf * (mealProtein / totalProteinForDay) * userProtein;
      }

      // Store the sum of fat, protein, carbs for the current day
      const totalPriceForDay = prFat + prCarb + prPro;
      allPriceForDay[day.day] = {
        fatPrice: prFat,
        proteinPrice: prPro,
        carbsPrice: prCarb,
        totalPrice: totalPriceForDay,
      };

      // Update price_for_specific_day in CartListForCustomizedMeal model
      day.price_for_specific_day = totalPriceForDay;
    }

    // Save the updated CartListForCustomizedMeal model
    const newUserCart = await userCart.save();

    return {
      status: true,
      message: {
        en: "Calculation successful.",
        ar: "تم الحساب بنجاح",
      },
    };
  } catch (error) {
    console.error("Error calculating prices", error);
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
 * Service function to populate meals for the remaining days in a user's customized meal cart.
 * @param {string} userId - The ID of the user for whom meals are being populated.
 * @param {Object} req - The request object containing headers for authorization.
 * @returns {Object} - Result indicating the success status of the operation and a corresponding message.
 */
exports.populateMealsForRemainingDaysService = async (userId, req) => {
  try {
    // Get the user's cart
    let userCart = await CartListForCustomizedMeal.findOne({ user: userId });

    // If user cart not found, return error
    if (!userCart) {
      return {
        status: false,
        message: {
          en: "User cart not found.",
          ar: "سلة المستخدم غير موجودة",
        },
      };
    }

    // Get user's meal duration repeat
    let userDataForMeal = await UserInputsForCustomizedMeal.findOne({
      customer_details: userId,
    });

    const { meal_duration_repeat } = userDataForMeal;

    // Ensure the cart has meals added for the initial days
    if (userCart.menus.length < meal_duration_repeat) {
      return {
        status: false,
        message: {
          en: `You need to add meals for the first ${meal_duration_repeat} days first.`,
          ar: `يجب عليك إضافة وجبات للأيام الأولى ${meal_duration_repeat} أولاً`,
        },
      };
    }

    // Iterate through the remaining days to populate meals
    for (let day = meal_duration_repeat + 1; day <= 7; day++) {
      if (userCart.menus.length >= 7) {
        break; // Exit loop if the cart already has 7 days
      }

      const sourceDayIndex = (day - 1) % meal_duration_repeat; // Calculate the source day index to repeat meals

      // Copy meals from the source day to the current day
      userCart.menus.push({
        day: `day${day}`, // Adjust the day field based on your model
        meals: [...userCart.menus[sourceDayIndex].meals],
      });
    }

    // // Save the updated cart to the database
    await userCart.save();

    // Define the API URL to fetch updated user cart data
    const apiUrl = "http://localhost:8000/api/v1/customizedMeal-price";

    // Define function to fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: req?.headers?.authorization,
          },
        });

        // Throw error if response is not OK
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse response data and return the updated user cart
        const data = await response.json();

        return data.newUserCart;
        // console.log("Data:", data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call the async function
    const updatedUserCart = await fetchData();

    return {
      status: true,
      message: {
        en: "Meals populated for remaining days.",
        ar: "تم تعبئة الوجبات للأيام المتبقية",
      },
    };
  } catch (error) {
    console.error("Error populating meals for remaining days", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

// prFat = total price of fat for dayN
// prCarb = total price of carb for dayN
// prPro = total price of protein for dayN
