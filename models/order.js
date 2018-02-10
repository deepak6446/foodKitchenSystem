var Mongoose = require('mongoose');
var db = require('../config/connectMongoose.js');
	
var orderSchema =  new Mongoose.Schema ({
    name : { type : String, index: true},
    quantity : { type : Number},
    created : { type : Number},
    predicted : {type: Number}
});

orderSchema.index({name: 1}, {unique: true}); //combine key index
var order = db.model('order', orderSchema); //put collection name here

module.exports = order;