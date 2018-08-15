/*
 *交易表结构
 *
 * */
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    //关联字段  // 分类的ID
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'//  关联category表中的ID 字段
    },
    user: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'//  关联user表中的ID 字段
    },
    //项目名称
    xmmc: String,
    //内容简介
    xmlx: {type: String, default: ''},
    //添加时间
    addTime: {type: Date, default: new Date()},
    //金额
    je: {type: Number, default: 0}

});

module.exports = schema;