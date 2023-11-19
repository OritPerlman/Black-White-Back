const mongoose = require("mongoose");
const Users = require('./usersModel');
const Videos = require('./videosModel');

let watchLaterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
      },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Videos'
      },

})
exports.WatchLaterModel = mongoose.model("watchLater", watchLaterSchema)
