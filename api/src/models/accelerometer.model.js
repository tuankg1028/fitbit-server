var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
  {
    x: Number,
    y: Number,
    z: Number,
    timestamp: String,
    userId: mongoose.ObjectId
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

const model = mongoose.model("accelerometer", schema);

export default model;
