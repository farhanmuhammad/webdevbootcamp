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


seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", {useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended : true}))
app.set("view engine","ejs");
app.use(express.static(__dirname+ "/public"));



// Campground.create(
//     {
//         name : "Moantain Goat Rest", 
//         image : "https://www.camping.hr/cmsmedia/katalog/724/140-camp-turist-indian-tents.jpg",
//         description:"This is a huge mountain so many goat to slice"
        
//     }, function(err, campground ){
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log("NEW CREATE CAMPGROUND")
//             console.log(campground);
//         }
//     });

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


app.get("/",function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
       if(err) {
           console.log(err)
       } 
       else{
           res.render("campgrounds/index",{campGrounds : campgrounds});
       }
    });
    // res.render("campgrounds",{campGrounds : campGrounds});
    
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name : name, image : image, description: desc};
    // Create a New campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/campgrounds");
        }
    })
    
})

app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new")
});

app.get("/campgrounds/:id", function(req, res) {
    //find the campground base on ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundCampground);
            //render show template
            res.render("campgrounds/show", {campground : foundCampground});
        }
    })
    
   
})
// ======================
// COMMENT ROUTES
// ======================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campground: campground});
        }
    })
})

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){

    // look up campground using ID
    Campground.findById(req.params.id, function(err,campground){
        if (err){
            console.log(err);
            redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
    // create new comment
    // connect to new comment to campground
    // redirect camground show page
})
//==========
//AUTH ROUTES
//===========
app.get("/register",function(req, res){
    res.render("register");
})
// handle sign up logic
app.post("/register", function(req, res){
    var newUser =new User({username : req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/campgrounds");
        })
    })
})

app.get("/login", function(req, res){
    res.render("login");
});
//handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
    
})

//Logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, 'localhost', function(){
    console.log("Yelp Camp Started");
})