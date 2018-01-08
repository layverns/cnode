const mongoose = require('mongoose');
const bluebird = require('bluebird');
const log = require('log4js').getLogger();
const _ = require('lodash');
const config = require('./index');
const path = require('path');
const fs = require('fs');

function loadModels() {
    log.info('loading mongodb models...');
    var modelDir = path.join(__dirname, '../model');
    fs.readdirSync(modelDir).filter(function (file) {
        return ~file.search(/^[^\.].*\.js$/);
    }).forEach(function (file) {
        log.debug(path.join(modelDir, file));
        require(path.join(modelDir, file));
    });
}

function connect(cb) {
    log.info('connecting mongodb...');
    mongoose.Promise = bluebird;

    mongoose
        .connect(config.db.uri, config.db.options)
        .then(function (connection) {
            if (cb) cb(connection.db);
        })
        .catch(function (err) {
            log.error('Could not connect to MongoDB!');
            log.error(err);
        });

}

function disconnect(cb) {
    mongoose.connection.db.close(function (err) {
        log.info('Disconnected from MongoDB.');
        if (cb) cb(err);
    });
}

module.exports.loadModels = loadModels;
module.exports.connect = connect;
module.exports.disconnect = disconnect;
