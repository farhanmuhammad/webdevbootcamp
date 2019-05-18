var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user");
    localStrategy = require("passport-local"),
    passportLocalMongoose= require("passport-local-mongoose"),
    app = express();


mongoose.connect("mongodb://localhost:27017/auth_demo_app",{useNewUrlParser:true});
app.use(require("express-session")({
    secret: "Rusty is the best and cutes dog",
    resave: false,
    saveUninitialized : false
}))

app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ==========
// ROUTES
// ==========

app.get("/", function(req,res){
    res.render("home")
})

app.get("/secret", isLoggedIn,function(req,res){
    res.render("secret");
})

// AUTH ROUTES
// show sign yup form
app.get("/register",function(req, res){
    res.render("register");
})
//handling user sign up
app.post("/register", function(req,res){
    var username = req.body.username
    var password = req.body.password
    User.register(new User({username : req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        })
    })
})
// LOGIN ROUTES
//RENDER LOGIN FORM
app.get("/login",function(req,res){
    res.render('login');
})
//login logic
//middleware
app.post("/login", passport.authenticate("local",{
    successRedirect: "secret",
    failureRedirect: "/login"
}), function(req, res){
});

//logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req, res ,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

app.listen(3000,'localhost',function(){
    console.log("server started");
})