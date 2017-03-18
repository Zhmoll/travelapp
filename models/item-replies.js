var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemReplySchema = new Schema({
  userid: { type: Schema.ObjectId, index: true },
  itemid: { type: Schema.ObjectId, index: true },
  createdAt: { type: Date, default: new Date() },
  content: String,
  score: { type: Number, min: 0, max: 5 },
  display: { type: Boolean, default: true }
});

var ItemReply = mongoose.model('ItemReply', itemReplySchema);

module.exports = ItemReply;