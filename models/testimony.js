const mongoose = require("mongoose");

const testimonySchema = new mongoose.Schema({
  name: String,
  imageCover: String,
  imageCoverId: String,
  images: [String],
  imagesIds: [String],
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    username: String,
    isAdmin: {
      type: Boolean,
      ref: "user",
    },
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
});

module.exports = mongoose.model("testimony", testimonySchema);
