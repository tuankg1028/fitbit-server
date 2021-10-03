var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
  {
    heartRate: Number,
    timestamp: Number,
    userId: mongoose.ObjectId
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

const model = mongoose.model("heartRate", schema);

export default model;
