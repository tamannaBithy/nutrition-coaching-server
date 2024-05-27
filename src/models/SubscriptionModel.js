const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
    },
    expirationTime: {
      type: Number,
      default: null,
    },
    keys: {
      p256dh: {
        type: String,
        required: true,
      },
      auth: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

const SubscriptionModel = mongoose.model("Subscription", subscriptionSchema);

module.exports = SubscriptionModel;
