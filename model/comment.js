const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    content: {type: String},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    article: {type: Schema.Types.ObjectId, ref: 'Article'},
    countLike: {type: Number, default: 0}
}, { timestamps: true });

mongoose.model('Comment', schema);
