const { default: mongose } = require("mongoose");
const userSchema = new mongose.Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  { timestamps: true }
);
const userModel = mongose.model("user", userSchema);

module.exports = {
  userModel,
};
