var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
  {
    cipherText: String,
    timestamp: String,
    type: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

const model = mongoose.model("encypted-data", schema);

export default model;
