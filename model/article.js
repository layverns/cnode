const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {type: String},
    content: {type: String},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    isGreat: {type: Boolean, default: false},
    order: {type: Number, default: 0},
    countView: {type: Number, default: 0},
    countComment: {type: Number, default: 0}
}, { timestamps: true });

mongoose.model('Article', schema);
