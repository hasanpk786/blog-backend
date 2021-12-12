const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require("./Db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router()
// const bodyParser = require('body-parser')
require("./models/UserModel.js");
const User = mongoose.model('users');
require("./models/BlogModel.js");
const Blog = mongoose.model('blogs');

require("./models/ProgramModel.js");
const Program = mongoose.model('programs');

dotenv.config();
connectDB();
const { protect } = require("./middleware/auth");

// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(bodyParser.json());


//
router.get('/getProgramBase/:pg',
    async (req, res) => {
        var nums = parseInt(req.params.pg);
        var numslimit = 1;
        const ProgramFilter = await Program.find(req.query).limit(numslimit).skip(numslimit * nums);
        console.log(numslimit);
        console.log(ProgramFilter);
        console.log(req.query);
        res.status(200).json({
            header: { message: "Program Filter found", code: 1 },
            data: ProgramFilter,
        });

    });


//Gets all blog for a certain user.
router.get('/getblogs/:id/:lim/:pg', protect,
    async (req, res) => {
        var temp;
        var numslimit = parseInt(req.params.lim);
        var page = parseInt(req.params.pg) - 1;


        const blogList = await Blog.find({ user_id: req.params.id }).limit(numslimit).skip(numslimit * page)
        const user = await User.findById(req.params.id).select("-password")
        const count = await Blog.countDocuments({ user_id: req.params.id });


        if (blogList.length > 0 && user) {
            // setTimeout(function () {

            const Uname = user.name
            //code 0 means no error 1 means vice versa
            return res.status(200).json({
                header: {
                    message: "Blog list for a certain user retrieved successfully",
                    code: 0,
                },
                data: {
                    count,
                    Username: Uname,
                    Displaylength: blogList.length,
                    blogList
                },
            });
            // }, 500);
        } else {
            return res.status(400).json({
                header: {
                    message: "Blog list for a certain user cannot be retrieved. User has no blogs",
                    code: 1,
                },
                data: {
                    blogList,
                }
            })
        }
    });


//testing ignore
router.get('/first/:id',
    async (req, res) => {
        const userId_body = req.body.id;
        const userparamsID = req.params.id;
        console.log("UID check", userId_body, "paramsID:", userparamsID);
        // var user = new User;
        const user = await User.findById(userId_body).select('-password')//delete Id from body
        const admin = await User.findById(userparamsID).select('-password')//asad ID from params.
        // console.log("UID check2", user.name, "paramuser", admin.name);

        if (admin.isAdmin) {
            console.log("admin bool comparision works")

        } else {
            console.log("admin comparision failed")
        }

        res.json('Hello!!')
    });


// creates a user
router.post('/adduser',
    async (req, res) => {
        // console.log("checks");
        // console.log("check", req.body);
        const { email } = req.body;
        const userExist =
            await User.findOne({ email });

        if (userExist) {
            return res
                .status(400)
                .json({
                    header: {
                        message: "User Already exist with this email",
                        code: 1
                    }
                });
        }

        const TestUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            // isAdmin: req.body.isAdmin
        });

        if (TestUser) {
            // {header:{} , data: { name: TestUser.name, email: TestUser.email, id: TestUser.id } }
            res.status(200).json({
                header: {
                    message: "User Made", code: 0
                },
                data: {
                    name: TestUser.name, email: TestUser.email, id: TestUser.id
                }
            });

            TestUser.save().then(console.log('works?')).catch(err => res.status(400).json({
                header: {
                    message: "User cannot be saved", err,
                    code: 1
                }
            }));
        } else {
            res.status(400).json({
                header: {
                    message: "User is invalid", err,
                    code: 1
                }
            });
        }
    });


//creates a blog for a user
router.post('/addblogs', protect,
    async (req, res) => {
        console.log("check", req.body)
        const TestBlog = new Blog({
            user_id: req.body.user_id,
            blogtitle: req.body.blogtitle,
            blogbody: req.body.blogbody,
            blogtype: req.body.blogtype,

        });

        if (TestBlog) {
            res.status(200).json({
                header: {
                    message: "Blog added successfuly",
                    code: 0
                },
                data: TestBlog
            });

            await TestBlog.save().then(console.log('works2?')).catch(err => res.status(400).json({
                header: {
                    message: "Blog cannot be saved", err,
                    code: 1
                }
            }));
        } else {
            res.status(400).json({
                header: {
                    message: "Blog is invalid", err,
                    code: 1
                }
            });
        }
    });


//delets a user given their Id
router.delete('/deleteuser/:id', protect,
    async (req, res) => {
        await User.findOneAndDelete({ _id: req.params.id }).select("-password")
            .then(user => res.status(200).json({
                header: { message: "User Deleted", code: 0 }, data: user
            }))
            .catch(err => res.status(400).json({
                header: { message: "Unable to find and delete user with given id", code: 1 }
            }))
    });

//deletes a blog given its Id.
router.delete('/deleteblog/:id', protect,
    async (req, res) => {
        await Blog.findOneAndDelete({ _id: req.params.id }).select("-blogbody")
            .then(blog => res.status(200).json({
                header: { message: "Blog Deleted", code: 0 }, data: blog
            }))
            .catch(err => res.status(400).json({
                header: { message: "Unable to find and delete blog with given id", code: 1 }
            }))
    });


//gets a certain user by their Id
router.get('/user/:id', protect,
    async (req, res) => {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password')
            .then(res.status(200))
            .catch(err => res.status(400).json({
                header: { message: "Unable to find user with given id", code: 1 }
            }));

        //do not .json data inside 'then()' as that exits out of the request. (Although that should work as well)
        if (user) {
            return res.status(200).json({
                header: { message: "User retrieved successfully", code: 0 },
                data: user,

            })
        } else {
            return res.status(400).json({
                header: { message: "Error in retrieiving User", code: 1 },
                data: user,

            })
        }
    });

//gets a certain blog by it's id (can be changed to title if needed)
router.get('/blog/:id', protect,
    async (req, res) => {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId)
            .then(res.status(200))
            .catch(err => res.status(400).json({
                header: { message: "Unable to find and blog with given id", code: 1 }
            }));
        if (blog) {
            return res.status(200).json({
                header: { message: "Blog retrieved successfully", code: 0 },
                data: blog
            })
        } else {
            return res.status(400).json({
                header: { message: "Error in retrieiving Blog", code: 1 },
                data: blog
            })
        }
    });


// Find all users
//list of all users without password
router.get('/SuperAdmin/allUsers/:lim/:pg', protect,
    async (req, res) => {
        var numslimit = parseInt(req.params.lim);
        var page = parseInt(req.params.pg) - 1;
        const userList = await User.find({}).select('-password').limit(numslimit).skip(numslimit * page)

        if (userList) {
            return res.status(200).json({
                header: { message: "User list retrieved successfully", code: 0 },
                data: {
                    Users: { listlength: userList.length, userList }
                }
            })
        } else {
            return res.status(400).json({
                header: { message: "User list cannot be retrieved", code: 1 },
                data: userList
            })
        }
    });


// Find all blogs
// list of all blogs without body
router.get('/SuperAdmin/allBlogs', protect,
    async (req, res) => {
        const blogList = await Blog.find({}).select('-blogbody').limit(5).skip(0);
        var newList = JSON.parse(JSON.stringify(blogList));
        if (blogList) {
            const iterator = blogList.length;
            var username;
            for (var i = 0; i < iterator; i++) {
                var xyz = newList[i].user_id;
                var User_Blog = await User.findById(xyz.toString()).select('-password');
                if (User_Blog) {
                    username = (User_Blog.name)
                    newList[i]["Uname"] = username
                } else {
                    username = "user is null"
                    newList[i]["Uname"] = username
                }
            }
            return res.status(200).json({
                header: { message: "Blog list retrieved successfully", code: 0 },

                data: { listlength: newList.length, newList }
            })
        } else {
            return res.status(400).json({
                header: { message: "User list canot be retrieved", code: 1 },
                data: newList,

            })
        }
    });

// login
router.post("/login",
    async (req, res) => {
        if (Object.keys(req.body).length === 0) {
            return res
                .status(500)
                .json({
                    header: { message: "Body fields cannot be empty.", code: 1 }
                });
        }

        let credentials = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
        });

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
            return res
                .status(500)
                .json({
                    header: { message: "User doesn't exist.", code: 1 }
                });
        } else {
            if (user && (bcrypt.compareSync(req.body.password, user.password) ||
                (user && req.body.password === user.password))) {
                console.log("here in paswd check");
                return res.status(200).json
                    ({
                        header: { message: "User Logged In successfully!", code: 0 },
                        data: {
                            name: user.name,
                            user: user.email,
                            user_id: user.id,
                            token: jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_Secret, {
                                expiresIn: process.env.Token_Timer.toString(),
                            }),
                        }
                    })
            } else {
                return res
                    .status(400)
                    .json({
                        header: { message: "Please enter correct credentials", code: 1 },
                    });
            }
        }

    });

//update profile for user
router.put('/profile/:id', protect,
    async (req, res) => {
        const foundUser = await User.findById(req.params.id);

        if (foundUser) {
            foundUser.name = req.body.name || foundUser.name;
            foundUser.email = req.body.email || foundUser.email;

            if (req.body.password) {
                foundUser.password = bcrypt.hashSync(req.body.password, 10)
            }
        } else {
            return res.status(404).json({
                header: { message: "User not found", code: 1 }
            })
        }

        const updatedUser = await foundUser.save();
        if (updatedUser) {
            return res.status(200).json({
                header: { message: "User updated successfully", code: 0 },
                data: updatedUser,
            })
        } else {
            return res.status(400).json({
                header: { message: "User cannot be updated", code: 1 }
            })
        }
    });


//update blog
router.put('/updateblog/:id', protect,
    async (req, res) => {
        const foundBlog = await Blog.findById(req.params.id);

        if (foundBlog) {
            foundBlog.blogtitle = req.body.blogtitle || foundBlog.blogtitle;
            foundBlog.blogbody = req.body.blogbody || foundBlog.blogbody;

        } else {
            return res.status(404).json({
                header: { message: "User not found", code: 1 }
            })
        }

        const updateBlog = await foundBlog.save();
        if (updateBlog) {
            return res.status(200).json({
                header: { message: "Blog updated successfully", code: 0 },
                data: updateBlog,

            })
        } else {
            return res.status(400).json({
                header: { message: "Blog cannot be updated", code: 1 }
            })
        }
    });

// Like adding or removing
router.put('/updatelikes/:bid/:uid', protect,
    async (req, res) => {
        //bid : blog id ; uid : userid
        const foundBlog = await Blog.findById(req.params.bid);
        if (foundBlog) {
            if (foundBlog.likes.userlist.includes(req.params.uid)) {
                var index = foundBlog.likes.userlist.indexOf(req.params.uid);
                if (index !== -1) {
                    foundBlog.likes.userlist.splice(index, 1);
                }
                foundBlog.likes.count -= 1 || foundBlog.likes;
            }
            else {
                foundBlog.likes.userlist.push(req.params.uid);
                foundBlog.likes.count += 1 || foundBlog.likes;
            }
            foundBlog.blogbody = req.body.blogbody || foundBlog.blogbody;

        } else {
            return res.status(404).json({
                header: { message: "User not found", code: 1 }
            })
        }

        const updateBlog = await foundBlog.save();
        if (updateBlog) {
            return res.status(200).json({
                header: { message: "Blog updated (with like data) successfully", code: 0 },
                data: {
                    Likes: updateBlog.likes,
                },
            })
        } else {
            return res.status(400).json({
                header: { message: "Blog cannot be updated", code: 1 }
            })
        }
    });




//gets total number of users in database
router.get('/usercount', protect,
    async (req, res) => {
        const countervar = await User.collection.countDocuments();
        if (countervar > 0) {
            res.status(200).json({
                header: { message: "Total User count retreived successfuly", code: 0 },
                data: { UserCount: countervar }
            });
        } else {
            res.status(400).json({
                header: { message: "No documents found in Users collection", code: 1 },
            });
        }
    })

// gets total number of blogs in database
router.get('/blogcount', protect,
    async (req, res) => {
        const countervar = await Blog.collection.countDocuments();
        if (countervar > 0) {
            res.status(200).json({
                header: { message: "Total Blog count retreived successfuly", code: 0 },
                data: { BlogCount: countervar }
            });
        } else {

            res.status(400).json({
                header: { message: "No documents found in Blog collection", code: 1 }
            });
        }
    })

module.exports = router;





// query.countDocuments({ user_id: user.id });
        // console.log(countQuery)
        // const countervar = await Blog.collection.countDocuments({ user_id: user.id },
        //     function (err, count) {

        //         if (err) {
        //             console.log(err)
        //         } else {
        //             console.log("Count :", count)
        //         }

        //     })
