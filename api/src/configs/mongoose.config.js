import path from "path";
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.connection.on("error", err => {
  // eslint-disable-next-line no-console
  console.log("Connect MONDGODB ERROR", err);
});

mongoose.set("debug", true);
