var express = require("express");
var app = express();
var bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var campgrounds = [
    {name: "Salmon Creek", image: "https://www.photosforclass.com/download/pixabay-1846142?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c722d7bd7904bc55c_960.jpg&user=Pexels"},
    {name: "Granite Hill", image: "https://www.photosforclass.com/download/pixabay-1845719?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d1464d53a514f6da8c7dda793f7f1636dfe2564c704c722d7bd7904bc55c_960.jpg&user=Pexels"},
    {name: "Mountain Goat's Rest", image: "https://www.photosforclass.com/download/pixabay-1851092?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c722d7bd7904bc55c_960.jpg&user=Pexels"},
    {name: "Salmon Creek", image: "https://www.photosforclass.com/download/pixabay-1846142?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c722d7bd7904bc55c_960.jpg&user=Pexels"},
    {name: "Granite Hill", image: "https://www.photosforclass.com/download/pixabay-1845719?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d1464d53a514f6da8c7dda793f7f1636dfe2564c704c722d7bd7904bc55c_960.jpg&user=Pexels"},
    {name: "Mountain Goat's Rest", image: "https://www.photosforclass.com/download/pixabay-1851092?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c722d7bd7904bc55c_960.jpg&user=Pexels"},
    {name: "Salmon Creek", image: "https://www.photosforclass.com/download/pixabay-1846142?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c722d7bd7904bc55c_960.jpg&user=Pexels"},
    {name: "Granite Hill", image: "https://www.photosforclass.com/download/pixabay-1845719?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d1464d53a514f6da8c7dda793f7f1636dfe2564c704c722d7bd7904bc55c_960.jpg&user=Pexels"},
    {name: "Mountain Goat's Rest", image: "https://www.photosforclass.com/download/pixabay-1851092?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c722d7bd7904bc55c_960.jpg&user=Pexels"}
];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image =req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new")
});

app.listen(3000 , function(){
    console.log("Listen PORT 3000")
});