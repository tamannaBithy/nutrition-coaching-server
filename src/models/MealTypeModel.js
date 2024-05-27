const mongoose = require("mongoose");

const mealTypeSchema = new mongoose.Schema(
  {
    lang: {
      type: String,
      default: "en",
      enum: ["ar", "en"],
    },
    type_of_meal: {
      type: String,
      required: true, // breakfast, lunch, dinner, drinks, desert etc…
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId, // Here will be add the admin id who create this obj
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const MealType = mongoose.model("MealType", mealTypeSchema);

module.exports = MealType;
