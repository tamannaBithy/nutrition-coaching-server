const mongoose = require("mongoose");

const instructorModelSchema = new mongoose.Schema(
  {
    lang: {
      type: String,
      default: "en",
      enum: ["ar", "en"],
    },
    image: {
      type: String,
      default: "",
    },
    instructor_name: {
      type: String,
      required: true,
    },
    instructor_qualification: {
      type: String,
      required: true,
    },
    instructor_details: {
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

const InstructorModel = mongoose.model("Instructor", instructorModelSchema);

module.exports = InstructorModel;
