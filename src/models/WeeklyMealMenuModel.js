const mongoose = require("mongoose");

const WeeklyMealMenuSchema = new mongoose.Schema(
  {
    lang: {
      type: String,
      default: "en",
      enum: ["ar", "en"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeeklyMealCategory",
      required: true,
    },
    image: {
      type: String,
    },
    meal_name: {
      type: String,
      required: true,
    },
    main_badge_tag: {
      type: String,
    },
    tags: {
      type: [String],
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
    calories: {
      type: Number,
      required: true,
    },
    nutrition_facts: {
      type: String, // image path will be store here.
      sparse: true, // Allows null or unique values
    },
    ingredients: {
      type: String,
      required: true,
    },
    heating_instruction: {
      type: String,
      required: true,
    },
    available_from: {
      type: Date, // starting of the week's date
      required: true,
    },
    unavailable_from: {
      type: Date, // ending of the week's date
      required: true,
    },
    visible: {
      type: Boolean,
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

const WeeklyMealMenu = mongoose.model("WeeklyMealMenu", WeeklyMealMenuSchema);

module.exports = WeeklyMealMenu;
