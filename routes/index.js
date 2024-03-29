var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var flash = require("connect-flash");

//Root route
router.get("/", function (req, res) {
    res.render("landing");
});

//SHOW REGISTER FORM
router.get("/register", function(req, res){
    res.render("register");
});

//handling sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Welcome to YelpCamp" + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});
//handling login
router.post("/login",passport.authenticate("local",
 {
     successRedirect:"/campgrounds",
     failureRedirect:"/login"
    }), function(req, res){ 
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});



module.exports = router;

// function Car(make, model, year){
//     this.make = make;
//     this.model = model;
//     this.year = year;
//     this.isRunning = false;
// }

// Car.prototype.turnOn = function(){
//     this.isRunning = true;
// }

// Car.prototype.turnOff = function(){
//     this.isRunning = false;
// }

// Car.prototype.honk = function(){
//     if(this.isRunning){
//         return "beep";
//     }
// }



