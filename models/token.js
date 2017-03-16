var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tokenGen = require('token-gen');

var tokenSchema = new Schema({
  token: { type: String, index: true },
  userid: { type: Schema.ObjectId }
});

tokenSchema.statics.createToken = function (userid, cb) {
  var newToken = tokenGen({
    tokenLength: 100,
    alphabet: '0123456789ACDEFGHJKLMNPQRTUVWXYZ'
  });
  console.log(newToken);
  this.create({
    token: newToken.toString(),
    userid: new mongoose.Types.ObjectId(userid)
  }, function (err, token) {
    cb(err, token.token);
  });
};

var Token = mongoose.model('Token', tokenSchema);

module.exports = Token;