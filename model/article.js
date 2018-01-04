const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {type: String},
    content: {type: String},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    tag: {type: Schema.Types.ObjectId, ref: 'Tag'}
}, { timestamps: true });

mongoose.model('Article', schema);
