const mongoose = require("mongoose");
const userLocationSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  addedDate: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Locations", userLocationSchema);
