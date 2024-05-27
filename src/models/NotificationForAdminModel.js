const mongoose = require("mongoose");

const notificationForAdminModelSchema = new mongoose.Schema(
  {
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

const NotificationForAdminModel = mongoose.model(
  "notificationForAdmin",
  notificationForAdminModelSchema
);

module.exports = NotificationForAdminModel;
