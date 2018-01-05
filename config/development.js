module.exports = {
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cnode-dev',
        options: {}
    },
    github: {
        clientID: '0ec074a1f55fdbc615cd',
        clientSecret: '923b749d89fc3280f4cd7ede788cc446b851a113',
        callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
    }
};
