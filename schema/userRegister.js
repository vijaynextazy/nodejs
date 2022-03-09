const mongoose = require('mongoose');

const registerSchema = mongoose.Schema({
    name:{
        type: String,
        
    },

    email:{
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    }
})

const registerModel = mongoose.model('registerUser', registerSchema)

module.exports = registerModel;