var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
  {
    state: String,
    timestamp: String,
    userId: mongoose.ObjectId
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

const model = mongoose.model("sleep", schema);

export default model;
