const { Schema, model } = require("mongoose");

const aspectConfig = new Schema({
  username: String,
  bgImg: String,
  idChecker: String
});

module.exports = model("aspectConfig", aspectConfig);