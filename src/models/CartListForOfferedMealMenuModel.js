const mongoose = require("mongoose");

const cartListForOfferedMealMenuSchema = new mongoose.Schema(
  {
    cart_category: {
      type: String,
      default: "offers",
    },
    menus: [
      {
        offeredMealsMenu: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "OfferedMealMenu",
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
    ordered_meals_type: {
      type: String,
      enum: ["Offered Meals Orders"],
      required: true,
      default: "Offered Meals Orders",
    },
  },
  { timestamps: true, versionKey: false }
);

const CartListForOfferedMealMenu = mongoose.model(
  "CartListForOfferedMealMenu",
  cartListForOfferedMealMenuSchema
);

module.exports = CartListForOfferedMealMenu;
