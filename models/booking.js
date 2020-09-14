const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema =  new Schema({
    event : {
        type : Schema.Types.ObjectId,
        ref : 'EventDetails'
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'UserDetails'
    },
}, {timestamps : true}
);

module.exports =  mongoose.model('Booking',bookingSchema);

