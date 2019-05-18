var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var passport = require("passport");
var localStrategy = require("passport-local");


var commentsRoutes = require("./routes/comments");
var campgroundsRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");


// seedDB(); //seed the databsae
mongoose.connect("mongodb://localhost:27017/yelp_camp_v8", {useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended : true}))
app.set("view engine","ejs");
app.use(express.static(__dirname+ "/public"));




// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : "HOHOHOHOHO",
    resave: false,
    saveUninitialized : false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);




app.listen(3000, 'localhost', function(){
    console.log("Yelp Camp Started");
})

