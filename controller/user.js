const mongoose = require('mongoose');
const User = mongoose.model('User');
const validator = require('validator');
const log = require('log4js').getLogger();

exports.getLogin = function (req, res) {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('login.html', {});
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
    res.render('signup.html', {});
};

exports.postSignup = function (req, res, next) {
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
        if (value) {
            req.flash('error', '该邮箱已被注册');
            return res.redirect('/signup');
        }

        user.save(function (err) {
            if (err) {
                req.flash('error', '注册失败');
                return res.redirect('/signup');
            }

            req.logIn(user, function (err) {
                if (err) {
                    req.flash('error', '登录失败');
                    return res.redirect('/login');
                }
                req.flash('success', '注册成功');
                res.redirect('/');
            });
        });
    });
};

exports.getProfile = function (req, res) {
    res.render('profile.html', {});
};

exports.postProfile = function (req, res) {
    User.findOne().where('email').equals(req.user.email).exec().then(function (value) {
        value.nickname = req.body.nickname;
        value.website = req.body.website;
        value.address = req.body.address;
        value.about = req.body.about;
        return value.save();
    }).then(function (value) {
        req.logOut();
        req.logIn(value, function (err) {
            if (err) {
                req.flash('error', '重新登录失败');
                return res.redirect('/profile');
            }
            req.flash('success', '设置成功');
            res.redirect('/profile');
        });
    }).catch(function (reason) {
        log.error(reason);
        req.flash('error', '设置失败');
        res.redirect('/profile');
    });
};

exports.postPassword = function (req, res) {
    User.findOne().where('email').equals(req.user.email).exec().then(function (user) {
        if (user.verifyPassword(req.body.oldPassword)) {
            user.password = req.body.newPassword;
            return user.save(function (err) {
                if(err) {
                    throw err;
                } else {
                    req.flash('success', '修改密码成功');
                    res.redirect('/profile');
                }
            });
        } else {
            req.flash('error', '当前密码不正确');
            res.redirect('/profile');
        }
    }).catch(function (reason) {
        log.error(reason);
        req.flash('error', '修改密码失败');
        res.redirect('/profile');
    });
};
