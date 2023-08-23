//jshint esversion:6
const dotenv = require('dotenv');
dotenv.config({
  path: "./.env"
})
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser : true}).then(console.log("Connected to MongoDB"));

const postSchema = new mongoose.Schema({
  title : String,
  contentBody : String
})

const Post = mongoose.model("Post", postSchema);


// const userSchema = new mongoose.Schema({
//   email: "String",
//   password: "String",
//   userPost: postSchema
// })

// const User = mongoose.model("User", userSchema);


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

// let posts = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", async (req, res) => {
const posts = await Post.find({});

  res.render("home", { 
    content : homeStartingContent,
    posts : posts
  });
})

app.get("/about", (req, res) => {
  res.render("about", {content : aboutContent});
})

app.get("/contact", (req, res) => {
  res.render("contact", {content : contactContent});
})

app.get("/compose", (req, res) => {
  res.render("compose");
})

app.get("/login", (req, res) => {
  res.render("login");
})

app.get("/register", (req, res) => {
  res.render("register");
})

// app.post("/register", async (req, res) => {
//   const posts = await Post.find({});
//   const newUser = new User({
//     email: req.body.username,
//     password: req.body.password
//     userPost: posts
//   })
// })

app.post("/compose", async (req, res) => {
  
  const postData = new Post ({
    title : req.body.titleText,
    contentBody : req.body.postText
  });
  
  // posts.push(postData);
  await postData.save();
  res.redirect("/");
})

app.get("/posts/:postName", async (req, res) => {
  const reqestedTitle = _.lowerCase(req.params.postName);
  
  const posts = await Post.find({});

  posts.forEach(function(post) {
    const storedTitle = _.lowerCase(post.title);
    // console.log(storedTitle);
    
    if(reqestedTitle === storedTitle) {
      res.render("post", {
        // title : post.title,
        // content : post.contentBody
        post
      })
    } 
  })
  
})

//api to delete the blog post
app.delete("/posts/:id", async (req, res) => {
    const postID = req.params.id;
    try {
       const deleted = await Post.findByIdAndDelete({
        _id : postID
       });
       res.json(deleted);
    } catch (error) {
       res.json({
        Error : "Could not deleted the post"
       })
    }
    console.log(postID);
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
