const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./UserModel.js");
// const User = mongoose.model('users'); ref: 'users',

//creating schema
const BlogSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  blogtitle: {
    type: String,
    required: true,
  },
  blogbody: {
    type: String,
    required: true,
  },
  blogtype: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("blogs", BlogSchema);