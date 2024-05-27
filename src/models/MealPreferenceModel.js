const mongoose = require("mongoose");

const mealPreferenceSchema = new mongoose.Schema(
  {
    lang: {
      type: String,
      default: "en",
      enum: ["ar", "en"],
    },
    preference: {
      type: String,
      required: true, // keto, chef’s choice, vegan, protein plus etc…
    },
    preference_image: {
      type: String,
    },
    preference_desc: {
      type: String,
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

const MealPreference = mongoose.model("MealPreference", mealPreferenceSchema);

module.exports = MealPreference;
