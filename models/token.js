var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tokenGen = require('token');

var config = require('config-lite');

var tokenSchema = new Schema({
  token: { type: String, index: true },
  userid: { type: Schema.ObjectId }
});

tokenSchema.statics.createToken = function (userid, cb) {
  var newToken = tokenGen.generate(userid, {
    secret: config.token.secret,
    timeStep: config.token.maxAge
  });

  this.create({
    token: newToken,
    userid: new mongoose.Types.ObjectId(userid)
  }, function (err, token) {
    cb(err, token);
  });
};

var Token = mongoose.model('Token', tokenSchema);

module.exports = Token;