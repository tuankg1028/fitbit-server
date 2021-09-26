var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
  {
    accuracy: Number,
    latitude: Number,
    longitude: Number,
    altitude: Number,
    altitudeAccuracy: Number,
    heading: Number,
    speed: Number,
    timestamp: String,
    userId: mongoose.ObjectId
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

const model = mongoose.model("geolocation", schema);

export default model;
