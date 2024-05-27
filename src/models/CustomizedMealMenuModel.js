const mongoose = require("mongoose");

const customizedMealMenuSchema = new mongoose.Schema(
  {
    lang: {
      type: String,
      default: "en",
      enum: ["ar", "en"],
    },
    image: {
      type: String,
    },
    select_diet: {
      type: String,
      enum: ["keto diet", "clean diet"],
      required: true,
    },
    meal_name: {
      type: String,
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
    fadd: {
      type: Number,
      required: true,
    }, //added fat

    carbs: {
      type: Number,
      required: true,
    },

    prp: {
      type: Number,
      required: true,
    }, //price per gram of protein
    prc: {
      type: Number,
      required: true,
    }, //price per gram of carb

    prf: {
      type: Number,
      required: true,
    }, //price per gram of fat
    mf: {
      type: Number,
      required: true,
    }, //meat factor
    sf: {
      type: Number,
      required: true,
    }, //starch factor
    of: {
      type: Number,
      required: true,
    }, //oil factor
    fmf: {
      type: Number,
      required: true,
    }, //fat in meat factor

    ingredients: {
      type: String,
      required: true,
    },
    heating_instruction: {
      type: String,
      required: true,
    },

    visible: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const CustomizedMealMenuModel = mongoose.model(
  "CustomizedMealMenu",
  customizedMealMenuSchema
);

module.exports = CustomizedMealMenuModel;
