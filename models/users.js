var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    index: true
  },
  password: String,
  avatar: String,
  gender: String,
  nickname: String,
  authority: { type: Number, default: 1 }
});

var User = mongoose.model('User', userSchema);

module.exports = User;