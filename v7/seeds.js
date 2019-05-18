var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name : "Cloud ' rest", 
        image : "https://s3.amazonaws.com/imagescloud/images/medias/camping/pta_160902-267.jpg",
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name : "Cloud ' Cloud", 
        image : "http://blog.airyrooms.com/wp-content/uploads/2018/10/Cover-Camping-Bogor.png",
        description : "blahblahLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name : "Canyon Floor", 
        image : "https://jameskaiser.com/wp-content/uploads/2016/07/grand-canyon-backcountry-camping.jpg",
        description :"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }

]
function seedDB(){
    //remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err)
        }
        console.log("remove campgrounds")
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    console.log("add campground")
                    Comment.create(
                        {
                            text : "thix place is great, but no toilet",
                            author: "homer"
                        }, function(err,comment){
                            if (err){
                                console.log(err);
                            } 
                            else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                            
                        }
                        )
                }
            })
        })
    })
    //add a few campgrounds
   
    //add a few comments
}

module.exports = seedDB;