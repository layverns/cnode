require('./config/log');
const config = require('./config');
const log = require('log4js').getLogger();
const mongooseService = require('./config/mongoose');
mongooseService.loadModels();
const expressService = require('./config/express');

mongooseService.connect(function (db) {

    var app = expressService.init(db);
    app.listen(config.port, function() {
        log.info('--');
        log.info('App is running at http://%s:%d', config.host, config.port);
        log.info('Environment:     ' + process.env.NODE_ENV);
        log.info('Database:        ' + config.db.uri);
        log.info('--');
    });
});
