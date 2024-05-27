const mongoose = require("mongoose");

const blogModelSchema = new mongoose.Schema(
  {
    blog_image: {
      type: String,
    },
    blog_title: {
      type: String,
      required: true,
    },
    blog_description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
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

const BlogModel = mongoose.model("Blog", blogModelSchema);

module.exports = BlogModel;
