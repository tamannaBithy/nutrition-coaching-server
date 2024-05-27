const mongoose = require("mongoose");

const cartListForMainMealMenuSchema = new mongoose.Schema(
  {
    cart_category: {
      type: String,
      default: "mainMenu",
    },
    menus: [
      {
        mainMealsMenu: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MainMealMenu",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
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
      enum: ["Preference Meals Orders"],
      required: true,
      default: "Preference Meals Orders",
    },
  },
  { timestamps: true, versionKey: false }
);

const CartListForMainMealMenu = mongoose.model(
  "CartListForMainMealMenu",
  cartListForMainMealMenuSchema
);

module.exports = CartListForMainMealMenu;
