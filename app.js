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

const homeController = require('./controller/home');
const userController = require('./controller/user');

mongoose.Promise = global.Promise;
mongoose.connect(config.db.uri);
mongoose.connection.on('error', function(err) {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.sessionSecret,
    store: new MongoStore({
        url: config.db.uri,
        autoReconnect: true,
        clear_interval: 3600
    })
}));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.get('/', homeController.index);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.end('server error');
});

app.listen(config.port, function() {
    console.log('--');
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), config.port, app.get('env'));
    console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
    console.log(chalk.green('Database:        ' + config.db.uri));
    console.log('--');
});
