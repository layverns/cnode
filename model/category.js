const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {type: String},
    value: {type: String}
}, { timestamps: true });

mongoose.model('Category', schema);
