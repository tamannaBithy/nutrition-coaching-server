const mongoose = require("mongoose");

const userInputsForCustomizedMealSchema = new mongoose.Schema(
  {
    customer_details: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    fat: {
      type: Number,
      required: true,
    },
    carbs: {
      type: Number,
      required: true,
    },
    meal_duration_repeat: {
      type: Number,
      min: 0,
      max: 7,
      default: 0,
    },
    calories: {
      type: Number,
    },
    mealPerDay: {
      type: Number,
    },
    category: {
      type: String,
      enum: ["keto diet", "clean diet"],
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const UserInputsForCustomizedMeal = mongoose.model(
  "UserInputsForCustomizedMeal",
  userInputsForCustomizedMealSchema
);

module.exports = UserInputsForCustomizedMeal;
