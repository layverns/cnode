var log4js = require('log4js');

if (process.env.NODE_ENV === 'development') {
    log4js.configure({
        appenders: {
            console: { type: 'console' },
            file: { type: 'file', filename: 'log/development.log', maxLogSize: 10*1024*1024,  backups: 3, compress: true }
        },
        categories: {
            default: { appenders: [ 'console', 'file' ], level: 'all' }
        }
    });
} else {
    log4js.configure({
        appenders: {
            console: { type: 'console' },
            file: { type: 'file', filename: 'log/production.log', maxLogSize: 10*1024*1024,  backups: 3, compress: true }
        },
        categories: {
            default: { appenders: [ 'console', 'file' ], level: 'warn' }
        }
    });
}
