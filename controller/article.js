const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Category =  mongoose.model('Category');
const Comment =  mongoose.model('Comment');
const Promise = require('bluebird');
const constant = require('../common/constant');

exports.index = function (req, res, next) {

    var articleId = req.query.id;

    var article;
    var comments = [];
    var otherArticles = [];
    Promise.resolve().then(function () {
        return Article.findOne().where('_id').equals(articleId).populate({path: 'category', select: 'title'}).populate({path: 'user', select: 'nickname avatar'}).exec();
    }).then(function (value) {
        article = value;
        return Comment.find().where('article').equals(article.id).populate({path: 'user', select: 'nickname avatar'}).exec();
    }).then(function (value) {
        comments = value;
        return Article.find().where('user').equals(article.user.id).limit(5).sort({createdAt: -1}).exec();
    }).then(function (value) {
        otherArticles = value;

        res.render('article.html', { title: 'Article', article: article, comments: comments, otherArticles: otherArticles});
    }).catch(function (err) {
        next(err);
    });
};

exports.likeComment = function (req, res, next) {
    var commentId = req.query.id;

    var comment;
    Promise.resolve().then(function () {
        return Comment.findOne().where('_id').equals(commentId).exec();
    }).then(function (value) {
        comment = value;
    }).then(function (value) {
        comment = value;
        res.render('article.html', { title: 'Article', article: article, comments: comments, otherArticles: otherArticles});
    }).catch(function (err) {
        next(err);
    });
};
