var Mongoose = require('mongoose');
Mongoose.Promise = global.Promise;

var db = Mongoose.createConnection('mongodb://localhost:27017/orderFood');

module.exports = db;
