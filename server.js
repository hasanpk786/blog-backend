const mongoose = require('mongoose');
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require("./Db.js")
const app = express();
app.use(express.json());
const port = 5000
require("./models/UserModel.js");
const User = mongoose.model('users');
require("./models/BlogModel.js");
const Blog = mongoose.model('blogs');
dotenv.config();
connectDB();

app.get('/', (req, res) => {
    res.send('Hello!!')
});

app.post('/checkuser', (req, res) => {
    console.log("checks");
    console.log("check", req.body)
    const TestUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    if (TestUser) {
        res.status(200).send(TestUser);
        TestUser.save().then(console.log('works?')).catch(err => res.status(400).send(err));
    } else {
        res.status(400).send("TestUser is invalid");
    }
});


app.post('/checkblogs', (req, res) => {
    console.log("checks");
    console.log("check", req.body)
    const TestBlog = new Blog({
        blogtitle: req.body.blogtitle,
        blogbody: req.body.blogbody,
        blogtype: req.body.blogtype,

    });

    if (TestBlog) {
        res.status(200).send(TestBlog);
        TestBlog.save().then(console.log('works2?')).catch(err => res.status(400).send(err));
    } else {
        res.status(400).send("TestBlog is invalid");
    }
});


app.post('/deleteuser',
    (req, res) => {
        User.findOneAndDelete({ _id: req.body._id }).select("-password")
            .then(user => res.send({ success: "User Deleted", data: user }))
            .catch(err => res.status(400).send({ error: "Unable to find and delte user with given id" }))
    });


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

