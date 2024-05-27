const mongoose = require("mongoose");

const bookSessionWithInstructorModelSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note_for_instructor: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "booked", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true, versionKey: false }
);

const BookSessionWithInstructorModel = mongoose.model(
  "BookSessionWithInstructor",
  bookSessionWithInstructorModelSchema
);

module.exports = BookSessionWithInstructorModel;
