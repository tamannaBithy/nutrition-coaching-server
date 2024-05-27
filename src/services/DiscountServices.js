const { default: mongoose } = require("mongoose");
const DiscountModel = require("../models/DiscountModel");

/**
 * Service function to create a new discount for orders.
 * @param {Object} discountData - Data for the new discount.
 * @param {string} user_id - ID of the user creating the discount.
 * @returns {Object} - Result of the discount creation process.
 */
exports.createDiscountService = async (discountData, user_id) => {
  try {
    const { category: discountCategory, ranges } = discountData;

    // Find the discount for the specified category
    const discountOnCategory = await DiscountModel.findOne({
      category: discountCategory,
    });

    if (!discountOnCategory) {
      // If no discount exists for the category, create a new one
      const newDiscount = new DiscountModel({
        ...discountData,
        created_by: user_id,
      });

      // Save the new discount to the database
      await newDiscount.save();
      return {
        status: true,
        message: {
          en: "Discount created successfully.",
          ar: "تم إنشاء التخفيض بنجاح",
        },
      };
    } else {
      // Use aggregate to check for intersection between existing and new ranges
      const intersectionCheck = await DiscountModel.aggregate([
        {
          $match: { category: discountCategory },
        },
        {
          $project: {
            _id: 0,
            ranges: 1,
          },
        },
        {
          $project: {
            intersections: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$ranges",
                      as: "range",
                      cond: {
                        $or: [
                          {
                            $and: [
                              {
                                $lte: [
                                  "$$range.min",
                                  { $max: ranges.map((r) => r.max) },
                                ],
                              },
                              {
                                $gte: [
                                  "$$range.max",
                                  { $min: ranges.map((r) => r.min) },
                                ],
                              },
                            ],
                          },
                          {
                            $and: [
                              {
                                $lte: [
                                  { $max: ranges.map((r) => r.min) },
                                  "$$range.max",
                                ],
                              },
                              {
                                $gte: [
                                  { $min: ranges.map((r) => r.max) },
                                  "$$range.min",
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    },
                  },
                },
                0,
              ],
            },
          },
        },
      ]);

      if (intersectionCheck[0].intersections > 0) {
        return {
          status: false,
          message: {
            en: "Provided ranges overlap with existing ranges in the category's ranges.",
            ar: "النطاقات المقدمة تتداخل مع النطاقات الحالية في نطاقات الفئة",
          },
        };
      }

      // If no intersection, push new elements to the ranges array
      await DiscountModel.updateOne(
        { category: discountCategory },
        { $push: { ranges: { $each: ranges } } }
      );

      return {
        status: true,
        message: "New discount range added to the ranges array.",
      };
    }
  } catch (error) {
    console.error("Error creating/updating discount for order", error);
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
 * Service function to get all discounts for orders.
 * @returns {Object} - Result containing all discounts for orders.
 */
exports.getAllDiscountService = async (req) => {
  try {
    const discountCategory = req?.query?.discount_category;

    // Aggregation pipeline to fetch and sort discounts based on the min value within ranges
    const discounts = await DiscountModel.aggregate([
      {
        $match: { category: discountCategory },
      },
      {
        $project: {
          category: 1,
          ranges: {
            $map: {
              input: "$ranges",
              as: "range",
              in: {
                _id: "$$range._id",
                min: "$$range.min",
                max: "$$range.max",
                percentage: "$$range.percentage",
                isActive: "$$range.isActive",
              },
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
          ranges: 1,
          created_by: 1,
        },
      },
    ]);

    return { status: true, data: discounts };
  } catch (error) {
    console.error("Error fetching discounts for orders", error);
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
 * Service function to get details of a specific discount for orders by ID.
 * @param {string} discountId - The ID of the discount.
 * @returns {Object} - Result containing details of the specified discount for orders.
 */
exports.getDiscountByIdService = async (discountId) => {
  try {
    // Fetch the discount entry by ID from the database
    const discount = await DiscountModel.findById(discountId, {
      createdAt: 0,
      updatedAt: 0,
    });

    if (!discount) {
      return {
        status: false,
        message: {
          en: "Discount not found.",
          ar: "التخفيض غير موجود",
        },
      };
    }

    return { status: true, data: discount };
  } catch (error) {
    console.error("Error fetching discount for orders by ID", error);
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
 * Service function to update a discount for an order.
 * @param {string} discountId - The ID of the discount to be updated.
 * @param {string} rangeId - The ID of the range to be updated within the discount.
 * @param {Object} updatedData - The updated data for the discount.
 * @returns {Object} - Result of the discount update process.
 */
exports.updateDiscountService = async (discountId, rangeId, updatedData) => {
  try {
    // Use aggregation to match the discount and the specific range within it
    const existingDiscount = await DiscountModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(discountId),
        },
      },
      {
        $unwind: "$ranges",
      },
      {
        $match: {
          "ranges._id": new mongoose.Types.ObjectId(rangeId),
        },
      },
    ]);

    // If the existingDiscount array is empty, the discount or range was not found
    if (existingDiscount.length === 0) {
      return {
        status: false,
        message: {
          en: "Discount or range not found.",
          ar: "التخفيض أو النطاق غير موجود",
        },
      };
    }

    // Extract the specific range object from the array
    const existingRange = existingDiscount[0].ranges;

    // Aggregation pipeline to fetch and sort discounts
    const otherDiscounts = await DiscountModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(discountId),
        },
      },
      {
        $project: {
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
                _id: "$$range._id",
              },
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
          ranges: {
            $push: "$ranges",
          },
          created_by: { $first: "$created_by" },
        },
      },
      {
        $project: {
          _id: 1,
          category: 1,
          ranges: {
            $filter: {
              input: "$ranges",
              as: "range",
              cond: {
                $ne: ["$$range._id", new mongoose.Types.ObjectId(rangeId)],
              },
            },
          },
          created_by: 1,
        },
      },
    ]);

    // Check for conflicts with existing ranges
    const conflict = otherDiscounts.some((otherDiscount) =>
      otherDiscount.ranges.some(
        (range) =>
          (updatedData.min >= range.min && updatedData.min <= range.max) ||
          (updatedData.max >= range.min && updatedData.max <= range.max) ||
          updatedData.percentage === range.percentage
      )
    );

    if (conflict) {
      return {
        status: false,
        message: {
          en: "Updated data conflicts with existing ranges in other discounts.",
          ar: "تعارضت البيانات المحدثة مع النطاقات الحالية في تخفيضات أخرى",
        },
      };
    }

    // Update the specific fields within the range
    existingRange.min = updatedData.min;
    existingRange.max = updatedData.max;
    existingRange.percentage = updatedData.percentage;
    existingRange.isActive = updatedData.isActive;

    // Save the updated discount to the database
    await DiscountModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(discountId),
        "ranges._id": new mongoose.Types.ObjectId(rangeId),
      },
      {
        $set: {
          "ranges.$": existingRange,
        },
      }
    );

    return {
      status: true,
      message: {
        en: "Discount updated successfully.",
        ar: "تم تحديث التخفيض بنجاح",
      },
    };
  } catch (error) {
    console.error("Error updating discount for order", error);
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
 * Service function to delete a discount for orders by ID.
 * @param {string} discountId - The ID of the discount to be deleted.
 * @param {string} rangeId - The ID of the range to be deleted within the discount.
 * @returns {Object} - Result of the discount deletion process.
 */
exports.deleteDiscountService = async (discountId, rangeId) => {
  try {
    // Find the discount entry by ID
    const discount = await DiscountModel.findById(discountId);

    // If the discount does not exist, return an error message
    if (!discount) {
      return {
        status: false,
        message: {
          en: "Discount not found.",
          ar: "التخفيض غير موجود",
        },
      };
    }

    // Find the index of the range to be deleted within the discount's ranges array
    const rangeIndex = discount.ranges.findIndex(
      (range) => range._id.toString() === rangeId
    );

    // If the range is not found, return an error message
    if (rangeIndex === -1) {
      return {
        status: false,
        message: {
          en: "Range not found in the discount.",
          ar: "النطاق غير موجود في الخصم",
        },
      };
    }

    // Remove the range from the ranges array
    discount.ranges.splice(rangeIndex, 1);

    // Save the updated discount to the database
    await discount.save();

    return {
      status: true,
      message: {
        en: "Range deleted successfully.",
        ar: "تم حذف النطاق بنجاح",
      },
    };
  } catch (error) {
    console.error("Error deleting discount for orders", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};
