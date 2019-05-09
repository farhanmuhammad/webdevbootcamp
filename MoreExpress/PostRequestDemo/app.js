var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");


 var friends = ["tony", "test", "justin", "wekeke", "wehehhe"];

app.get("/",function(req, res){
    res.render("home");
})


app.post("/addfriend", function(req, res){
    var newNameFriend = req.body.newNameFriend;
    friends.push(newNameFriend);
    res.redirect("/friends");
});

app.get("/friends", function(req, res){
    res.render("friends",{friends:friends});
})



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started");
})