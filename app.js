//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const favicon = require('serve-favicon');

const homeStartingContent = "In today's fast-paced world, mastering productivity is the key to achieving your goals and maintaining a healthy work-life balance. From time management techniques to efficient goal-setting, our blog is your source for valuable productivity insights. Discover how to prioritize tasks, eliminate distractions, and stay focused, even in the most demanding environments. We'll share practical tips and expert advice to help you make the most of your time and accomplish more with less stress. Join us on this journey to unlock your full potential and boost your productivity in every aspect of life.";
const aboutContent = "Welcome to my blog page, your source for diverse insights and practical advice. We're dedicated to enhancing your knowledge and life experience across various domains, from tech and travel to wellness and personal growth. Our team of passionate writers and experts is here to inspire and empower you. Explore our content to discover the tools and ideas you need to live a more informed, productive, and fulfilling life. Join us on this journey of learning, creativity, and community.";
const contactContent = "We value your feedback and welcome your inquiries. If you have any questions, suggestions, or collaboration opportunities, please don't hesitate to get in touch. You can reach us at xyz@gmail.com for all communication. We're always excited to connect with our readers, fellow bloggers, and potential partners. Feel free to drop us a line, and we'll do our best to respond promptly. Thank you for being a part of our community!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(favicon(__dirname + '/public/images/favicon.ico')); 

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
