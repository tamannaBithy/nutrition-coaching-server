const { default: mongoose } = require("mongoose");
const CartListForMainMealMenu = require("../models/CartListForMainMealMenuModel");
const CartListForOfferedMealMenu = require("../models/CartListForOfferedMealMenuModel");
const MainMealMenuModel = require("../models/MainMealMenuModel");
const OfferedMealMenuModel = require("../models/OfferedMealMenuModel");
const DiscountModel = require("../models/DiscountModel");
const CartListForCustomizedMeal = require("../models/CartListForCustomizedMealModel");
const NumberOfDays = require("../models/NumberOfDaysModel");

/**
 * Service function to add a Main Meal to the user's cart.
 * @param {Object} cartData - The data for adding a Main Meal to the cart.
 * @param {string} userId - The ID of the user adding the meal to the cart.
 * @returns {Object} - Result of adding the Main Meal to the cart.
 */
exports.addToMainMealCartService = async (cartData, userId) => {
  try {
    // Extract data from the request body
    const { mainMealsMenu, quantity } = cartData;

    // Validate if mainMealsMenu and quantity are provided
    if (!mainMealsMenu || !quantity || quantity <= 0) {
      return {
        status: false,
        message: {
          en: "Invalid data provided.",
          ar: "البيانات التي تم تقديمها غير صالحة",
        },
      };
    }

    const mealAvailableOrNot = await MainMealMenuModel.findOne({
      _id: mainMealsMenu,
      visible: true,
    });

    // checking if the meal is available or not
    if (!mealAvailableOrNot) {
      return {
        status: false,
        message: {
          en: "This meal isn't available. So you can't add it to the cart",
          ar: "هذه الوجبة غير متوفرة. لذلك لا يمكنك إضافتها إلى السلة",
        },
      };
    }

    const mealsPerDayAsPerQuantity = await NumberOfDays.findOne({
      days_number: quantity,
      visible: true,
    });

    // checking if the incoming meal's quantity is available or not
    if (!mealsPerDayAsPerQuantity) {
      return {
        status: false,
        message: {
          en: "The number of quantity isn't available",
          ar: "عدد الكمية غير متوفر",
        },
      };
    }

    // Check if the user already has a cart
    let userCart = await CartListForMainMealMenu.findOne({ user: userId });

    // If the user doesn't have a cart, create a new one
    if (!userCart) {
      userCart = new CartListForMainMealMenu({
        cart_category: "mainMenu",
        menus: [],
        user: userId,
        order_type: "Preference Meals Orders",
      });
    }

    // Check if the menu is already in the cart
    const existingMenuIndex = userCart.menus.findIndex(
      (menu) => menu.mainMealsMenu.toString() === mainMealsMenu
    );

    // If the menu is already in the cart, update the quantity
    if (existingMenuIndex !== -1) {
      userCart.menus[existingMenuIndex].quantity = quantity;
    } else {
      // If the menu is not in the cart, add it
      userCart.menus.push({ mainMealsMenu, quantity });
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
    console.error("Error adding to Main Meal cart", error);
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
 * Service function to add an Offered Meal to the user's cart.
 * @param {Object} cartData - The data for adding an Offered Meal to the cart.
 * @param {string} userId - The ID of the user adding the meal to the cart.
 * @returns {Object} - Result of adding the Offered Meal to the cart.
 */
exports.addToOfferedMealCartService = async (cartData, userId) => {
  try {
    // Extract data from the request body
    const { offeredMealsMenu, quantity } = cartData;

    // Validate if offeredMealsMenu and quantity are provided
    if (!offeredMealsMenu || !quantity || quantity <= 0) {
      return {
        status: false,
        message: {
          en: "Invalid data provided.",
          ar: "تم تقديم بيانات غير صالحة",
        },
      };
    }

    const mealAvailableOrNot = await OfferedMealMenuModel.findOne({
      _id: offeredMealsMenu,
      visible: true,
    });

    if (!mealAvailableOrNot) {
      return {
        status: false,
        message: {
          en: "This meal isn't available. So you can't add it to the cart",
          ar: "هذه الوجبة غير متوفرة. لذلك لا يمكنك إضافتها إلى السلة",
        },
      };
    }

    // Check if the user already has a cart
    let userCart = await CartListForOfferedMealMenu.findOne({ user: userId });

    // If the user doesn't have a cart, create a new one
    if (!userCart) {
      userCart = new CartListForOfferedMealMenu({
        cart_category: "offers",
        menus: [],
        user: userId,
        ordered_meals_type: "Offered Meals Orders",
      });
    }

    // Check if the menu is already in the cart
    const existingMenuIndex = userCart.menus.findIndex(
      (menu) => menu.offeredMealsMenu.toString() === offeredMealsMenu
    );

    // If the menu is already in the cart, update the quantity
    if (existingMenuIndex !== -1) {
      userCart.menus[existingMenuIndex].quantity = quantity;
    } else {
      // If the menu is not in the cart, add it
      userCart.menus.push({ offeredMealsMenu, quantity });
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
    console.error("Error adding to Offered Meal cart", error);
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
 * Service function to get all carts for a user with aggregated prices.
 * @param {string} userId - The ID of the user to get carts for.
 * @returns {Object} - Result containing data of all carts for the user with aggregated prices.
 */
exports.getAllCartsService = async (userId) => {
  try {
    // Aggregation for Main Meal cart
    const mainMealCartAggregation = [
      {
        $match: { user: userId },
      },
      {
        $unwind: "$menus",
      },
      {
        $lookup: {
          from: "mainmealmenus",
          localField: "menus.mainMealsMenu",
          foreignField: "_id",
          as: "mealDetails",
        },
      },
      {
        $match: {
          "mealDetails.visible": true,
        },
      },
      {
        $addFields: {
          "menus.sub_total": {
            $multiply: [
              { $arrayElemAt: ["$mealDetails.regular_price", 0] },
              "$menus.quantity",
            ],
          },
          "menus.mealDetails": { $arrayElemAt: ["$mealDetails", 0] },
        },
      },
      {
        $lookup: {
          from: "mealpreferences",
          localField: "menus.mealDetails.preference",
          foreignField: "_id",
          as: "menus.mealDetails.preferenceInfo",
        },
      },
      {
        $addFields: {
          "menus.mealDetails.meal_name": {
            $toUpper: "$menus.mealDetails.meal_name",
          },
        },
      },
      {
        $addFields: {
          "menus.mealDetails.preference": {
            $toUpper: {
              $arrayElemAt: ["$menus.mealDetails.preferenceInfo.preference", 0],
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          cart_category: { $first: "$cart_category" },
          order_type: { $first: "$order_type" },
          menus: { $push: "$menus" },
          subtotal: { $sum: "$menus.sub_total" },
        },
      },
      {
        $lookup: {
          from: "discounts",
          let: { subtotal: "$subtotal", category: "$cart_category" },
          pipeline: [
            {
              $unwind: "$ranges",
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$category", "$$category"] },
                    { $gte: ["$$subtotal", "$ranges.min"] },
                    { $lte: ["$$subtotal", "$ranges.max"] },
                    { $eq: ["$ranges.isActive", true] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                discount: {
                  $cond: [
                    { $gt: ["$ranges.percentage", 0] },
                    { $multiply: ["$$subtotal", "$ranges.percentage", 0.01] },
                    0,
                  ],
                },
                discountPercentage: "$ranges.percentage",
              },
            },
          ],
          as: "discountInfo",
        },
      },
      {
        $addFields: {
          discount: { $ifNull: [{ $sum: "$discountInfo.discount" }, 0] },
          discountPercentage: {
            $ifNull: [{ $max: "$discountInfo.discountPercentage" }, 0],
          },
          subtotalAfterDiscount: {
            $subtract: ["$subtotal", { $sum: "$discountInfo.discount" }],
          },
        },
      },
      {
        $project: {
          user: 0,
          "menus.mainMealsMenu": 0,
          "menus._id": 0,
          "menus.mealDetails.type_of_meal": 0,
          "menus.mealDetails.main_badge_tag": 0,
          "menus.mealDetails.tags": 0,
          "menus.mealDetails.protein": 0,
          "menus.mealDetails.fat": 0,
          "menus.mealDetails.carbs": 0,
          "menus.mealDetails.calories": 0,
          "menus.mealDetails.nutrition_facts": 0,
          "menus.mealDetails.ingredients": 0,
          "menus.mealDetails.heating_instruction": 0,
          "menus.mealDetails.created_by": 0,
          "menus.mealDetails.createdAt": 0,
          "menus.mealDetails.updatedAt": 0,
          "menus.mealDetails.preferenceInfo": 0,
          "menus.mealDetails.lang": 0,
          discountInfo: 0,
        },
      },
    ];

    // Aggregation for Offered Meal cart
    const offeredMealCartAggregation = [
      {
        $match: { user: userId },
      },
      {
        $unwind: "$menus",
      },
      {
        $lookup: {
          from: "offeredmealmenus",
          localField: "menus.offeredMealsMenu",
          foreignField: "_id",
          as: "mealDetails",
        },
      },
      {
        $match: {
          "mealDetails.visible": true,
        },
      },
      {
        $addFields: {
          "menus.sub_total": {
            $multiply: [
              { $arrayElemAt: ["$mealDetails.price", 0] },
              "$menus.quantity",
            ],
          },
          "menus.mealDetails": { $arrayElemAt: ["$mealDetails", 0] },
        },
      },
      {
        $addFields: {
          "menus.mealDetails.category": {
            $toUpper: "$menus.mealDetails.category",
          },
          "menus.mealDetails.package_name": {
            $toUpper: "$menus.mealDetails.package_name",
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          cart_category: { $first: "$cart_category" },
          ordered_meals_type: { $first: "$ordered_meals_type" },
          menus: { $push: "$menus" },
          subtotal: { $sum: "$menus.sub_total" },
        },
      },
      {
        $lookup: {
          from: "discounts",
          let: { subtotal: "$subtotal", category: "$cart_category" },
          pipeline: [
            {
              $unwind: "$ranges",
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$category", "$$category"] },
                    { $gte: ["$$subtotal", "$ranges.min"] },
                    { $lte: ["$$subtotal", "$ranges.max"] },
                    { $eq: ["$ranges.isActive", true] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                discount: {
                  $cond: [
                    { $gt: ["$ranges.percentage", 0] },
                    { $multiply: ["$$subtotal", "$ranges.percentage", 0.01] },
                    0,
                  ],
                },
                discountPercentage: "$ranges.percentage",
              },
            },
          ],
          as: "discountInfo",
        },
      },
      {
        $addFields: {
          discount: { $ifNull: [{ $sum: "$discountInfo.discount" }, 0] },
          discountPercentage: {
            $ifNull: [{ $max: "$discountInfo.discountPercentage" }, 0],
          },
          subtotalAfterDiscount: {
            $subtract: ["$subtotal", { $sum: "$discountInfo.discount" }],
          },
        },
      },
      {
        $project: {
          user: 0,
          "menus.offeredMealsMenu": 0,
          "menus._id": 0,
          "menus.mealDetails.meals": 0,
          "menus.mealDetails.tags": 0,
          "menus.mealDetails.created_by": 0,
          "menus.mealDetails.createdAt": 0,
          "menus.mealDetails.updatedAt": 0,
          "menus.mealDetails.lang": 0,
          discountInfo: 0,
        },
      },
    ];

    // Aggregation for customized meal cart
    const customizedMealCartAggregation = [
      {
        $match: { user: userId },
      },
      {
        $unwind: "$menus",
      },
      {
        $unwind: "$menus.meals",
      },
      {
        $lookup: {
          from: "customizedmealmenus",
          localField: "menus.meals.meal",
          foreignField: "_id",
          as: "mealDetails",
        },
      },
      {
        $unwind: "$mealDetails",
      },
      {
        $match: {
          "mealDetails.visible": true,
        },
      },
      {
        $addFields: {
          "mealDetails.meal_name": {
            $concat: [
              { $toUpper: { $substrCP: ["$mealDetails.meal_name", 0, 1] } },
              {
                $substrCP: [
                  "$mealDetails.meal_name",
                  1,
                  { $subtract: [{ $strLenCP: "$mealDetails.meal_name" }, 1] },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            cart_category: "$cart_category",
            user: "$user",
            order_type: "$order_type",
            day: "$menus.day",
          },
          meals: {
            $push: {
              meal: "$mealDetails",
              quantityOfOil: "$menus.meals.quantityOfOil",
              extraOil: "$menus.meals.extraOil",
              quantityOfStarch: "$menus.meals.quantityOfStarch",
              quantityOfMeat: "$menus.meals.quantityOfMeat",
              mealId: "$menus.meals._id",
            },
          },
          price_for_specific_day: { $first: "$menus.price_for_specific_day" },
        },
      },
      {
        $group: {
          _id: {
            _id: "$_id._id",
            cart_category: "$_id.cart_category",
            user: "$_id.user",
            order_type: "$_id.order_type",
          },
          mealsByDay: {
            $push: {
              day: "$_id.day",
              meals: "$meals",
              price_for_specific_day: "$price_for_specific_day",
            },
          },
          subtotal: { $sum: "$price_for_specific_day" },
        },
      },
      {
        $lookup: {
          from: "discounts",
          let: { subtotal: "$subtotal", category: "$_id.cart_category" },
          pipeline: [
            {
              $unwind: "$ranges",
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$category", "$$category"] },
                    { $gte: ["$$subtotal", "$ranges.min"] },
                    { $lte: ["$$subtotal", "$ranges.max"] },
                    { $eq: ["$ranges.isActive", true] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                discount: {
                  $cond: [
                    { $gt: ["$ranges.percentage", 0] },
                    { $multiply: ["$$subtotal", "$ranges.percentage", 0.01] },
                    0,
                  ],
                },
                discountPercentage: "$ranges.percentage",
              },
            },
          ],
          as: "discountInfo",
        },
      },
      {
        $addFields: {
          discount: { $ifNull: [{ $sum: "$discountInfo.discount" }, 0] },
          discountPercentage: {
            $ifNull: [{ $max: "$discountInfo.discountPercentage" }, 0],
          },
          subtotalAfterDiscount: {
            $subtract: ["$subtotal", { $sum: "$discountInfo.discount" }],
          },
        },
      },
      {
        $project: {
          mealsByDay: 1,
          subtotal: 1,
          discount: 1,
          discountPercentage: 1,
          subtotalAfterDiscount: 1,
        },
      },
    ];

    // Execute aggregations
    const mainMealCart = await CartListForMainMealMenu.aggregate(
      mainMealCartAggregation
    );
    const offeredMealCart = await CartListForOfferedMealMenu.aggregate(
      offeredMealCartAggregation
    );

    const customizedMealCart = await CartListForCustomizedMeal.aggregate(
      customizedMealCartAggregation
    );

    // Calculate Grand Total
    const grandTotal =
      (mainMealCart[0]?.subtotalAfterDiscount || 0) +
      (offeredMealCart[0]?.subtotalAfterDiscount || 0) +
      (customizedMealCart[0]?.subtotalAfterDiscount || 0);

    // Aggregation pipeline to fetch and sort active discounts based on the min value within ranges
    const discountForGrandTotal = await DiscountModel.aggregate([
      {
        $match: { category: "totalOrder" },
      },
      {
        $project: {
          category: 1,
          ranges: {
            $filter: {
              input: "$ranges",
              as: "range",
              cond: { $eq: ["$$range.isActive", true] },
            },
          },
          created_by: 1,
        },
      },
      {
        $unwind: "$ranges",
      },
      {
        $sort: { "ranges.min": 1 },
      },
      {
        $group: {
          _id: "$_id",
          category: { $first: "$category" },
          ranges: { $push: "$ranges" },
          created_by: { $first: "$created_by" },
        },
      },
      {
        $project: {
          _id: 1,
          category: 1,
          ranges: {
            $map: {
              input: "$ranges",
              as: "range",
              in: {
                min: "$$range.min",
                max: "$$range.max",
                percentage: "$$range.percentage",
                isActive: "$$range.isActive",
                discountAmount: {
                  $cond: [
                    {
                      $and: [
                        { $gte: [grandTotal, "$$range.min"] },
                        { $lte: [grandTotal, "$$range.max"] },
                      ],
                    },
                    { $multiply: [grandTotal, "$$range.percentage", 0.01] },
                    0,
                  ],
                },
              },
            },
          },
          created_by: 1,
        },
      },
    ]);

    // Extract discount details
    const discountDetails = discountForGrandTotal[0]?.ranges.find(
      (range) => range.discountAmount > 0
    );

    // Calculate grandTotalAfterDiscount
    const grandTotalAfterDiscount =
      grandTotal - (discountDetails?.discountAmount || 0);

    // Calculate the discount(on grand total)
    const discount = discountDetails?.discountAmount || 0;

    // Extract discount percentage
    const discountPercentageOnGrandTotal = discountDetails?.percentage || 0;

    return {
      status: true,
      data: {
        mainMealCart,
        offeredMealCart,
        customizedMealCart,
        grandTotal,
        discount,
        discountPercentageOnGrandTotal,
        grandTotalAfterDiscount,
      },
    };
  } catch (error) {
    console.error("Error fetching carts", error);
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
 * Service function to delete a Main Meal from the user's cart.
 * @param {string} cartId - The ID of the user's cart.
 * @param {string} menuId - The ID of the Main Meal to be deleted.
 * @returns {Object} - Result of deleting the Main Meal from the cart.
 */
exports.deleteMealFromMainMealCartService = async (cartId, menuId) => {
  try {
    // Validate if cartId and menuId are provided
    if (
      !mongoose.Types.ObjectId.isValid(cartId) ||
      !mongoose.Types.ObjectId.isValid(menuId)
    ) {
      return {
        status: false,
        message: {
          en: "Invalid cart or menu ID provided.",
          ar: "تم تقديم معرف سلة أو قائمة طعام غير صالح",
        },
      };
    }

    // Find the user's cart
    const userCart = await CartListForMainMealMenu.findById(cartId);

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

    // Check if the menu is in the cart
    const existingMenuIndex = userCart.menus.findIndex(
      (menu) => menu.mainMealsMenu.toString() === menuId
    );

    // If the menu is not in the cart, return an error
    if (existingMenuIndex === -1) {
      return {
        status: false,
        message: {
          en: "Menu not found in the cart.",
          ar: "القائمة غير موجودة في السلة",
        },
      };
    }

    // Remove the menu from the cart
    userCart.menus.splice(existingMenuIndex, 1);

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
    console.error("Error deleting Main Meal from cart", error);
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
 * Service function to delete an Offered Meal from the user's cart.
 * @param {string} cartId - The ID of the user's cart.
 * @param {string} menuId - The ID of the Offered Meal to be deleted.
 * @returns {Object} - Result of deleting the Offered Meal from the cart.
 */
exports.deleteMealFromOfferedMealCartService = async (cartId, menuId) => {
  try {
    // Validate if cartId and menuId are provided
    if (
      !mongoose.Types.ObjectId.isValid(cartId) ||
      !mongoose.Types.ObjectId.isValid(menuId)
    ) {
      return {
        status: false,
        message: {
          en: "Invalid cart or menu ID provided.",
          ar: "تم تقديم معرّف سلة أو قائمة طعام غير صالح",
        },
      };
    }

    // Find the user's cart
    const userCart = await CartListForOfferedMealMenu.findById(cartId);

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

    // Check if the menu is in the cart
    const existingMenuIndex = userCart.menus.findIndex(
      (menu) => menu.offeredMealsMenu.toString() === menuId
    );

    // If the menu is not in the cart, return an error
    if (existingMenuIndex === -1) {
      return {
        status: false,
        message: {
          en: "Menu not found in the cart.",
          ar: "القائمة غير موجودة في السلة",
        },
      };
    }

    // Remove the menu from the cart
    userCart.menus.splice(existingMenuIndex, 1);

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
    console.error("Error deleting Offered Meal from cart", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};
