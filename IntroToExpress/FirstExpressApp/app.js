var express = require("express");
var app = express();



app.get("/", function(req, res){
    res.send("hi there");
    
});

app.get("/bye", function(req, res){
    res.send("good bye");
})

app.get("/dog",function(req, res) {
    res.send("meoew");
});

app.get("/r/:subname", function(req, res) {
    var subname = req.params.subname;
    res.send("welcome to the to " + subname + " page");
})


app.get("*", function(req, res) {
    res.send("page not found")
});







app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started");
});