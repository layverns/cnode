module.exports = {
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cnode-prod',
        options: {}
    }
};
