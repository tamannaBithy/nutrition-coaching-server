const mongoose = require("mongoose");

const bannerModelSchema = new mongoose.Schema(
  {
    banner_heading: {
      type: String,
    },
    banner_paragraph: {
      type: String,
    },
    image: {
      type: String,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId, // Here will be add the admin id who create this obj
      ref: "User",
      required: true,
    },
    lang: {
      type: String,
      default: "en",
      enum: ["ar", "en"],
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const BannerModel = mongoose.model("Banner", bannerModelSchema);

module.exports = BannerModel;
