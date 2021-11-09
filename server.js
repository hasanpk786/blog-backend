const express = require('express');
const app = express();
app.use(express.json());
// const port = 5000
let port = process.env.PORT;
if (port == null || port == "") {
    port = 5000;
}

const Routes = require('./Routes');

app.use('/Routes', Routes);

app.get("/", (req, res) => {
res.send("Hello World");
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const connectDB = require("./Db.js");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// require("./models/UserModel.js");
// const User = mongoose.model('users');
// require("./models/BlogModel.js");
// const Blog = mongoose.model('blogs');
// dotenv.config();
// connectDB();