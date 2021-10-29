const mongoose = require('mongoose');
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require("./Db.js")
const app = express();
app.use(express.json());
// const port = 5000
let port = process.env.PORT;
if (port == null || port == "") {
    port = 5000;
}
require("./models/UserModel.js");
const User = mongoose.model('users');
require("./models/BlogModel.js");
const Blog = mongoose.model('blogs');
dotenv.config();
connectDB();

app.get('/', (req, res) => {
    res.send('Hello!!')
});

// creates a user
app.post('/checkuser',
    async (req, res) => {
        console.log("checks");
        console.log("check", req.body);
        const { email } = req.body;
        const userExist =
            await User.findOne({ email });

        if (userExist) {
            return res
                .status(400)
                .send("User Already exist with this email");
        }

        const TestUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,//hash password here.
        });

        if (TestUser) {
            res.status(200).send(TestUser);
            TestUser.save().then(console.log('works?')).catch(err => res.status(400).send(err));
        } else {
            res.status(400).send("TestUser is invalid");
        }
    });


//creates a blog
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
    async (req, res) => {
        await User.findOneAndDelete({ _id: req.body._id }).select("-password")
            .then(user => res.status(200).send({ success: "User Deleted", data: user }))
            .catch(err => res.status(400).send({ error: "Unable to find and delete user with given id" }))
    });


app.post('/deleteblog',
    async (req, res) => {
        await Blog.findOneAndDelete({ _id: req.body._id }).select("-password")
            .then(blog => res.status(200).send({ success: "Blog Deleted", data: blog }))
            .catch(err => res.status(400).send({ error: "Unable to find and delete blog with given id" }))
    });


//gets a certain user by their id
app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password')
        .then(res.status(200))
        .catch(err => res.status(400).send({ error: "Unable to find user with given id" }));

    //do not send data inside 'then()' as that exits out of the request. (Although that should work as well)
    if (user) {
        return res.status(200).send({
            user,
            message: "User retrieved successfully"
        })
    } else {
        return res.status(400).send({
            user,
            message: "Error in retrieiving User"
        })
    }
});

//gets a certain blog by it's id (can be changed to title if needed)
app.get('/blog/:id', async (req, res) => {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId)
        .then(res.status(200))
        .catch(err => res.status(400).send({ error: "Unable to find and blog with given id" }));
    if (blog) {
        return res.status(200).send({
            blog,
            message: "Blog retrieved successfully"
        })
    } else {
        return res.status(400).send({
            blog,
            message: "Error in retrieiving Blog"
        })
    }
});


// Find all users?
//list of all users without password
app.get('/SuperAdmin/allUsers', async (req, res) => {
    const userList = await User.find({}).select('-password');
    if (userList) {
        return res.status(200).json({
            userList,
            message: "User list retrieved successfully"
        })
    } else {
        return res.status(400).json({
            userList,
            message: "User list canot be retrieved"
        })
    }
});


// Find all blogs?
// list of all blogs without body
app.get('/SuperAdmin/allBlogs', async (req, res) => {
    const blogList = await Blog.find({}).select('-blogbody');
    if (blogList) {
        return res.status(200).json({
            blogList,
            message: "Blog list retrieved successfully"
        })
    } else {
        return res.status(400).json({
            blogList,
            message: "User list canot be retrieved"
        })
    }
});

//APIS still to be added.
// login
// Tokens and stuff needed here

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})