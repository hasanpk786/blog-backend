const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//creating schema
const BlogSchema = new Schema({
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
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("blogs", BlogSchema);