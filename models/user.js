const mongoose = require('mongoose');

const buildSchema =  mongoose.Schema;

const UserSchema =  new buildSchema({
    email : {
        type:String,
        required : true
    },
    password :{
        type: String,
        required:true
    },
    createdEvents : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'EventDetails'   
        }
    ]
});

module.exports = mongoose.model('UserDetails',UserSchema)