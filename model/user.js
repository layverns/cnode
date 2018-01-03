const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    password: {type: String},
    nickname: {type: String}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
