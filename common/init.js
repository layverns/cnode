const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Category =  mongoose.model('Category');
const Comment =  mongoose.model('Comment');
const User =  mongoose.model('User');
const Promise = mongoose.Promise;

exports.initDB = function () {


    Promise.resolve().then(function () {
        return dropUser();
    }).then(function () {
        return dropCategory();
    }).then(function () {
        return dropArticle();
    }).then(function () {
        return dropComment();
    }).then(function () {
        return initUser();
    }).then(function () {
        return initCategory();
    }).then(function () {
        return initArticle();
    }).then(function () {
        return initComment();
    }).then(function () {
        console.log('init done');
    }).catch(function (reason) {
        console.log(reason);
    });
};

function dropUser() {
    console.log('dropUser');
    return new Promise(function (resovle, reject) {
        User.remove({email: {$ne: ''}}).then(function (value) {
            resovle();
        }).catch(function (reason) {
            reject(reason);
        });
    });
}

function dropCategory() {
    console.log('dropCategory');
    return new Promise(function (resovle, reject) {
        Category.remove({title: {$ne: ''}}).then(function (value) {
            resovle();
        }).catch(function (reason) {
            reject(reason);
        });
    });
}

function dropArticle() {
    console.log('dropArticle');
    return new Promise(function (resovle, reject) {
        Article.remove({title: {$ne: ''}}).then(function (value) {
            resovle();
        }).catch(function (reason) {
            reject(reason);
        });
    });
}
function dropComment() {
    console.log('dropComment');
    return new Promise(function (resovle, reject) {
        Comment.remove({content: {$ne: ''}}).then(function (value) {
            resovle();
        }).catch(function (reason) {
            reject(reason);
        });
    });
}
function initUser() {
    console.log('initUser');
    return new Promise(function (resovle, reject) {
        var cats = [
            new User({
                email: '1111@qq.com',
                password: '1111',
                nickname: '1111',
                avatar: 'data:image/png;base64,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'
            }),
            new User({
                email: '2222@qq.com',
                password: '2222',
                nickname: '2222',
                avatar: 'data:image/png;base64,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'
            }),
            new User({
                email: '3333@qq.com',
                password: '3333',
                nickname: '3333',
                avatar: 'data:image/png;base64,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'
            })
        ];

        User.create(cats).then(function (value) {
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

        var catFen;
        var catWen;
        var userId;
        var userId3;
        Promise.resolve().then(function () {

            return Category.findOne().where('value').equals('fenxiang').exec();
        }).then(function (value) {
            catFen = value ? value : {};
            return User.findOne().where('nickname').equals('1111').exec();
        }).then(function (value) {
            userId = value ? value.id : null;
            var articles = [];
            for (var i = 0; i < 20; i++) {
                (function () {
                    var article = new Article({
                        title: i + '文章' + catFen.title,
                        content: '文章内容' + catFen.title,
                        category: catFen.id,
                        user: userId
                    });
                    if (i === 4) {
                        article = new Article({
                            title: i + '文章' + catFen.title,
                            content: '文章内容' + catFen.title,
                            category: catFen.id,
                            user: userId,
                            isGreat: true
                        });
                    }
                    if (i === 10) {
                        article = new Article({
                            title: i + '文章' + catFen.title,
                            content: '文章内容' + catFen.title,
                            category: catFen.id,
                            user: userId,
                            isGreat: true,
                            order: 100
                        });
                    }
                    articles.push(article);
                })();
            }

            return Article.create(articles);
        }).then(function (value) {

            return Category.findOne().where('value').equals('wenda').exec();
        }).then(function (value) {
            catWen = value ? value : {};

            return User.findOne().where('nickname').equals('2222').exec();
        }).then(function (value) {
            var articles = [];
            for (var i = 0; i < 20; i++) {
                (function () {
                    var article = new Article({
                        title: i + '文章' + catWen.title,
                        content: '文章内容' + catWen.title,
                        category: catWen.id,
                        user: value.id
                    });
                    if (i === 4) {
                        article = new Article({
                            title: i + '文章' + catWen.title,
                            content: '文章内容' + catWen.title,
                            category: catWen.id,
                            user: value.id,
                            isGreat: true
                        });
                    }
                    articles.push(article);
                })();
            }

            return Article.create(articles);
        }).then(function (value) {
            return User.findOne().where('nickname').equals('3333').exec();
        }).then(function (value) {
            userId3 = value ? value.id : null;

            return Category.findOne().where('value').equals('zhaoping').exec();
        }).then(function (value) {
            var articles = [];
            for (var i = 0; i < 20; i++) {
                (function () {
                    var article = new Article({
                        title: i + '文章' + value.title,
                        content: '文章内容' + value.title,
                        category: value.id,
                        user: userId3
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

function initComment() {
    console.log('initComment');
    return new Promise(function (resovle, reject) {
        var user1;
        var user2;
        var user3;
        var article;
        Promise.resolve().then(function () {
            return User.findOne().where('nickname').equals('1111').exec();
        }).then(function (value) {
            user1 = value;
            return User.findOne().where('nickname').equals('2222').exec();
        }).then(function (value) {
            user2 = value;
            return User.findOne().where('nickname').equals('3333').exec();
        }).then(function (value) {
            user3 = value;
            return Article.findOne().where('order').equals(100).exec();
        }).then(function (value) {
            article = value;

            var array = [];
            for (var i = 0; i < 20; i++) {
                (function () {
                    var obj = new Comment({
                        content: '文章评论',
                        article: article.id,
                        user: user1.id
                    });
                    if (i % 3 === 0) {
                        obj = new Comment({
                            content: '文章评论1',
                            article: article.id,
                            user: user1.id
                        });
                    } else if (i % 3 === 1) {
                        obj = new Comment({
                            content: '文章评论2',
                            article: article.id,
                            user: user2.id
                        });
                    } else if (i % 3 === 2) {
                        obj = new Comment({
                            content: '文章评论3',
                            article: article.id,
                            user: user3.id
                        });
                    }

                    array.push(obj);
                })();
            }
            return Comment.create(array);
        }).then(function (value) {
            resovle();
        }).catch(function (reason) {
            reject(reason);
        })
    });
}
