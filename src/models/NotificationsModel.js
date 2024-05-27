const mongoose = require("mongoose");

const notificationModelSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      en: {
        type: String,
        required: true,
      },
      ar: {
        type: String,
        required: true,
      },
    },
    description: {
      en: {
        type: String,
        required: true,
      },
      ar: {
        type: String,
        required: true,
      },
    },
    mark_as_read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const NotificationModel = mongoose.model(
  "notification",
  notificationModelSchema
);

module.exports = NotificationModel;
