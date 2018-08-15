var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var User = require('../models/User');
var Content = require('../models/Content');

var data;

//处理通用数据
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    };
    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    })
});
//程序主入口 Login

router.get('/', function (req, res, next) {
    var reqPage = Number((req.query.page) === undefined ? 0 : req.query.page);
    data.category = req.query.category || '';
    data.count = 0;
    //分页
    data.page = reqPage <= 0 ? 1 : reqPage;
    data.limit = 5;
    data.pages = 0;
    //查询筛选条件
    var whereStr = {};
    if (data.category) {
        whereStr.category = data.category;
    }
    //如果用户未登录//游客 则只显示 首页--即无自己定制版块


    //读取某用户所有分类信息
    Category.find().where(whereStr).then(function (count) {

        data.count = count;
        //总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min(data.page, data.pages);
        //取值不能小于 1
        data.page = Math.max(data.page, 1);

        var skip = (data.page - 1) * data.limit;
        return Content.where(whereStr).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        });

    }).then(function (contents) {
        data.contents = contents;
        res.render('main/mainIndex', data);
    });

});

//内容详情
router.get('/view', function (req, res, next) {
    var contentID = req.query.contentID || '';
    Content.findOne({
        _id: contentID
    }).then(function (content) {
        data.content = content;
        console.dir(data);
        content.save();
        res.render('main/viewDetail', data);
    });
});

module.exports = router;