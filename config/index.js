const _ = require('lodash');
const path = require('path');
const defaultConfig = require('./default');
const developmentConfig = require('./development');
const productionConfig = require('./production');

function initConfig() {
    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'development';
    }

    var config;
    if (process.env.NODE_ENV === 'production') {
        config = _.merge(defaultConfig, productionConfig);
    } else {
        config = _.merge(defaultConfig, developmentConfig);
    }
    return config;
}

module.exports = initConfig();
