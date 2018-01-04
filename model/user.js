const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    email: {type: String, unique: true},
    password: {type: String},
    nickname: {type: String}
}, { timestamps: true });

mongoose.model('User', schema);
