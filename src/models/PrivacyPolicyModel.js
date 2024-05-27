const mongoose = require("mongoose");

const privacyPolicySchema = new mongoose.Schema({
  lang: {
    type: String,
    default: "en",
    enum: ["ar", "en"],
  },
  content: {
    type: String,
    required: true,
  },
});

const PrivacyPolicy = mongoose.model("PrivacyPolicy", privacyPolicySchema);

module.exports = PrivacyPolicy;
