var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
  {
    deviceModelId: String,
    timestamp: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

const model = mongoose.model("user", schema);

export default model;
