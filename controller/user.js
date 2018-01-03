const User = require('../model/User');

exports.getLogin = function (req, res) {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('user/login', {title: 'Login'});
};

exports.getSignup = function (req, res) {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('user/signup', {title: 'Create Account'});
};

exports.postSignup = function (req, res, next) {
    console.log(req.body);

    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({ email: req.body.email}, function (err, existUser) {
        if (err) { return next(err); }

        if (existUser) {
            console.log(existUser);
            req.flash('error', '该邮箱已经被注册了。');
            return res.redirect('/signup');
        }
        user.save(function (err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });
};
