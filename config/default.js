module.exports = {
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cnode-dev',
        options: {}
    },
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    sessionSecret: 'cnode secret'
};
