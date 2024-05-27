const CartListForCustomizedMeal = require("../models/CartListForCustomizedMealModel");
const CartListForMainMealMenu = require("../models/CartListForMainMealMenuModel");
const CartListForOfferedMealMenu = require("../models/CartListForOfferedMealMenuModel");
const DiscountModel = require("../models/DiscountModel");
const MealsPerDay = require("../models/MealsPerDayModel");
const NotificationModel = require("../models/NotificationsModel");
const NumberOfDays = require("../models/NumberOfDaysModel");
const OrderListModel = require("../models/OrderListModel");
const ProfileModel = require("../models/ProfileModel");
const UserModel = require("../models/UserModel");

/**
 * Service function to place a new order.
 * @param {Object} orderDetails - The details of the order.
 * @param {string} userId - The ID of the user placing the order.
 * @param {Object} io - Socket.io instance to emit notifications.
 * @returns {Object} - Result containing information about the placed order.
 */
exports.placeOrderService = async (dataFromFrontend, userId, io) => {
  try {
    /* Extracting the values from the request body */
    const {
      note_from_user,
      delivery_address,
      payment_method,
      /* number_of_meals_per_day and plan_duration only for the main meals*/
      number_of_meals_per_day,
      plan_duration,
    } = dataFromFrontend || {};

    /* Converting those into integer value */
    const numberOfMealPerDay = parseInt(number_of_meals_per_day);
    const planDuration = parseInt(plan_duration);

    // Check if number_of_meals_per_day is provided
    if (numberOfMealPerDay) {
      // Check if the specified number of meals per day exists in the database
      const existOrNotMeals = await MealsPerDay.findOne({
        meals_count: numberOfMealPerDay,
        visible: true,
      });

      // If the specified number of meals per day doesn't exist, return an error message
      if (!existOrNotMeals) {
        return {
          status: false,
          message: {
            en: `${numberOfMealPerDay} meal count doesn't exist in the database.`,
            ar: `عدد الوجبات ${numberOfMealPerDay} غير موجود في قاعدة البيانات`,
          },
        };
      }
    }

    // Check if plan_duration is provided
    if (planDuration) {
      // Check if the specified plan duration exists in the database
      const existOrNotDays = await NumberOfDays.findOne({
        days_number: planDuration,
        visible: true,
      });

      // If the specified plan duration doesn't exist, return an error message
      if (!existOrNotDays) {
        return {
          status: false,
          message: {
            en: `${planDuration} days plan duration doesn't exist in the database.`,
            ar: `مدة الخطة ${planDuration} أيام غير موجودة في قاعدة البيانات`,
          },
        };
      }
    }

    // Check if the user's profile exists and is verified
    const userProfile = await ProfileModel.findOne({
      user_Id: userId,
      verified: true,
    });

    if (!userProfile) {
      return {
        status: false,
        message: {
          en: "Your profile information is not updated or your profile may not be verified. You cannot order without updating the information and verifying the profile.",
          ar: "معلومات ملفك الشخصي غير محدثة أو قد لا يكون ملفك الشخصي موثقًا. لا يمكنك الطلب دون تحديث المعلومات والتحقق من الملف الشخصي",
        },
      };
    }

    const userPhone = await UserModel.findOne({
      _id: userId,
      phone: { $exists: true }, // Check if phone field exists and is not null
      disabled_by_admin: false, // Only consider active users
    });

    // Check if the user's phone number exists
    if (!userPhone) {
      return {
        status: false,
        message: {
          en: "Please provide a valid phone number in your profile to place an order.",
          ar: "يرجى تقديم رقم هاتف صالح في ملفك الشخصي لتتمكن من الطلب",
        },
      };
    }

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
              meal: {
                images: "$mealDetails.images",
                meal_name: { $toUpper: "$mealDetails.meal_name" },
              },
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
          _id: 0,
          ordered_meals_type: "$_id.cart_category",
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

    // Extract discount percentage
    const discountPercentageOnGrandTotal = discountDetails?.percentage || 0;

    // Calculate the discount(on grand total)
    const discount = discountDetails?.discountAmount || 0;

    /* checking if the main meals cart has any meals or not */
    if (mainMealCart?.length > 0) {
      /* Adding the number_of_meals_per_day and plan_duration to decide the box size */
      mainMealCart[0].number_of_meals_per_day = numberOfMealPerDay;
      mainMealCart[0].plan_duration = planDuration;
      mainMealCart[0].box_size = `${numberOfMealPerDay} × ${planDuration}`;
    }

    /* Making a bundle of the order details after getting data from the cart */
    const order_details = {
      mainMealCart,
      offeredMealCart,
      customizedMealCart,
      grandTotal,
      discount,
      discountPercentageOnGrandTotal,
      grandTotalAfterDiscount,
    };

    return {
      order_details,
    };

    /* Checking: is there any items available in user's cart or not */
    if (
      order_details.mainMealCart.length === 0 &&
      order_details.customizedMealCart.length === 0 &&
      order_details.offeredMealCart.length === 0
    ) {
      return {
        status: false,
        message: {
          en: "You can't place an order because you don't have any items in your cart.",
          ar: "لا يمكنك إتمام الطلب لأنك لا تملك أي عناصر في عربة التسوق",
        },
      };
    }

    /* Creating an instance of order list for the user */
    const newOrder = new OrderListModel({
      order_details,
      customer_details: userId,
      note_from_user: note_from_user || "",
      delivery_address: delivery_address,
      payment_method: payment_method || "COD - (Cash On Delivery)",
      paid_status: false,
      order_status: "pending",
      delivery_status: "pending",
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();

    // Creating notification after successfully placing the order(for customer)
    const notificationForUser = await NotificationModel.create({
      user_id: userId,
      title: {
        en: "Your order placed successfully.",
        ar: "تم تقديم طلبك بنجاح",
      },
      description: {
        en: `Your order-id is ${savedOrder?._id}`,
        ar: `رقم طلبك هو ${savedOrder?._id}`,
      },
    });

    // Emit an event to notify Customer User about his order
    io.to(`customerRoom_${userId}`).emit("orderPlacedUser", {
      message: {
        en: "Your order placed successfully.",
        ar: "تم تقديم طلبك بنجاح",
      },
    });

    // Creating notification after successfully placing the order (for admin)
    const notificationForAdmin = await NotificationForAdminModel.create({
      title: {
        en: "A New Order Received",
        ar: "تم استلام طلب جديد",
      },
      description: {
        en: `Order ID: ${savedOrder?._id}`,
        ar: `رقم الطلب: ${savedOrder?._id}`,
      },
    });

    // Emit an event to notify Admin Users about the new order
    io.to("adminRoom").emit("orderPlacedAdmin", {
      order_details: {
        newlyPlacedOrder: true,
        ...order_details,
      },
      message: {
        en: "A New Order Received",
        ar: "تم استلام طلب جديد",
      },
    });

    /* Making the main meals cart empty of the user */
    await CartListForMainMealMenu.findOneAndUpdate(
      { user: userId },
      { $set: { menus: [] } }
    );

    /* Making the offered meals cart empty of the user */
    await CartListForOfferedMealMenu.findOneAndUpdate(
      { user: userId },
      { $set: { menus: [] } }
    );

    /* Making the customized meals cart empty of the user */
    await CartListForCustomizedMeal.findOneAndUpdate(
      { user: userId },
      { $set: { menus: [] } }
    );

    return {
      status: true,
      data: savedOrder,
      message: {
        en: "Your order placed successfully.",
        ar: "تم تقديم طلبك بنجاح",
      },
    };
  } catch (error) {
    console.error("Error placing order:", error);
    return {
      status: false,
      message: {
        en: "Failed to place the order.",
        ar: "فشل في تقديم الطلب",
      },
    };
  }
};

/**
 * Service function to retrieve a user's order history with pagination and date filtering.
 * @param {string} userId - The ID of the user for whom orders are to be retrieved.
 * @param {Object} req - Express request object containing query parameters.
 * @returns {Object} - Result containing the user's order history with pagination and date filtering.
 */
exports.getMyOrdersService = async (req, userId) => {
  try {
    // Constants for pagination
    const showPerPage = req?.query?.showPerPage
      ? parseInt(req?.query?.showPerPage)
      : 10;
    const pageNo = req?.query?.pageNo ? parseInt(req?.query?.pageNo) : 1;

    // Aggregation pipeline to retrieve and format user orders with pagination and date filtering
    const userOrdersPipeline = [
      {
        $match: {
          customer_details: userId,
          createdAt: {
            $gte: new Date(req?.query?.orders_from),
            $lte: new Date(req?.query?.orders_end),
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: (pageNo - 1) * showPerPage,
      },
      {
        $limit: showPerPage,
      },
      {
        $project: {
          order_details: "$order_details",
          my_special_note: "$note_from_user",
          delivery_address: "$delivery_address",
          paid_status: "$paid_status",
          order_status: "$order_status",
          delivery_status: "$delivery_status",
          order_placed_at: "$createdAt",
        },
      },
    ];

    // Execute aggregation pipeline
    const userOrders = await OrderListModel.aggregate(userOrdersPipeline);

    // Get total data count for pagination
    const totalDataCount = await OrderListModel.countDocuments({
      customer_details: userId,
      createdAt: {
        $gte: new Date(req?.query?.orders_from),
        $lte: new Date(req?.query?.orders_end),
      },
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
      data: userOrders,
      totalDataCount,
      totalPages: pageArray,
      currentPage: pageNo,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: `عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
    };
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    return {
      status: false,
      message: {
        en: "Failed to retrieve user orders.",
        ar: "فشل في استرجاع طلبات المستخدم",
      },
    };
  }
};

/**
 * Service function to get all orders for admin with pagination and date range.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result containing all orders with pagination data.
 */
exports.getAllOrdersForAdminService = async (req) => {
  try {
    // Constants for pagination
    const showPerPage = req?.query?.showPerPage
      ? parseInt(req?.query?.showPerPage)
      : 10;
    const pageNo = req?.query?.pageNo ? parseInt(req?.query?.pageNo) : 1;

    // Aggregation method to match, sort, and paginate
    const matchSortAndPaginate = [
      {
        $match: {
          createdAt: {
            $gte: new Date(req?.query?.orders_from),
            $lte: new Date(req?.query?.orders_end),
          },
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort orders by creation date in descending order
      },
      {
        $skip: (pageNo - 1) * showPerPage,
      },
      {
        $limit: showPerPage,
      },
      {
        $lookup: {
          from: "users",
          localField: "customer_details",
          foreignField: "_id",
          as: "user_details",
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "customer_details",
          foreignField: "user_Id",
          as: "profile_details",
        },
      },
      {
        $project: {
          customer_details: {
            phone: {
              $arrayElemAt: ["$user_details.phone", 0],
            },
            email: {
              $arrayElemAt: ["$user_details.email", 0],
            },
            name: {
              $arrayElemAt: ["$profile_details.name", 0],
            },
          },
          order_details: "$order_details",
          customer_special_note: "$note_from_user",
          delivery_address: "$delivery_address",
          payment_method: "$payment_method",
          paid_status: "$paid_status",
          order_status: "$order_status",
          delivery_status: "$delivery_status",
          order_placed_at: "$createdAt",
        },
      },
    ];

    // Use aggregation to get all orders with matching, sorting, and pagination
    const allOrders = await OrderListModel.aggregate([...matchSortAndPaginate]);

    // Get total data count for pagination
    const totalDataCount = await OrderListModel.countDocuments({
      createdAt: {
        $gte: new Date(req?.query?.orders_from),
        $lte: new Date(req?.query?.orders_end),
      },
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
      data: allOrders,
      totalDataCount,
      totalPages: pageArray,
      currentPage: pageNo,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: `عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
    };
  } catch (error) {
    console.error("Error fetching all orders", error);
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
 * Service function to update the order status by admin.
 * @param {string} orderId - The ID of the order to be updated.
 * @param {string} newStatus - The new status to be set for the order.
 * @param {Object} io - Socket.io instance to emit notifications.
 * @returns {Object} - Result containing the updated order information or an error message.
 */
exports.updateOrderStatusByAdminService = async (orderId, newStatus, io) => {
  try {
    // Validate the new status to ensure it's a valid value
    const validStatusValues = ["pending", "confirm", "rejected"];
    if (!validStatusValues.includes(newStatus)) {
      return {
        status: false,
        message: {
          en: "Invalid status value. Please provide a valid status.",
          ar: "قيمة الحالة غير صالحة. يرجى تقديم حالة صالحة",
        },
      };
    }

    // Find the order in the database
    const order = await OrderListModel.findById(orderId);

    // Check if the order exists
    if (!order) {
      return {
        status: false,
        message: {
          en: "Order not found. Please provide a valid order ID.",
          ar: "الطلب غير موجود. يرجى تقديم معرف طلب صالح",
        },
      };
    }

    // Check if the order is shipped or delivered
    if (
      order.delivery_status === "shipped" ||
      order.delivery_status === "delivered"
    ) {
      return {
        status: false,
        message: {
          en: "Order status cannot be changed for a shipped or delivered order.",
          ar: "لا يمكن تغيير حالة الطلب لطلب تم شحنه أو تم تسليمه",
        },
      };
    }

    // Check if the current order status is "confirm" and the new status is "pending"
    if (order.order_status === "confirm" && newStatus === "pending") {
      return {
        status: false,
        message: {
          en: "Cannot change order status to pending if it is already confirmed.",
          ar: "لا يمكن تغيير حالة الطلب إلى معلَّق إذا تم تأكيده بالفعل",
        },
      };
    }

    // Update the order status in the database
    const updatedOrder = await OrderListModel.findByIdAndUpdate(
      orderId,
      { $set: { order_status: newStatus } },
      { new: true }
    );

    // Creating notification after changing the order status
    const notificationForUser = await NotificationModel.create({
      user_id: order.customer_details,
      title: {
        en: `Order status ${newStatus} now.`,
        ar: `حالة الطلب ${newStatus} الآن`,
      },
      description: {
        en: `Your order-id is ${orderId}`,
        ar: `رقم طلبك هو ${orderId}`,
      },
    });

    // Emit an event to notify Customer User about his order status
    io.to(`customerRoom_${order.customer_details}`).emit("orderStatusUser", {
      message: {
        en: `Order status ${newStatus} now.`,
        ar: `حالة الطلب ${newStatus} الآن`,
      },
    });

    return {
      status: true,
      message: {
        en: `Order status ${newStatus} now.`,
        ar: `حالة الطلب ${newStatus} الآن`,
      },
    };
  } catch (error) {
    console.error("Error updating order status by admin:", error);
    return {
      status: false,
      message: {
        en: "Failed to update order status. Please try again.",
        ar: "فشل تحديث حالة الطلب. يرجى المحاولة مرة أخرى",
      },
    };
  }
};

/**
 * Service function to update the delivery status by admin.
 * @param {string} orderId - The ID of the order to be updated.
 * @param {string} newStatus - The new delivery status to be set for the order.
 * @param {Object} io - Socket.io instance to emit notifications.
 * @returns {Object} - Result containing the updated order information or an error message.
 */
exports.updateDeliveryStatusByAdminService = async (orderId, newStatus, io) => {
  try {
    // Validate the new delivery status to ensure it's a valid value
    const validStatusValues = ["pending", "shipped", "delivered"];
    if (!validStatusValues.includes(newStatus)) {
      return {
        status: false,
        message: {
          en: "Invalid delivery status value. Please provide a valid status.",
          ar: "قيمة حالة التسليم غير صالحة. يرجى تقديم حالة صالحة",
        },
      };
    }

    // Find the order in the database
    const order = await OrderListModel.findById(orderId);

    // Check if the order exists
    if (!order) {
      return {
        status: false,
        message: {
          en: "Order not found. Please provide a valid order ID.",
          ar: "الطلب غير موجود. يرجى تقديم معرف طلب صالح",
        },
      };
    }

    // Check if the order status confirmed or not
    if (order.order_status !== "confirm") {
      return {
        status: false,
        message: {
          en: "Delivery status cannot be changed if the order status is not confirmed.",
          ar: "لا يمكن تغيير حالة التوصيل إذا لم يتم تأكيد حالة الطلب",
        },
      };
    }

    // Check constraints for changing the delivery status
    if (order.delivery_status === "delivered") {
      return {
        status: false,
        message: {
          en: "Delivery status can not be changed for an already delivered order.",
          ar: "لا يمكن تغيير حالة التسليم لطلب تم تسليمه بالفعل",
        },
      };
    }

    // Check if the new status is "pending" and the current delivery status is not "pending"
    if (
      newStatus === "pending" &&
      (order.delivery_status !== "pending" ||
        order.delivery_status !== "shipped")
    ) {
      return {
        status: false,
        message: {
          en: "Cannot change delivery status to pending if it is already shipped or delivered.",
          ar: "لا يمكن تغيير حالة التسليم إلى قيد الانتظار إذا كان قد تم شحنها أو تسليمها بالفعل",
        },
      };
    }

    // Update the delivery status in the database
    const updatedOrder = await OrderListModel.findByIdAndUpdate(
      orderId,
      { $set: { delivery_status: newStatus } },
      { new: true }
    );

    // Creating notification after changing the order's delivery status
    const notificationForUser = await NotificationModel.create({
      user_id: order.customer_details,
      title: {
        en: `Delivery status ${newStatus} now.`,
        ar: `حالة التسليم الآن ${newStatus}`,
      },
      description: {
        en: `Your order-id is ${orderId}`,
        ar: `رقم طلبك هو ${orderId}`,
      },
    });

    // Emit an event to notify Customer User about his order's delivery status
    io.to(`customerRoom_${order.customer_details}`).emit(
      "orderDeliveryStatusUser",
      {
        message: {
          en: `Delivery status ${newStatus} now.`,
          ar: `حالة التسليم الآن ${newStatus}`,
        },
      }
    );

    return {
      status: true,
      message: {
        en: `Delivery status ${newStatus} now.`,
        ar: `حالة التسليم الآن ${newStatus}`,
      },
    };
  } catch (error) {
    console.error("Error updating delivery status by admin:", error);
    return {
      status: false,
      message: {
        en: "Failed to update delivery status. Please try again.",
        ar: "فشل تحديث حالة التسليم. يرجى المحاولة مرة أخرى",
      },
    };
  }
};

/**
 * Service function to update the payment status by admin.
 * @param {string} orderId - The ID of the order to be updated.
 * @param {boolean} newStatus - The new payment status to be set for the order.
 * @param {Object} io - Socket.io instance to emit notifications.
 * @returns {Object} - Result containing the updated order information or an error message.
 */
exports.updatePaymentStatusByAdminService = async (orderId, newStatus, io) => {
  try {
    // Validate the new payment status to ensure it's a valid boolean value
    if (typeof newStatus !== "boolean") {
      return {
        status: false,
        message: {
          en: "Invalid payment status value. Please provide a valid boolean value.",
          ar: "قيمة حالة الدفع غير صالحة. يرجى تقديم قيمة بوليانية صالحة",
        },
      };
    }

    // Find the order in the database
    const order = await OrderListModel.findById(orderId);

    // Check if the order exists
    if (!order) {
      return {
        status: false,
        message: {
          en: "Order not found. Please provide a valid order ID.",
          ar: "الطلب غير موجود. يرجى تقديم معرف طلب صالح",
        },
      };
    }
    // Check if the payment status already false or not
    if (order.paid_status === false && newStatus === false) {
      return {
        status: false,
        message: {
          en: "Payment status is already false.",
          ar: "حالة الدفع بالفعل false",
        },
      };
    }

    // Check if the payment status true or not
    if (order.paid_status === true) {
      return {
        status: false,
        message: {
          en: "Payment status cannot be changed for a delivered and paid order.",
          ar: "لا يمكن تغيير حالة الدفع لطلب تم تسليمه ودفعه",
        },
      };
    }

    // Update the payment status in the database
    const updatedOrder = await OrderListModel.findByIdAndUpdate(
      orderId,
      { $set: { paid_status: newStatus } },
      { new: true }
    );

    // Creating notification after changing the payment status
    const notificationForUser = await NotificationModel.create({
      user_id: order.customer_details,
      title: {
        en: "Payment status is paid now.",
        ar: "تم دفع حالة الدفع الآن",
      },
      description: {
        en: `Your order-id is ${orderId}`,
        ar: `رقم طلبك هو ${orderId}`,
      },
    });

    // Emit an event to notify Customer User about his payment status
    io.to(`customerRoom_${order.customer_details}`).emit(
      "orderPaymentStatusUser",
      {
        message: {
          en: "Payment status is paid now.",
          ar: "تم دفع حالة الدفع الآن",
        },
      }
    );

    return {
      status: true,
      message: {
        en: "Payment status is paid now.",
        ar: "تم دفع حالة الدفع الآن",
      },
    };
  } catch (error) {
    console.error("Error updating payment status by admin:", error);
    return {
      status: false,
      message: {
        en: "Failed to update payment status. Please try again.",
        ar: "فشل تحديث حالة الدفع. يرجى المحاولة مرة أخرى",
      },
    };
  }
};
