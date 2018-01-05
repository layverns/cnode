const mongoose = require('mongoose');
const User = mongoose.model('User');
var validator = require('validator');
const chalk = require('chalk');

exports.getLogin = function (req, res) {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('login.html', {title: '登录'});
};

exports.getLogout = function (req, res) {
    req.logout();
    res.redirect('/');
};

exports.postLogin = function (req, res, next) {
    console.log('postLogin');

    console.log(req.body);

    console.log(req.user);

    res.redirect('/');
};

exports.getSignup = function (req, res) {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('signup.html', {title: '用户注册'});
};

exports.postSignup = function (req, res, next) {
    console.log(req.body);
    if (!validator.isEmail(req.body.email)) {
        req.flash('error', '非法邮箱');
        return res.redirect('/signup');
    }
    if (!validator.isLength(req.body.password, {min: 6, max: 64})) {
        req.flash('error', '密码长度最少要6位');
        return res.redirect('/signup');
    }
    if (!validator.equals(req.body.password, req.body.confirmPassword)) {
        req.flash('error', '两次输入密码不符');
        return res.redirect('/signup');
    }
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne().where('email').equals(req.body.email).exec().then(function (value) {
        console.log(value);
        if (value) {
            req.flash('error', '该邮箱已被注册');
            return res.redirect('/signup');
        }

        user.save(function (err) {
            if (err) {
                console.log(chalk.red(err));
                req.flash('error', err.errmsg);
                return res.redirect('/signup');
            }
            req.flash('success', '注册成功');
            res.redirect('/');
        });
    });
};

exports.github = function (req, res) {

}
