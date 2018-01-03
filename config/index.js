const _ = require('lodash');
const path = require('path');
const defaultConfig = require('./default');
const developmentConfig = require('./development');
const productionConfig = require('./production');
const chalk = require('chalk');

function initConfig() {
    if (!process.env.NODE_ENV) {
        console.error(chalk.red('Error: NODE_ENV is not defined! Using default development environment'));
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
