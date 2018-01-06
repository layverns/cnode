const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const config = require('./index');
const constant = require('../common/constant');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, cb) {
        User.findOne().where('email').equals(email).exec().then(function (value) {
            if (!value) {
                return cb(null, false, new Error('该邮箱尚未注册'));
            }
            if (!value.verifyPassword(password)) {
                return cb(null, false, new Error('密码错误'));
            }
            cb(null, value);
        }).catch(function (reason) {
            cb(reason);
        });
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});
passport.deserializeUser(function (id, cb) {
    User.findById(id, cb);
});

passport.use(new GithubStrategy({
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
        User.findOne().where('github.id').equals(profile._json.id).exec().then(function (value) {
            if (value) {
                return done(null, value);
            } else {
                User.findOne().where('email').equals(profile._json.email).exec().then(function (value2) {
                    if (value2) {
                        value2.github = profile._json;
                        value2.save(done);
                    } else {
                        var user = new User({
                            email: profile._json.email,
                            nickname: profile._json.name,
                            avatar: profile._json.avatar_url,
                            github: profile._json,
                            password: constant.DEFAULT_PASSWORD
                        });
                        user.save(done);
                    }
                });

            }
        }).catch(function (reason) {
            console.log(reason);
            done(reason);
        });
    }
));
