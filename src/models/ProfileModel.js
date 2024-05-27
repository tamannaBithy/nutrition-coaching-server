const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    father_name: {
      type: String,
      default: "",
    },
    grandfather_name: {
      type: String,
      default: "",
    },
    date_of_birth: {
      type: Date,
      default: null,
    },
    province: {
      type: String,
      default: "",
    },
    district: {
      type: String,
      default: "",
    },
    locality: {
      type: String,
      default: "",
    },
    neighborhood: {
      type: String,
      default: "",
    },
    alley: {
      type: String,
      default: "",
    },
    house_number: {
      type: String,
      default: "",
    },
    notifications: [
      {
        pushNotification: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PushNotification",
          required: true,
        },
      },
    ],
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const ProfileModel = mongoose.model("Profile", profileSchema);

module.exports = ProfileModel;
