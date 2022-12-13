const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date },
});

PostSchema.virtual("date").get(function () {
  return this.timestamp.toLocaleString(DateTime.DATETIME_FULL);
});

module.exports = mongoose.model("Post", PostSchema);
