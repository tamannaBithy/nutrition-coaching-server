const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  lang: {
    type: String,
    default: "en",
    enum: ["ar", "en"],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;
