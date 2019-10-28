var express = require("express");
var app = express();
var PORT = process.env.PORT || 7000;
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
require("dotenv").config();


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/yelp_camp";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Laguna El Suero", 
//         image: "https://s1.wklcdn.com/image_67/2011857/35139636/22937242Master.jpg",
//         description: "This is a huge Granite Hill no water no bathrooms. Beautiful Granite"
//     }, function (err, campground) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("Newly Created Campground: ");
//             console.log(campground);
//         }
//     });


app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    //Get all the campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index", { campgrounds: campgrounds });
        }
    });
});

app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    })
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new")
});

app.get("/campgrounds/:id", function(req, res){
    //find the campground with provieded ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
             //render show template with that campground
             res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});


