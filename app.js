const express = require('express');
const compression = require('compression');
const mongoose = require('mongoose');
const config = require('./config');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const flash = require('express-flash');
const nunjucks = require('nunjucks');
const bluebird = require('bluebird');
const fs = require('fs');
const moment = require('moment');
const passport = require('passport');


var modelDir = path.join(__dirname, 'model');
fs.readdirSync(modelDir).filter(function (file) {
        return ~file.search(/^[^\.].*\.js$/);
    }).forEach(function (file) {
        console.log(path.join(modelDir, file));
        require(path.join(modelDir, file));
    });
mongoose.Promise = bluebird;
mongoose.connect(config.db.uri);
mongoose.connection.on('error', function(err) {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
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
if (process.env.NODE_ENV === 'development') {
    app.set('view cache', false);
}
app.use(compression());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.end('server error');
});

app.listen(config.port, function() {
    console.log('--');
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), config.port, app.get('env'));
    console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
    console.log(chalk.green('Database:        ' + config.db.uri));
    console.log(chalk.green('View cache:        ' + app.get('view cache')));
    console.log('--');

    // require('./common/init').initDB();
});
