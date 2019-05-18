var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp_v5", {useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended : true}))
app.set("view engine","ejs");



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

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campground: campground});
        }
    })
})

app.post("/campgrounds/:id/comments", function(req, res){

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

app.listen(3000, 'localhost', function(){
    console.log("Yelp Camp Started");
})