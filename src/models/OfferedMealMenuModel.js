const mongoose = require("mongoose");

const offeredMealMenuSchema = new mongoose.Schema(
  {
    lang: {
      type: String,
      default: "en",
      enum: ["ar", "en"],
    },
    category: {
      type: String,
      required: true,
      default: "Offer Meal", // Assuming a default value, adjust as needed
    },
    package_image: {
      type: String,
    },
    package_name: {
      type: String,
      required: true,
    },
    meals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OfferedMeal",
      },
    ],
    tags: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
      default: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId, // Here will be add the admin id who create this obj
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const OfferedMealMenuModel = mongoose.model(
  "OfferedMealMenu",
  offeredMealMenuSchema
);

module.exports = OfferedMealMenuModel;
