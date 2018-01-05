const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    comment: {type: Schema.Types.ObjectId, ref: 'Comment'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    like: {type: Boolean, default: false}
}, { timestamps: true });

mongoose.model('CommentLike', schema);
