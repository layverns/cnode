const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Category =  mongoose.model('Category');
const Promise = require('bluebird');

exports.index = function (req, res, next) {
    var page = req.query.page ? parseInt(req.query.page) : 0;
    var limit = req.query.limit ? parseInt(req.query.limit) : 20;
    var category = req.query.category ? req.query.category : 'all';
    var pages = 0;

    //Todo
    var categoryId;
    Promise.resolve().then(function () {
        if (category === 'all') {
            return Category.findOne().where('value').equals(category).exec();
        } else {
            return Category.findOne().where('value').equals(category).exec();
        }
    }).then(function (value) {
        if (value && value.id) {
            categoryId = value.id;
            return Article.count().where('category').equals(value.id).exec();
        } else {
            return Article.count().exec();
        }
    }).then(function (value) {
        pages = Math.ceil(value/limit);

        if (categoryId) {
            return Article.find().where('category').equals(categoryId).skip(page * limit).limit(limit).sort('-updatedAt').select('title updatedAt').populate({path: 'tag', select: 'title'}).exec();
        } else {
            return Article.find().where('category').nin().skip(page * limit).limit(limit).sort('-updatedAt').populate({path: 'tag', select: 'title'}).select('title updatedAt').exec();
        }
    }).then(function (value) {
        console.log("pages: %d", pages);
        console.log(value[0]);

        var pagination = [];
        var startPage = page - 2;
        while(pagination.length < 5 && startPage < pages) {
            if (startPage >= 0 && startPage < pages) {
                pagination.push(startPage);
            }
            startPage++;
        }
        res.render('home.html', { title: 'Home', articles: value, pages: pages, page: page, pagination: pagination, category:category });
    }).catch(function (err) {
        next(err);
    });
};
