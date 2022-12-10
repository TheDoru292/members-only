const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MembershipStatusSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String },
});

module.exports = mongoose.model("MembershipStatus", MembershipStatusSchema);
