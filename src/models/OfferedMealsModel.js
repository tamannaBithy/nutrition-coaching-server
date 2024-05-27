const mongoose = require("mongoose");

const offeredMealSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    meal_name: {
      type: String,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    carbs: {
      type: Number,
      required: true,
    },
    fat: {
      type: Number,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    nutrition_facts_image: {
      type: String,
    },
    ingredients: {
      type: String,
      required: true,
    },
    heating_instruction: {
      type: String,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId, // Here will be add the admin id who create this obj
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const OfferedMeal = mongoose.model("OfferedMeal", offeredMealSchema);

module.exports = OfferedMeal;
