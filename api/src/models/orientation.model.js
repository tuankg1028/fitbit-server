var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
  {
    scalar: Number,
    i: Number,
    j: Number,
    k: Number,
    timestamp: String,
    userId: mongoose.ObjectId
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

const model = mongoose.model("orientation", schema);

export default model;
