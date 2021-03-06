const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//creating schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("users", UserSchema);