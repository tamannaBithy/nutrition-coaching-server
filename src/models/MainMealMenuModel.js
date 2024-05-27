const mongoose = require("mongoose");

const mainMealMenuSchema = new mongoose.Schema(
  {
    lang: {
      type: String,
      default: "en",
      enum: ["ar", "en"],
    },
    preference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealPreference",
      required: true,
    },
    type_of_meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealType",
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
      default: "",
      required: true,
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
    old_price: {
      type: Number,
      default: 0,
    },
    regular_price: {
      type: Number,
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

const MainMealMenuModel = mongoose.model("MainMealMenu", mainMealMenuSchema);

module.exports = MainMealMenuModel;
