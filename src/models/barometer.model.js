var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
  {
    pressure: Number,
    timestamp: String,
    userId: mongoose.ObjectId
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

const model = mongoose.model("barometer", schema);

export default model;
