const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: Number,
      require: true,
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    expiryTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const OTPModel = mongoose.model("OTP", otpSchema);

module.exports = OTPModel;
