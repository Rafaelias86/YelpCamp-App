var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            //ref just refire to the model that we gonna to refer with this object
            ref: "User"
        },
        username: String
    }
});

var Comment = mongoose.model("Comment", commentSchema);


module.exports = Comment;