const config = require('./config');

const express = require('express');
const compression = require('compression');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const flash = require('express-flash');
const nunjucks = require('nunjucks');
const bluebird = require('bluebird');
const fs = require('fs');
const moment = require('moment');
const passport = require('passport');

require('./config/log');
const log = require('log4js').getLogger();

mongoose.Promise = bluebird;
var modelDir = path.join(__dirname, 'model');
fs.readdirSync(modelDir).filter(function (file) {
        return ~file.search(/^[^\.].*\.js$/);
    }).forEach(function (file) {
        log.debug('init mongodb model');
        log.debug(path.join(modelDir, file));
        require(path.join(modelDir, file));
    });

const app = express();
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

require('./config/passport');

const homeController = require('./controller/home');
const articleController = require('./controller/article');
const userController = require('./controller/user');
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
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.status(err.status || 500);
    res.render('error.html');
});

mongoose.connect(config.db.uri);
mongoose.connection.on('error', function(err) {
    console.error(err);
    console.error('MongoDB connection error. Please make sure MongoDB is running.');
}).once('open', function () {
    app.listen(config.port, function() {
        log.info('--');
        log.info('App is running at %s:%d', config.host, config.port);
        log.info('Environment:     ' + process.env.NODE_ENV);
        log.info('Database:        ' + config.db.uri);
        log.info('--');
        // require('./common/init').initDB();
    });
});


