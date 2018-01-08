const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const moment = require('moment');
const compression = require('compression');
const passport = require('passport');
const path = require('path');
const config = require('./index');
require('./passport');
const log = require('log4js').getLogger();

const homeController = require('../controller/home');
const articleController = require('../controller/article');
const userController = require('../controller/user');

function init(db) {
    log.info('initializing express...');
    var app = express();

    var env = nunjucks.configure('views', {
        autoescape: true,
        express: app,
        noCache: true
    });
    env.addFilter('formatDate', function(str) {
        return moment(str).format('YYYY-MM-DD HH:mm');
    });
    app.use(compression());
    app.use(flash());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(session({
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        },
        resave: true,
        saveUninitialized: true,
        secret: config.sessionSecret,
        store: new MongoStore({
            url: config.db.uri,
            autoReconnect: true
        })
    }));
    app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function (req, res, next) {
        res.locals.user = req.user;
        next();
    });
    app.get('/', homeController.index);
    app.get('/article', articleController.index);
    app.get('/signup', userController.getSignup);
    app.post('/signup', userController.postSignup);
    app.get('/login', userController.getLogin);
    app.get('/logout', userController.getLogout);
    app.post('/login', passport.authenticate('local',
        { failureRedirect: '/login',
            failureFlash: true }),
        userController.postLogin);
    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function (req, res) {
        res.redirect(req.session.returnTo || '/');
    });
    app.get('/profile', userController.getProfile);
    app.post('/profile', userController.postProfile);
    app.post('/password', userController.postPassword);

// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('未找到页面');
        err.status = 404;
        next(err);
    });

    app.use(function(err, req, res, next) {
        res.locals.messages.error = err.message;
        res.status(err.status || 500);
        res.render('error.html');
    });

    return app;
}

module.exports.init = init;
