var express = require("express");
var app = express();

app.get("/", function(req,res){
    res.send("Hi there, welcome to my assignment");
});

app.get("/speak/:animal",function(req,res){
   var sounds = {
       pig :"Oinks",
       cow :"Moo",
       dog : "Woof Woff"
       
   }
   
   var animal = req.params.animal.toLowerCase();
   var sound = sounds[animal];
   res.send("The " + animal + " Sounds " + sound);
});

app.get("/repeat/:word/:numRepeat",function(req, res) {
    var word = req.params.word;
    var numRepeat = Number(req.params.numRepeat);
    var result = "";
    
    for (var i = 0; i < numRepeat; i++)
    {
        result += word + " ";
    }
    res.send(result);
});

app.get("*",function(req, res) {
    res.send("Sorry Page not Found")
})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started");
});