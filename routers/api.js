var express = require('express');
var routerApi = express.Router();

var User = require('../models/User');
var Content = require('../models/Content');

// 构造返回 json 格式
var responseData;
routerApi.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
});

/*
 *  用户注册
 *      1、用户名不能为空 // 不能存在同名（已注册）
 *      2、密码不能为空  // 两次密码需一样
 */
//注册接口
routerApi.post('/user/register', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    //用户名判空
    if (username === '') {
        responseData.code = '1';
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    //密码检测
    if (password === '' || repassword === '') {
        responseData.code = '2';
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    if (password !== repassword) {
        responseData.code = '3';
        responseData.message = '两次密码不一致';
        res.json(responseData);
        return;
    }
    //检测用户名是否已经被注册，如果数据库存在同名数据表示用户名已经被注册
    User.findOne({
        username: username
    }).then(function (userInfo) {
        if (userInfo) {
            responseData.code = '4';
            responseData.message = '用户名已被注册';
            res.json(responseData);
            return;
        }
        else {
            // 无上述情况//则可注册保存用户注册信息到数据库中//返回注册成功
            var userRegisterData = new User({
                username: username,
                password: password,
                isSuperAdmin: false,
                isAdmin: true
            });
            userRegisterData.save();//
            return;
        }
    }).then(function (newUserInfo) {
        console.log(newUserInfo);//
        responseData.code = '0';
        responseData.message = '成功';
        res.json(responseData);
        return;
    });

});

//用户登录
routerApi.post('/user/login', function (req, res, next) {
    var uName = req.body.username;
    var pWord = req.body.password;
    //空值等检测放在前端处理

    //后台数据验证处理
    User.findOne({
        username: uName,
        password: pWord
    }).then(function (userInfo) {
        if (!userInfo) {
            responseData.code = '1';
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        responseData.code = '0';
        responseData.message = '成功';
        //添加返回用户cookie数据
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        };
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);
        return;
    });
});

//退出
routerApi.get('/user/logout', function (req, res) {
    responseData.code = '0';
    req.cookies.set('userInfo', null);
    res.json(responseData);
    return;
});


module.exports = routerApi;
