const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, required: true },
  admin: { type: Boolean },
});

UserSchema.virtual("full_name").get(function () {
  return `${this.last_name}, ${this.first_name}`;
});

module.exports = mongoose.model("User", UserSchema);
