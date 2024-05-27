const mongoose = require("mongoose");

const discountModelSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["mainMenu", "customizeOrder", "offers", "totalOrder"],
      /* mainMenu = his will be apply on main meals menu order total price */
      /* customizeOrder = his will be apply on customizedMeals order total price */
      /* offers = This will be apply on offered meals order's total price */
      /* totalOrder = This will be apply on total Price */
      required: true,
    },
    ranges: [
      {
        min: {
          type: Number,
          required: true,
        },
        max: {
          type: Number,
          required: true,
        },
        percentage: {
          type: Number,
          required: true,
        },
        isActive: {
          type: Boolean,
          default: false,
        },
      },
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const DiscountModel = mongoose.model("Discount", discountModelSchema);

module.exports = DiscountModel;
