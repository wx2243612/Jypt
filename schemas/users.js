var mongoose = require('mongoose');

//用户表结构
var schema = new mongoose.Schema({
    username: String,
    password: String,
    //是否是超级管理员
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    //是否是管理员
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = schema;


