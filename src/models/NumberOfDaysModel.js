const mongoose = require("mongoose");

const numberOfDaySchema = new mongoose.Schema(
  {
    days_number: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          // Validate that the value is a positive integer
          return /^\d+$/.test(value) && parseInt(value) > 0;
        },
        message: (props) => `${props.value} is not a valid positive integer.`,
      },
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

const NumberOfDays = mongoose.model("NumberOfDay", numberOfDaySchema);

module.exports = NumberOfDays;
