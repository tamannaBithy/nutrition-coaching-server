const mongoose = require("mongoose");

const popupAdsModelSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    visible_duration: {
      type: Date,
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

const PopupAdsModel = mongoose.model("PopupAd", popupAdsModelSchema);

module.exports = PopupAdsModel;
