var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//NEW - SHOW FORM TO CREATE NEW Comment
router.get("/new", middleware.isLoggedIn ,function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});
//Comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campgorund usind id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }else{
                    //add username an id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success", "Successfully Added Comment")
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    });    
});

//Comment Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
            }
        });
    });
});

//Comment Update Route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
   });
});

//Cooment Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("error", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;