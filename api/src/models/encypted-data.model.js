var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
  {
    value: String,
    header: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

const model = mongoose.model("encypted-data", schema);

export default model;
