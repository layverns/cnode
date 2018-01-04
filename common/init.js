const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Category =  mongoose.model('Category');
const Tag =  mongoose.model('Tag');
const Promise = require("bluebird");

exports.initDB = function () {


    Promise.resolve().then(function () {
        return dropCategory();
    }).then(function () {
        return dropArticle();
    }).then(function () {
        return initCategory();
    }).then(function () {
        return initTag();
    }).then(function () {
        return initArticle();
    }).then(function () {
        console.log('init done');
    }).catch(function (reason) {
        console.log(reason);
    });
};

function dropCategory() {
    console.log('dropCategory');
    return new Promise(function (resovle, reject) {
        Category.remove({_id: {$ne: null}}).then(function (value) {
            resovle();
        }).catch(function (reason) {
            reject(reason);
        });
    });
}

function dropArticle() {
    console.log('dropArticle');
    return new Promise(function (resovle, reject) {
        Category.remove({_id: {$ne: null}}).then(function (value) {
            resovle();
        }).catch(function (reason) {
            reject(reason);
        });
    });
}

function initTag() {
    console.log('initTag');
    return new Promise(function (resovle, reject) {
        var cats = [
            new Tag({
                title: '分享',
                value: 'fenxiang'
            }),
            new Tag({
                title: '问答',
                value: 'wenda'
            }),
            new Tag({
                title: '精华',
                value: 'jinghua'
            }),
            new Tag({
                title: '顶置',
                value: 'dingzhi'
            })
        ];

        Tag.create(cats).then(function (value) {
            resovle();
        }).catch(function (reason) {
            reject(reason);
        });
    });
}

function initCategory() {
    console.log('initCategory');
    return new Promise(function (resovle, reject) {
        var cats = [
            new Category({
                title: '分享',
                value: 'fenxiang'
            }),
            new Category({
                title: '问答',
                value: 'wenda'
            }),
            new Category({
                title: '招聘',
                value: 'zhaoping'
            })
        ];

        Category.create(cats).then(function (value) {
            resovle();
        }).catch(function (reason) {
            reject(reason);
        });
    });
}

function initArticle() {
    console.log('initArticle');
    return new Promise(function (resovle, reject) {
        var tagFengXiang;
        var tagWenDa;

        Promise.resolve().then(function () {
            return Tag.findOne().where('value').equals('fenxiang').exec();
        }).then(function (value) {
            tagFengXiang = value;

            return Category.findOne().where('value').equals('fenxiang').exec();
        }).then(function (value) {
            var articles = [];
            for (var i = 0; i < 100; i++) {
                (function () {
                    var article = new Article({
                        title: '文章' + value.title,
                        content: '文章内容' + value.title,
                        category: value.id,
                        tag: tagFengXiang.id
                    });
                    articles.push(article);
                })();
            }

            return Article.create(articles);
        }).then(function (value) {
            return Tag.findOne().where('value').equals('wenda').exec();
        }).then(function (value) {
            tagWenDa = value;

            return Category.findOne().where('value').equals('wenda').exec();
        }).then(function (value) {
            var articles = [];
            for (var i = 0; i < 100; i++) {
                (function () {
                    var article = new Article({
                        title: '文章' + value.title,
                        content: '文章内容' + value.title,
                        category: value.id,
                        tag: tagWenDa.id
                    });
                    articles.push(article);
                })();
            }

            return Article.create(articles);
        }).then(function (value) {
            return Category.findOne().where('value').equals('zhaoping').exec();
        }).then(function (value) {
            var articles = [];
            for (var i = 0; i < 100; i++) {
                (function () {
                    var article = new Article({
                        title: '文章' + value.title,
                        content: '文章内容' + value.title,
                        category: value.id
                    });
                    articles.push(article);
                })();
            }

            return Article.create(articles);
        }).then(function (value) {
            resovle();
        }).catch(function (reason) {
            reject(reason);
        })
    });
};
