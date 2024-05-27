const mongoose = require("mongoose");

const cartListForCustomizedMealSchema = new mongoose.Schema(
  {
    cart_category: {
      type: String,
      default: "customizeOrder",
    },
    menus: [
      {
        day: {
          type: String,
          required: true,
          enum: ["day1", "day2", "day3", "day4", "day5", "day6", "day7"],
        },
        meals: [
          {
            meal: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "CustomizedMealMenu",
              required: true,
            },
            quantityOfOil: {
              type: Number,
            },
            extraOil: {
              type: Number,
            },
            quantityOfStarch: {
              type: Number,
            },
            quantityOfMeat: {
              type: Number,
            },
          },
        ],

        price_for_specific_day: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_type: {
      type: String,
      enum: ["Customized Meals Orders"],
      required: true,
      default: "Customized Meals Orders",
    },
  },
  { timestamps: true, versionKey: false }
);

const CartListForCustomizedMeal = mongoose.model(
  "cartListForCustomizedMeal",
  cartListForCustomizedMealSchema
);

module.exports = CartListForCustomizedMeal;
