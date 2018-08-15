var mongoose = require('mongoose');

//账户表结构
var schema = new mongoose.Schema({
    //账户名称
    name:String
});

module.exports = schema;

