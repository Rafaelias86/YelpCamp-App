var Campground = require("../models/campground");
var Comment = require("../models/comment");
var flash = require("connect-flash");

// All the niddleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){
       Campground.findById(req.params.id, function(err, foundCampground){
           if(err || !foundCampground){
            req.flash("error", "Campground not found");
               res.redirect("back");
           }else{
               //***does user own the campground??.
               //foundCampground is a mongoose object and req.user._id is a string
               //so we can't compare with the triple equals sign (===) in the if statement
               //so we need to use the following form below that mongoose give us
               if(foundCampground.author.id.equals(req.user._id)){
                   next();
               }else{
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("back");
               }               
           }
       });  
   }else{
       res.redirect("back");
   }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){
       Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
            req.flash("error", "Comment not found");
            res.redirect("back");
           }else{
               //***does user own the comment??.
               //foundCampground is a mongoose object and req.user._id is a string
               //so we can't compare with the triple equals sign (===) in the if statement
               //so we need to use the following form below that mongoose give us
               if(foundComment.author.id.equals(req.user._id)){
                   next();
               }else{
                   req.flash("You don't have permission to do that");
                   res.redirect("back");
               }               
           }
       });  
   }else{
       req.flash("error", "You need to be logged in to that");
       res.redirect("back");
   }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to that");
    res.redirect("/login");
}

module.exports = middlewareObj;