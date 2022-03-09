const mongoose = require('mongoose');

const userPostsSchema = mongoose.Schema({
    name: {
    type:String,
    required: true
    },

    image:{
        type:String,

    },
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:'registerusers' 
    },

    description:{
        type: String
    },

    location:{
        type: String
    },

   
})
const userPost = mongoose.model('user_post', userPostsSchema)
module.exports = userPost
