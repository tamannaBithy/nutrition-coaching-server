const mongoose = require("mongoose");

const weeklyMealCategorySchema = new mongoose.Schema(
  {
    lang: {
      type: String,
      default: "en",
      enum: ["ar", "en"],
    },
    weekly_meal_category: {
      type: String,
      required: true, // ready made, add on  etc…
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId, // Here will be add the admin id who create this obj
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const WeeklyMealCategory = mongoose.model(
  "WeeklyMealCategory",
  weeklyMealCategorySchema
);

module.exports = WeeklyMealCategory;
