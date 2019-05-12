var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    expressSanitizer    = require("express-sanitizer"),
    methodOverride      = require("method-override");

//APP CONFIG    
mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
mongoose.set("useFindAndModify", false);

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    create : {type : Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// BUAT NGISI TABEL PERTAMA KALI
// Blog.create({
//     title : "Test Blog Cat",
//     image : "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzEwNC84MTkvb3JpZ2luYWwvY3V0ZS1raXR0ZW4uanBn",
//     body : "Hello this is a blog cat post"
// });

//RESTFUL ROUTES

app.get("/",function(req, res) {
    res.redirect("/blogs");
})

// INDEX ROUTE
app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
            console.log("EROR")
        }
        else{
            res.render("index",{blogs : blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new",function(req, res) {
    res.render("new");
});
//created
app.post("/blogs",function(req,res){
    //create blog
    //manggil blog[body] = req.body.blog.body
    req.body.blog.body  = req.sanitize(req.body.blog.body) 
    Blog.create(req.body.blog, function(err, newBog){
        if(err)
        {
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
    //then, redirect to blogs(index)
});

//SHOW ROUTE
app.get("/blogs/:id",function(req, res) {
    var id = req.params.id
    //Blog.findbyID(id, callback)
    Blog.findById(id,function(err, foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("show", {blog : foundBlog});
        }
    })
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    var id = req.params.id;
    Blog.findById(id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else
        {
            res.render("edit", {blog: foundBlog})
        }
    })
})

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    var id = req.params.id;
    var blog = req.body.blog;
    req.body.blog.body  = req.sanitize(req.body.blog.body)
    // Blog.findByIdandUpdate(id, newData, CallBack)
    Blog.findOneAndUpdate(id, blog, function(err, updateBlog){
        if (err){
            res.redirect("/blogs")
        }
        else
        {
            res.redirect("/blogs/" + id);
        }
    })
})


//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    // res.send("YOU HAVE DESTORY ROUTE");
    //Desotry blog
    var id = req.params.id
    Blog.findByIdAndRemove(id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs");
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Running");
});