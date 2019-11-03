var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX ROUTE SHOW ALL CAMPGROUNDS
router.get("/", function (req, res) {
    //Get all the campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

//CREATE ROUTE add new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: desc, author: author, price: price};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect to campgrounds page
            // console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    })
});

//NEW - SHOW FROM TO CREATE NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new")
});

//SHOW ROUTE- SHOWS MORE INFO ABOUT ONE SPECIFC CAMPGROUND 
router.get("/:id", function(req, res){
    //find the campground with provieded ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
            console.log(err);
        }else{
             //render show template with that campground
             res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground:foundCampground});        
                //***does user own the campground??.
                //foundCampground is a mongoose object and req.user._id is a string
                //so we can't compare with the triple equals sign (===) in the if statement
                //so we need to use the following form below that mongoose give us                         
        });  
});

//Update Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the corect campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/capmgrounds");
            console.log(err);
        }else{
            req.flash("success", "Post Deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;