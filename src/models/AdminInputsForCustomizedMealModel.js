const mongoose = require("mongoose");

const adminInputsForCustomizedMealSchema = new mongoose.Schema(
  {
    calories_divider: {
      type: Number,
      required: true,
    },
    minimumProtein: {
      type: Number,
      required: true,
    },
    maximumProtein: {
      type: Number,
      required: true,
    },
    minimumFat: {
      type: Number,
      required: true,
    },
    maximumFat: {
      type: Number,
      required: true,
    },
    minimumCarb: {
      type: Number,
      required: true,
    },
    maximumCarb: {
      type: Number,
      required: true,
    },
    minimumCalories: {
      type: Number,
      required: true,
    },
    maximumCalories: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["keto", "clean"],
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const AdminInputsForCustomizedMeal = mongoose.model(
  "AdminInputsForCustomizedMeal",
  adminInputsForCustomizedMealSchema
);

module.exports = AdminInputsForCustomizedMeal;
