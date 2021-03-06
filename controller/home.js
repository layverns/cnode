const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const Category =  mongoose.model('Category');
const Promise = mongoose.Promise;
const constant = require('../common/constant');

exports.index = function (req, res, next) {
    var page = req.query.page ? parseInt(req.query.page) : 0;
    var limit = req.query.limit ? parseInt(req.query.limit) : 20;
    var category = req.query.category ? req.query.category : 'all';
    var pages = 0;

    //Todo
    var catFenXiangId;
    var catWenDaId;
    var catId;
    var articles;
    var articleNoComments;
    var rankUsers;
    Promise.resolve().then(function () {
        return Category.findOne().where('value').equals('fenxiang').exec();
    }).then(function (value) {
        catFenXiangId = value ? value.id : null;
        return Category.findOne().where('value').equals('wenda').exec();
    }).then(function (value) {
        catWenDaId = value ? value.id : null;
        return Category.findOne().where('value').equals(category).exec();
    }).then(function (value) {
        catId = value ? value.id : null;

        if (category === 'all') {
            return Article.count().where('category').in([catFenXiangId, catWenDaId]).exec();
        } else if (category === 'jinghua') {
            return Article.count().where('isGreat').equals(true).exec();
        } else {
            return Article.count().where('category').equals(catId).exec();
        }
    }).then(function (value) {
        pages = Math.ceil(value/limit);

        if (category === 'all') {
            return Article.find().where('category').in([catFenXiangId, catWenDaId]).skip(page * limit).limit(limit).sort({order: -1, createdAt: -1}).populate({path: 'category', select: 'title'}).populate({path: 'user', select: 'nickname avatar'}).exec();
        } else if (category === 'jinghua') {
            return Article.find().where('isGreat').equals(true).skip(page * limit).limit(limit).sort({order: -1, createdAt: -1}).populate({path: 'category', select: 'title'}).populate({path: 'user', select: 'nickname avatar'}).exec();
        } else {
            return Article.find().where('category').equals(catId).skip(page * limit).limit(limit).sort({order: -1, createdAt: -1}).populate({path: 'category', select: 'title'}).populate({path: 'user', select: 'nickname avatar'}).exec();
        }
    }).then(function (value) {
        articles = value ? value : [];

        return Article.find().where('countComment').equals(0).limit(5).sort({createdAt: -1}).select('title').exec();
    }).then(function (value) {
        articleNoComments = value ? value : [];

        return User.find().limit(10).sort({score: -1}).select('nickname score').exec();
    }).then(function (value) {
        rankUsers = value ? value : [];

        var pagination = [];
        var startPage = page - 2;
        while(pagination.length < 5 && startPage < pages) {
            if (startPage >= 0 && startPage < pages) {
                pagination.push(startPage);
            }
            startPage++;
        }
        res.render('home.html', { title: 'Home', articles: articles, pages: pages, page: page, pagination: pagination, category:category, articleNoComments: articleNoComments, rankUsers: rankUsers });
    }).catch(function (err) {
        next(err);
    });
};
