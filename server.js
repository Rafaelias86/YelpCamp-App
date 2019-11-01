var express = require("express");
var app = express();
var PORT = process.env.PORT || 7000;
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
require("dotenv").config();
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");

// APP CONFIG
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/yelp_camp";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//Passport Configuration
app.use(require("express-session")({
    secret: "Whatever you want to put in this message it doesn't matter",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})


app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX ROUTE SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function (req, res) {
    //Get all the campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

//CREATE ROUTE
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

//NEW - SHOW FROM TO CREATE NEW CAMPGROUND
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new")
});

//SHOW ROUTE- SHOWS MORE INFO ABOUT ONE SPECIFC CAMPGROUND 
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provieded ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
             //render show template with that campground
             res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
//========= 
//COMMENTS ROUTES
//NEW - SHOW FROM TO CREATE NEW Comment
app.get("/campgrounds/:id/comments/new", isLoggedIn ,function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    //lookup campgorund usind id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
    //create a new comment
    //conect new comment to campground
    //redirect campground show page
});

///AUTH ROUTES

//SHOW REGISTER FORM
app.get("/register", function(req, res){
    res.render("register");
});
//handling sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login", function(req, res){
    res.render("login");
});
//handling login
app.post("/login",passport.authenticate("local",
 {
     successRedirect:"/campgrounds",
     failureRedirect:"/login"
    }), function(req, res){ 
});

//logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});


