const mongoose = require("mongoose");

const termsAndConditionsSchema = new mongoose.Schema({
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

const TermsAndConditions = mongoose.model(
  "TermsAndConditions",
  termsAndConditionsSchema
);

module.exports = TermsAndConditions;
